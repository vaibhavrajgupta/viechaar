import { Server } from "socket.io";
import http from "http";
import express from "express";
import Messsage from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {};

export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

console.log("Hello from backend");
io.on("connection", (socket) => {
	console.log("User connected : " + socket.id);

	socket.on("error", (err) => {
		console.error("Socket.IO error:", err);
	});
});

export { io, server, app };
