import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	_id: "",
	userId: "",
	username: "",
	userProfilePic: "",
};

export const selectedConversationSlice = createSlice({
	name: "selectedConversation",
	initialState,
	reducers: {
		setSelectedConversation: (state, action) => {
			return action.payload;
		},
		clearSelectedConversation: () => initialState,
	},
});

export const { setSelectedConversation, clearSelectedConversation } =
	selectedConversationSlice.actions;

export default selectedConversationSlice.reducer;
