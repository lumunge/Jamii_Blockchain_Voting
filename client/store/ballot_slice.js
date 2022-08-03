import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show_form: false,
  show_dates: false,
  show_type: false,
  event: "",
  ballots: [],
  active_ballot: 0,
  ballot_candidates: [],
  ballot_status: true,
};

export const ballot_slice = createSlice({
  name: "ballot",
  initialState,
  reducers: {
    add_show_form: (state, action) => {
      state.show_form = action.payload;
    },
    add_show_dates: (state, action) => {
      state.show_dates = action.payload;
    },
    add_show_type: (state, action) => {
      state.show_type = action.payload;
    },
    add_ballot_event: (state, action) => {
      state.event = action.payload;
    },
    add_ballot: (state, action) => {
      state.ballots = [...state.ballots, action.payload];
    },
    add_active_ballot: (state, action) => {
      state.active_ballot = action.payload;
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
  add_show_form,
  add_show_dates,
  add_show_type,
  add_ballot_event,
  add_ballot,
  add_active_ballot,
  add_ballot_candidates,
  add_ballot_status,
} = ballot_slice.actions;

export default ballot_slice.reducer;
