import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../config/jwtcookie.config.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = asyncHandler(async (req, res) => {
	const { query } = req.params;
	try {
		let user;

		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query })
				.select("-password")
				.select("-updatedAt");
		} else {
			user = await User.findOne({ username: query })
				.select("-password")
				.select("-updatedAt");
		}

		// if (!user) res.status(404).json(new ApiResponse(404, {}, "User not found"));
		if (!user) return res.status(404).json({ error: "User not found" });

		return res.status(201).json(new ApiResponse(200, user, "Successfull"));
	} catch (error) {
		throw new ApiError(500, error?.message || "Error in getUserProfile: ");
	}
});

const signupUser = asyncHandler(async (req, res) => {
	try {
		const { name, email, username, password } = req.body;
		if (
			[name, email, username, password].some((field) => field?.trim() === "")
		) {
			throw new ApiError(400, "All fields are required");
		}

		const existedUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existedUser) {
			// throw new ApiError(409, "User with email or username already exists");
			res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			username,
			email,
			password: hashedPassword,
		});
		await newUser.save();

		const createdUser = await User.findById(newUser._id).select(
			"-password -followers -following -posts -isFrozen -createdAt -updatedAt -__v"
		);

		if (!createdUser) {
			throw new ApiError(
				500,
				"Something went wrong while registering the user"
			);
		}
		if (newUser) generateTokenAndSetCookie(newUser._id, res);

		return res
			.status(201)
			.json(new ApiResponse(200, createdUser, "User registered Successfully"));
	} catch (error) {
		throw new ApiError(500, error?.message || "Error in signup user");
	}
});

const loginUser = asyncHandler(async (req, res) => {
	try {
		const { username, password } = req.body;
		if ([username, password].some((field) => field?.trim() === "")) {
			throw new ApiError(400, "All fields are required");
		}

		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordCorrect)
			return res.status(400).json({ error: "Invalid username or password" });

		generateTokenAndSetCookie(user._id, res);

		const loggedInUser = await User.findById(user._id).select(
			"-password -followers -following -posts -isFrozen -createdAt -updatedAt -__v"
		);

		return res
			.status(200)
			.json(new ApiResponse(200, loggedInUser, "User logged In Successfully"));
	} catch (error) {
		throw new ApiError(500, error?.message || "Error in logging In user");
	}
});

const logoutUser = asyncHandler(async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json(new ApiResponse(200, {}, "User logged Out"));
	} catch (error) {
		throw new ApiError(500, error?.message || "Error in logging Out user");
	}
});

const checkAvailability = asyncHandler(async (req, res) => {
	try {
		const { type, value } = req.query;
		let user = null;
		if (type === "email") {
			user = await User.findOne({ email: value });
		} else if (type === "username") {
			user = await User.findOne({ username: value });
		} else {
			throw new ApiError(400, "Invalid type specified");
		}

		if (user) {
			res
				.status(200)
				.json(
					new ApiResponse(
						200,
						true,
						`${type.charAt(0).toUpperCase() + type.slice(1)} is already taken`
					)
				);
		} else {
			res
				.status(204)
				.json(
					new ApiResponse(
						204,
						false,
						`${type.charAt(0).toUpperCase() + type.slice(1)} is available`
					)
				);
		}
	} catch (error) {
		throw new ApiError(500, error?.message || "Error in checking");
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) throw new ApiError(500, "User not found");

		if (req.params.id !== userId.toString())
			throw new ApiError(500, "You don't have access to update else profile");

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(
					user.profilePic.split("/").pop().split(".")[0]
				);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		user.password = null;

		res
			.status(200)
			.json(new ApiResponse(200, user, "User updated successfully"));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error occurred in updating the user"
		);
	}
});

const followUnfollowUser = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res
				.status(400)
				.json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser)
			return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res
				.status(200)
				.json(
					new ApiResponse(200, userToModify, "User unfollowed Successfully")
				);
		} else {
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res
				.status(200)
				.json(new ApiResponse(200, userToModify, "User followed Successfully"));
		}
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error occurred in the follow/unfollow user"
		);
	}
});

export {
	signupUser,
	loginUser,
	logoutUser,
	updateUser,
	followUnfollowUser,
	getUserProfile,
	checkAvailability,
};
