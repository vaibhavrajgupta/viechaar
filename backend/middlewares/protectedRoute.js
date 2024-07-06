import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

const protectedRoute = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) throw new ApiError(401, "Unauthorized request");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;

		next();
	} catch (error) {
		throw new ApiError(500, error?.message || "Invalid token access.....");
	}
});

export default protectedRoute;
