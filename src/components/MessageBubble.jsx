import React from "react";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({ message, theme }) => {
  console.log("Timestamp:", message.timestamp); // Debugging line

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time"; // Fallback for missing timestamp

    // Convert Firestore Timestamp to JavaScript Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          p: 1.5,
          borderRadius: message.sender === "user" ? "15px 15px 0 15px" : "15px 15px 15px 0",
          backgroundColor: message.sender === "user" ? theme.palette.primary.main : theme.palette.grey[300],
          color: message.sender === "user" ? theme.palette.primary.contrastText : theme.palette.text.primary,
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            color: message.sender === "user" ? theme.palette.primary.contrastText : theme.palette.text.secondary,
            mt: 0.5,
          }}
        >
          {formatTimestamp(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;