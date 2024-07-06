import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const conversationsSlice = createSlice({
	name: "conversations",
	initialState,
	reducers: {
		setConversations: (state, action) => {
			return action.payload;
		},
		addConversation: (state, action) => {
			state.push(action.payload);
		},
		updateConversation: (state, action) => {
			const index = state.findIndex(
				(conversation) => conversation._id === action.payload._id
			);
			
			if (index !== -1) {
				state[index].lastMessage = action.payload.lastMessage;
			}
		},
		deleteConversation: (state, action) => {
			return state.filter(
				(conversation) => conversation._id !== action.payload
			);
		},
	},
});

export const {
	setConversations,
	addConversation,
	updateConversation,
	deleteConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
