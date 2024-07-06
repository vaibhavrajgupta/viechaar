import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
	createPost,
	deletePost,
	getFeedPosts,
	getPost,
	getUserPosts,
	likeUnlikePost,
	replyToPost,
} from "../controllers/postController.js";

const router = Router();

router.route("/feed").get(protectedRoute, getFeedPosts);
router.route("/create").post(protectedRoute, createPost);
router.route("/like/:id").put(protectedRoute, likeUnlikePost);
router.route("/reply/:id").put(protectedRoute, replyToPost);
router.route("/user/:username").get(getUserPosts);
router.route("/:id").get(getPost);
router.route("/:id").delete(protectedRoute, deletePost);

export default router;
