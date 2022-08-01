import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import auth from "./auth-slice";
import ballot from "./ballot_slice";
import theme from "./theme_slice";

const combinedReducer = combineReducers({
  auth,
  ballot,
  theme,
});

const masterReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      auth: {
        is_connected: true,
        connected_account: action.payload.auth.connected_account,
        chain_id: action.payload.auth.chain_id,
        web_3: action.payload.auth.web_3,
        factory: action.payload.auth.factory,
      },
      ballot: {
        ballots: [...action.payload.ballot.ballots, ...state.ballot.ballots],
        ballot_candidates: action.payload.ballot.ballot_candidates,
        ballot_status: action.payload.ballot.ballot_status,
      },
      theme: {
        current_theme: action.payload.theme.current_theme,
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer: masterReducer,
  });

export const wrapper = createWrapper(makeStore, { debug: true });
