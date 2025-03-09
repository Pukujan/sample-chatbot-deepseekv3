import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Chatbot
      </Typography>
      <Button variant="contained" component={Link} to="/chat">
        Start Chatting
      </Button>
    </Box>
  );
};

export default Home;
