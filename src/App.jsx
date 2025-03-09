// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, Container } from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "./firebase";
import { setUser } from "./redux/authSlice";
import store from "./redux/store";
import theme from "./theme";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Navbar from "./components/Navbar";

const AppContent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  
    if (token && !user && auth.currentUser === null) { // IMPORTANT ADDITION: auth.currentUser === null
      // Use the token to sign in with Firebase
      signInWithCustomToken(auth, token)
        .then((userCredential) => {
          // Extract serializable user data
          const user = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          };
  
          dispatch(setUser(user)); // Dispatch the setUser action
        })
        .catch((error) => {
          console.error("Error signing in with token:", error);
          localStorage.removeItem("authToken"); // Clear invalid token
        });
    }
  }, [dispatch, user]);
  

  return (
    <Router>
      <Container
        maxWidth={false}
        sx={{
          overflow: "hidden",
          padding: 0,
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
          width: "100vw",
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Routes sx={{ flex: 1 }}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Container>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;