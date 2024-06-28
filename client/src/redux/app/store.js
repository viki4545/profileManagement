import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userInfo from "../features/userSlice/userSlice.js";
import adminInfo from "../features/adminSlice/adminSlice.js";

const rootReducer = combineReducers({
  userInfo: userInfo,
  adminInfo: adminInfo,
});

export const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
  },
});
