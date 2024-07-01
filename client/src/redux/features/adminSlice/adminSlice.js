import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
export const getApiDataThunk = createAsyncThunk("adminapidata", async () => {
  try {
    const res = await axios.get(API_URL);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const adminLoginThunk = createAsyncThunk(
  "admin/login",
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
      rejectWithValue(error.message);
    }
  }
);

export const adminRegisterThunk = createAsyncThunk(
  "admin/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "admin", user.uid), {
        uid: user.uid,
        email,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
);

export const getAdminUsersThunk = createAsyncThunk(
  "admin/access",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "admin"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllUsersThunk = createAsyncThunk(
  "admin/allUsers",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserByIdThunk = createAsyncThunk(
  "admin/userById",
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
  error: null,
  authToken: null,
  apiData: [],
  adminData: [],
  userData: [],
  userById: [],
  status: {
    getApiDataThunk: "IDLE",
    adminLoginThunk: "IDLE",
    adminRegisterThunk: "IDLE",
    getAdminUsersThunk: "IDLE",
    getAllUsersThunk: "IDLE",
    getUserByIdThunk: "IDLE",
  },
};

const adminSlice = createSlice({
  name: "adminInfo",
  initialState: initialState,
  reducers: {
    adminLogout: (state) => {
      state.isLoggedIn = false;
      state.adminData = null;
      state.userData = null;
      state.authToken = null;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
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
        state.error = action.error.message;
        state.status.getApiDataThunk = "ERROR";
      })
      .addCase(adminLoginThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.error = null;
        state.authToken = action.payload.authToken;
        localStorage.setItem("authToken", action.payload.authToken);
        state.status.adminLoginThunk = "FULFILLED";
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
        state.status.adminLoginThunk = "ERROR";
      })
      .addCase(adminRegisterThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.status.adminRegisterThunk = "FULFILLED";
      })
      .addCase(adminRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.adminRegisterThunk = "ERROR";
      })
      .addCase(getAdminUsersThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
        state.status.getAdminUsersThunk = "FULFILLED";
      })
      .addCase(getAdminUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.getAdminUsersThunk = "ERROR";
      })
      .addCase(getAllUsersThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.status.getAllUsersThunk = "FULFILLED";
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.getAllUsersThunk = "ERROR";
      })
      .addCase(getUserByIdThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userById = action.payload;
        state.status.getUserByIdThunk = "FULFILLED";
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.status.getUserByIdThunk = "ERROR";
      });
  },
});

export default adminSlice.reducer;
export const { adminLogout, clearError } = adminSlice.actions;
