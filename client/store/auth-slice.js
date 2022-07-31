import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_connected: false,
  connected_account: "",
  chain_id: 0,
  web_3: {},
  factory: {},
};

export const auth_slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.is_connected = true;
    },
    add_connected_account: (state, action) => {
      state.connected_account = action.payload;
    },
    add_chain_id: (state, action) => {
      state.chain_id = action.payload;
    },
    add_web_3: (state, action) => {
      state.web_3 = action.payload;
    },
    add_factory: (state, action) => {
      state.factory = action.payload;
    },
  },
});

export const {
  login,
  add_connected_account,
  add_chain_id,
  add_web_3,
  add_factory,
} = auth_slice.actions;

export default auth_slice.reducer;
