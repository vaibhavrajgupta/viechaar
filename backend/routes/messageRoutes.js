import { Router } from "express";

import protectedRoute from "../middlewares/protectedRoute.js";
import { getConversations, getMessages, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.route("/conversations").get(protectedRoute, getConversations);
router.route("/:otherUserId").get(protectedRoute, getMessages);
router.route("/").post(protectedRoute, sendMessage);

export default router;
