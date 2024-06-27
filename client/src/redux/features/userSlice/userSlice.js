import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const userLoginThunk = createAsyncThunk("post/login", async (data) => {
  try {
    const res = {
      email: data.email,
      password: data.password,
    };
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const userRegisterThunk = createAsyncThunk(
  "post/signup",
  async (data) => {
    try {
      const res = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "post/profile",
  async (data) => {
    try {
      const res = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        interest: data.interest,
        country: data.country,
        email: data.email,
        phone: data.phone,
      };
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

const initialState = {
  loading: false,
  errorData: {
    message: "",
    type: "",
    errors: [],
  },
  isLogin: false,
  isError: false,
  status: {
    userLoginThunk: "IDLE",
    userRegisterThunk: ":IDLE",
    updateProfileThunk: "IDLE",
  },
};

const userSlice = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    // setIsLogin: (state, action) => {
    //   state.isLogin = !state.isLogin;
    // },
    setError: (state, { payload }) => {
      state.isError = true;
      state.errorData = {
        message: payload.message,
        type: payload.type,
        errors: payload.errors,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status.userLoginThunk = "FULFILLED";
        state.isLogin = !state.isLogin;
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        state.status.userLoginThunk = "ERROR";
        state.isError = true;
        state.errorData = "REJECTED_ERROR";
      })
      .addCase(userRegisterThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(userRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status.userRegisterThunk = "FULFILLED";
      })
      .addCase(userRegisterThunk.rejected, (state, action) => {
        state.status.userRegisterThunk = "ERROR";
        state.isError = true;
        state.errorData = "REJECTED_ERROR";
      })
      .addCase(updateProfileThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status.updateProfileThunk = "FULFILLED";
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.status.updateProfileThunk = "ERROR";
        state.isError = true;
        state.errorData = "REJECTED_ERROR";
      });
  },
});

export default userSlice.reducer;
export const { setError } = userSlice.actions;
