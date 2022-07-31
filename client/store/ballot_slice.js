import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ballot_ids: [],
  ballot_candidates: [],
};

export const ballot_slice = createSlice({
  name: "ballot",
  initialState,
  reducers: {
    add_ballot: (state, action) => {
      state.ballot_ids = [...state.ballot_ids, action.payload];
    },
    add_ballot_candidates: (state, action) => {
      state.ballot_candidates = action.payload;
    },
  },
});

export const { add_ballot, add_ballot_candidates } = ballot_slice.actions;

export default ballot_slice.reducer;
