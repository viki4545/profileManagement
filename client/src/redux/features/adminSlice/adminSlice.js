import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const getApiDataThunk = createAsyncThunk("get/apidata", async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("API Response:", res.data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

const initialState = {
  loading: false,
  errorData: {
    message: "",
    type: "",
    errors: [],
  },
  isLogin: false,
  isError: false,
  apiData: [],
  status: {
    getApiDataThunk: "IDLE",
  },
};

const adminSlice = createSlice({
  name: "adminInfo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApiDataThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getApiDataThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.apiData = payload;
        state.status.getApiDataThunk = "FULFILLED";
      })
      .addCase(getApiDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.errorData = action.error.message;
        state.status.getApiDataThunk = "ERROR";
      });
  },
});

export default adminSlice.reducer;
export const { setError } = adminSlice.actions;
