import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import auth from "./auth-slice";
import ballot from "./ballot_slice";

const combinedReducer = combineReducers({
  auth,
  ballot,
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
        ballot_ids: [
          ...action.payload.ballot.ballot_ids,
          ...state.ballot.ballot_ids,
        ],
        ballot_candidates: action.payload.ballot.ballot_candidates,
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
