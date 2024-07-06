import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
};



const postSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		},

		addPosts: (state, action) => {
			state.posts.unshift(action.payload);
		},
		removePost: (state, action) => {
			state.posts = state.posts.filter((post) => post.id !== action.payload);
		},
	},
});

export const { setPosts, addPosts, removePost } = postSlice.actions;

export default postSlice.reducer;
