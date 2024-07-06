import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: "login" };

const authScreenSlice = createSlice({
	name: "authScreen",
	initialState,
	reducers: {
		setAuthScreen: (state, action) => {
			state.value = action.payload;
		},
	},
    
});

export const { setAuthScreen } = authScreenSlice.actions;
export default authScreenSlice.reducer;
