import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
	try {
		const { recipientId, message } = req.body;
		let { img } = req.body;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url();
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "",
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		res
			.status(200)
			.json(
				new ApiResponse(200, newMessage, "Message sent successfully......")
			);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const getMessages = asyncHandler(async (req, res) => {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		if (!conversation)
			return res
				.status(404)
				.json(new ApiResponse(404, {}, "Conversation not found"));

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		res
			.status(200)
			.json(new ApiResponse(200, messages, "Retrieved messages successfully"));
	} catch (error) {
		res.status(500).json(new ApiResponse(404, {}, error.message));
	}
});

const getConversations = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({
			participants: userId,
		}).populate({
			path: "participants",
			select: "username profilePic",
		}).sort({ createdAt: -1 });

		conversations
			.forEach((conversation) => {
				conversation.participants = conversation.participants.filter(
					(participant) => participant._id.toString() !== userId.toString()
				);
			})
			
		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					conversations,
					"Conversations fetched successfully"
				)
			);
	} catch (error) {
		res.status(500).json(new ApiResponse(500, {}, error.message));
	}
});

export { sendMessage, getMessages, getConversations };
