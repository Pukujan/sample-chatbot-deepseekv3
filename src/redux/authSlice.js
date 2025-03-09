import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithCustomToken, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

// Async thunk for signing up with email/password
export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.token;
        localStorage.setItem("authToken", token); // Save token to localStorage
        const userCredential = await signInWithCustomToken(auth, token); // Sign in with Firebase using the token
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
        return user;
      } else {
        return rejectWithValue(data.error || "Signup failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logging in with email/password
export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.token;
        localStorage.setItem("authToken", token); // Save token to localStorage
        const userCredential = await signInWithCustomToken(auth, token); // Sign in with Firebase using the token
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
        return user;
      } else {
        return rejectWithValue(data.error || "Login failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logging in with Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); // Sign in with Google
      const idToken = await result.user.getIdToken(); // Get the ID token

      // Send the ID token to the backend for verification
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.token;
        localStorage.setItem("authToken", token); // Save token to localStorage
        const userCredential = await signInWithCustomToken(auth, token); // Sign in with Firebase using the token
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        };
        localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
        return user;
      } else {
        return rejectWithValue(data.error || "Google login failed");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup reducers
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login reducers
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google login reducers
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;