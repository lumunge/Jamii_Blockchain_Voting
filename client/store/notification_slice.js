import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  type: "",
  message: "",
};

const notification_slice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    add_notification: (state, action) => {
      state.open = action.payload.open;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
  },
});

export const { add_notification } = notification_slice.actions;

export default notification_slice.reducer;
