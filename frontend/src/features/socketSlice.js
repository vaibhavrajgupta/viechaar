import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
	socket: null,
	onlineUsers: [],
};

const socketSlice = createSlice({
	name: "socket",
	initialState,
	reducers: {
		setSocket: (state, action) => {
			state.socket = action.payload;
		},
		setOnlineUsers: (state, action) => {
			state.onlineUsers = action.payload;
		},
	},
});

export const { setSocket, setOnlineUsers } = socketSlice.actions;

export const initializeSocket = (userId) => (dispatch) => {
	console.log("Initializing socket with userId: ", userId);
	
	const socket = io("/", {
		query: {
			userId,
		},
	});

	socket.on("connect", () => {
		console.log("Socket connected: ", socket.id); // Debug log
	});

	dispatch(setSocket(socket));

	socket.on("getOnlineUsers", (users) => {
		dispatch(setOnlineUsers(users));
	});

	return () => socket && socket.close();
};

export default socketSlice.reducer;
