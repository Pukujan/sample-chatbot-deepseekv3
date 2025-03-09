import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "./chatbotSlice.jsx"; // Import your chatbot reducer
import authReducer from "./authSlice.js"; // Import your auth reducer

// Combine reducers into a single store
const store = configureStore({
  reducer: {
    chatbot: chatbotReducer, // Handles chatbot state
    auth: authReducer, // Handles authentication state
  },
});

export default store;