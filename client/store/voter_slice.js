import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registered: false,
  voted: false,
};

export const voter_slice = createSlice({
  name: "voter",
  initialState,
  reducers: {
    add_voter_registered: (state, action) => {
      state.registered = action.payload;
    },
    add_voted_voted: (state, action) => {
      state.voted = action.payload;
    },
  },
});

export const { add_voter_registered, add_voted_voted } = voter_slice.actions;

export default voter_slice.reducer;
