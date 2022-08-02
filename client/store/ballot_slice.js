import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: "",
  ballots: [],
  ballot_candidates: [],
  ballot_status: true,
};

export const ballot_slice = createSlice({
  name: "ballot",
  initialState,
  reducers: {
    add_ballot_event: (state, action) => {
      state.event = action.payload;
    },
    add_ballot: (state, action) => {
      state.ballots = [...state.ballots, action.payload];
    },
    add_ballot_candidates: (state, action) => {
      state.ballot_candidates = action.payload;
    },
    add_ballot_status: (state, action) => {
      state.ballot_status = action.payload;
    },
  },
});

export const {
  add_ballot_event,
  add_ballot,
  add_ballot_candidates,
  add_ballot_status,
} = ballot_slice.actions;

export default ballot_slice.reducer;
