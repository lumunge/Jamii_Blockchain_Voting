import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current_theme: "light",
};

export const theme_slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    add_theme: (state, action) => {
      state.current_theme = action.payload;
    },
  },
});

export const { add_theme } = theme_slice.actions;

export default theme_slice.reducer;
