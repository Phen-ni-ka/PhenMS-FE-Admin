import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("ADMIN_ACCESS_TOKEN"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem("ADMIN_ACCESS_TOKEN", action.payload);
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      localStorage.removeItem("ADMIN_ACCESS_TOKEN");
      state.token = null;
    },
  },
});

export const { setToken, logOut } = authSlice.actions;

export default authSlice.reducer;
