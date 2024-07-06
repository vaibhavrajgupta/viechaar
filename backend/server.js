import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

connectToDB()
	.then(() => {
		server.listen(port || 7000, () => {
			console.log("Server is running at port : " + port);
		});
	})
	.catch((error) => {
		console.log("Error occured while setting up the server !!!! ", error);
});
