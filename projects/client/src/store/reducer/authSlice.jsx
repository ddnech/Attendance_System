import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: { token: "" },
  reducers: {
    keep(state, action) {
      state.token = action.payload;
    },

    remove(state) {
      state.token = "";
    },
  },
});

export const { keep, remove } = authSlice.actions;

export default authSlice.reducer;
