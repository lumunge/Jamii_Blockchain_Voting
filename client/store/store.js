import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import auth from "./auth-slice";
import ballot from "./ballot_slice";
import voter from "./voter_slice";
import theme from "./theme_slice";
import notification from "./notification_slice";

const combinedReducer = combineReducers({
  auth,
  ballot,
  voter,
  theme,
  notification,
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
        show_form: action.payload.ballot.show_form,
        show_dates: action.payload.ballot.show_dates,
        show_type: action.payload.ballot.show_type,
        event: action.payload.ballot.event,
        ballots: [...action.payload.ballot.ballots, ...state.ballot.ballots],
        active_ballot: action.payload.ballot.active_ballot,
        ballot_candidates: action.payload.ballot.ballot_candidates,
        ballot_status: action.payload.ballot.ballot_status,
      },
      voter: {
        registered: action.payload.voter.registered,
        voted: action.payload.voter.voted,
      },
      theme: {
        current_theme: action.payload.theme.current_theme,
      },
      notification: {
        open: action.payload.notification.open,
        type: action.payload.notification.type,
        message: action.payload.notification.message,
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
