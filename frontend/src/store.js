import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import authScreenReducer from "./features/authScreenSlice";
import postReducer from "./features/postSlice";
import conversationReducer from "./features/conversationsSlice";
import selectedConversationReducer from "./features/selectedConversationSlice";
import socketReducer from "./features/socketSlice";



export default configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		authScreen: authScreenReducer,
		posts: postReducer,
		conversations: conversationReducer,
		selectedConversation: selectedConversationReducer,
		socket: socketReducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["socket/setSocket"],
				ignoredPaths: ["socket.socket"],
			},
	}),
});
