import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userInfo from "../features/userSlice/userSlice.js";

const rootReducer = combineReducers({
  userInfo: userInfo,
});

export const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
  },
});
