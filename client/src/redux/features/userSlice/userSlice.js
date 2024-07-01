import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const userLoginThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const authToken = await user.getIdToken();
      return {
        uid: user.uid,
        email: user.email,
        authToken,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userRegisterThunk = createAsyncThunk(
  "user/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/profile",
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

export const userProfileByIdThunk = createAsyncThunk(
  "user/userById",
  async (id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  isLoggedIn: false,
  userProfile: {},
  authToken: null,
  error: null,
  status: {
    userLoginThunk: "IDLE",
    userRegisterThunk: ":IDLE",
    updateProfileThunk: "IDLE",
    userProfileByIdThunk: "IDLE",
  },
};

const userSlice = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userProfile = null;
      state.authToken = null;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isLoggedIn = !state.isLoggedIn;
        state.authToken = action.payload.authToken;
        localStorage.setItem("authToken", action.payload.authToken);
        state.status.userLoginThunk = "FULFILLED";
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
        state.status.userLoginThunk = "ERROR";
      })
      .addCase(userRegisterThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.status.userRegisterThunk = "FULFILLED";
      })
      .addCase(userRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.userRegisterThunk = "ERROR";
      })
      .addCase(updateProfileThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status.updateProfileThunk = "FULFILLED";
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.updateProfileThunk = "ERROR";
      })
      .addCase(userProfileByIdThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfileByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
        state.status.userProfileByIdThunk = "FULFILLED";
      })
      .addCase(userProfileByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.userProfileByIdThunk = "ERROR";
      });
  },
});

export default userSlice.reducer;
export const { clearError, logout } = userSlice.actions;
