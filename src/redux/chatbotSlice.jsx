// src/redux/chatbotSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchChats } from "../firestoreUtils";

// Async thunk for fetching chats
export const fetchUserChats = createAsyncThunk(
  "chatbot/fetchUserChats",
  async (userId, { rejectWithValue }) => {
    try {
      const chats = await fetchChats(userId);
      return chats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    messages: [],
    chats: [],
    activeChatId: null,
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    loadMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        // Set active chat ID to the first chat if not already set
        if (!state.activeChatId && action.payload.length > 0) {
          state.activeChatId = action.payload[0].id;
        }
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions
export const { 
  addMessage, 
  loadMessages, 
  clearMessages, 
  setLoading, 
  setError,
  setActiveChatId
} = chatbotSlice.actions;

// Export the reducer
export default chatbotSlice.reducer;
