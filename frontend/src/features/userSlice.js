import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: JSON.parse(localStorage.getItem("user-threads")) || null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
			localStorage.setItem("user-threads", JSON.stringify(action.payload));
		},
		clearUser: (state) => {
			state.user = null;
			localStorage.removeItem("user-threads");
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;