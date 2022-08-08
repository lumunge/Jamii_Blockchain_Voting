import { createSlice } from "@reduxjs/toolkit";

const ballot_form = {
  ballot_id: "",
  ballot_type: "",
  ballot_name: "",
  ballot_chair: "",
  ballot_candidates: [],
  start_registration: "",
  end_registration: "",
  start_voting: "",
  end_voting: "",
  ballot_days: "",
  registration_period: "",
  open_date: "",
};
const initialState = {
  tabs: {
    tab_1: "Create",
    tab_2: "Open",
    tab_3: "End",
  },
  show_new_ballot: false,
  show_form: false,
  show_dates: false,
  show_type: false,
  event: "",
  ballot: {},
  ballots: [],
  ballot_candidates: [],
  active_ballot: 0,
  active_tab: 0,
  ballot_status: true,
  initial_ballot: ballot_form,
};

export const ballot_slice = createSlice({
  name: "ballot",
  initialState,
  reducers: {
    add_tab_state: (state, action) => {
      state.tabs = action.payload;
    },
    add_show_new_ballot: (state, action) => {
      state.show_new_ballot = action.payload;
    },
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
      state.ballot = action.payload;
    },
    add_active_ballot: (state, action) => {
      state.active_ballot = action.payload;
    },
    add_active_tab: (state, action) => {
      state.active_tab = action.payload;
    },
    add_ballot_status: (state, action) => {
      state.ballot_status = action.payload;
    },
    add_ballot_state: (state, action) => {
      state.initial_ballot = action.payload;
    },
    add_ballot_candidates: (state, action) => {
      state.initial_ballot.ballot_candidates = action.payload;
      state.ballot_candidates = action.payload;
    },
    add_ballot_dates: (state, action) => {
      state.initial_ballot.start_registration =
        action.payload.start_registration;
      state.initial_ballot.end_registration = action.payload.end_registration;
      state.initial_ballot.start_voting = action.payload.start_voting;
      state.initial_ballot.end_voting = action.payload.end_voting;
      state.initial_ballot.ballot_days = action.payload.ballot_days;
      state.initial_ballot.registration_period =
        action.payload.registration_period;
      state.initial_ballot.open_date = action.payload.open_date;
    },
    add_ballot_id_chair: (state, action) => {
      state.initial_ballot.ballot_id = action.payload.ballot_id;
      state.initial_ballot.ballot_chair = action.payload.ballot_chair;
    },
    add_new_ballot: (state, action) => {
      state.initial_ballot.ballot_name = action.payload.ballot_name;
      state.initial_ballot.ballot_type = action.payload.ballot_type;
      state.initial_ballot.ballot_days = action.payload.ballot_type;
      state.initial_ballot.registration_period =
        action.payload.registration_period;
      state.initial_ballot.ballot_candidates = action.payload.ballot_candidates;
    },
  },
});

export const {
  add_tab_state,
  add_show_new_ballot,
  add_show_form,
  add_show_dates,
  add_show_type,
  add_ballot_event,
  add_ballot,
  add_active_ballot,
  add_active_tab,
  add_ballot_status,
  add_ballot_state,
  add_ballot_candidates,
  add_ballot_dates,
  add_ballot_id_chair,
  add_new_ballot,
} = ballot_slice.actions;

export default ballot_slice.reducer;
