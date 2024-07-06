import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = asyncHandler(async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if ([postedBy, text].some((field) => field?.trim() === "")) {
			return res
				.status(400)
				.json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) return res.status(404).json({ error: "User not found" });

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res
				.status(400)
				.json({ error: `Text must be less than ${maxLength} characters` });
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		await User.findByIdAndUpdate(postedBy, { $push: { posts: newPost._id } });

		return res
			.status(200)
			.json(new ApiResponse(200, newPost, "Post created successfully"));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while creating the post... "
		);
	}
});

const getPost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) res.status(404).json(404, {}, "Post not found");

		res
			.status(200)
			.json(new ApiResponse(200, post, "Post fetched successfully"));
	} catch (error) {
		throw new ApiError(500, error?.message || "Not able to fetch the post");
	}
});

const deletePost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) res.status(404).json(new ApiResponse(404, {}, "Post not found"));

		if (post.postedBy.toString() !== req.user._id.toString()) {
			res
				.status(404)
				.json(new ApiResponse(404, {}, "Unauthorized to delete the post"));
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);
		await User.findByIdAndUpdate(req.user._id, {
			$pull: { posts: req.params.id },
		});

		res
			.status(200)
			.json(new ApiResponse(200, post, "Post deleted successfully"));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while deleting the post"
		);
	}
});

const likeUnlikePost = asyncHandler(async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json(new ApiResponse(404, {}, "Post not found.."));
		}

		const userLikedPost = post.likes.includes(userId);
		if (userLikedPost) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res
				.status(200)
				.json(new ApiResponse(200, {}, "Post unliked successfully"));
		} else {
			post.likes.push(userId);
			await post.save();
			res.status(200).json(new ApiResponse(200, {}, "Post liked successfully"));
		}
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while like & unliking post. "
		);
	}
});

const replyToPost = asyncHandler(async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text)
			return res
				.status(400)
				.json(new ApiResponse(400, {}, "Text field is required...."));

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json(404, {}, "Post not found");

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res
			.status(200)
			.json(new ApiResponse(201, reply, "Successfully replied to post..."));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while replying to post. "
		);
	}
});

const getFeedPosts = asyncHandler(async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;
		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
			createdAt: -1,
		});

		res
			.status(200)
			.json(new ApiResponse(200, feedPosts, "Feed fetched successfully"));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while fetching the feeds. "
		);
	}
});

const getUserPosts = asyncHandler(async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({
			createdAt: -1,
		});

		res
			.status(200)
			.json(new ApiResponse(200, posts, "User Posts fetched successfully."));
	} catch (error) {
		throw new ApiError(
			500,
			error?.message || "Error came while getting the user posts. "
		);
	}
});

export {
	createPost,
	getPost,
	deletePost,
	likeUnlikePost,
	replyToPost,
	getFeedPosts,
	getUserPosts,
};
