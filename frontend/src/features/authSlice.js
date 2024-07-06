import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: JSON.parse(localStorage.getItem("authValue")) ?? true,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state) => {
			state.value = true;
			localStorage.setItem("authValue", JSON.stringify(state.value));
		},
		signup: (state) => {
			state.value = false;
			localStorage.setItem("authValue", JSON.stringify(state.value));
		},
	},
});

export const { login, signup } = authSlice.actions;

export default authSlice.reducer;
