import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton, Paper, Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { auth } from "../firebase";
import { addChat, addMessage, fetchMessages } from "../firestoreUtils";
import ChatList from "./ChatList"; // Import the ChatList component

const Chatbot = () => {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); // Local state for messages
  const { activeChatId, loading, error } = useSelector((state) => state.chatbot);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Add useRef for the chat container
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Load messages for the active chat when it changes
  useEffect(() => {
    const loadMessages = async () => {
      if (user && user.uid && activeChatId) {
        try {
          const chatMessages = await fetchMessages(user.uid, activeChatId);
          setMessages(chatMessages);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };

    loadMessages();
  }, [user, activeChatId]);

  // Handle sending a message
  const handleSend = async () => {
    if (input.trim() !== "") {
      if (!user || !user.uid) {
        console.error("No user is logged in");
        return;
      }

      try {
        // Create a new chat if no activeChatId exists
        let currentChatId = activeChatId;
        if (!currentChatId) {
          currentChatId = await addChat(user.uid, "New Chat");
          // The activeChatId will be updated via the fetchUserChats action
        }

        // Add user message to Firestore
        await addMessage(user.uid, currentChatId, input, "user");
        setMessages((prev) => [
          ...prev,
          { text: input, sender: "user", timestamp: new Date().toISOString() },
        ]);
        setInput("");

        // Simulate bot response
        setIsLoading(true);
        const botResponse = "This is a bot response."; // Replace with actual bot logic
        await addMessage(user.uid, currentChatId, botResponse, "bot");
        setMessages((prev) => [
          ...prev,
          { text: botResponse, sender: "bot", timestamp: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error("Error handling message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Box 
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Chat List Sidebar */}
      <ChatList />
      
      {/* Chat Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
      <Paper
        ref={chatContainerRef} // Attach the ref to the chat container
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {!activeChatId ? (
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            Select a chat or start a new conversation
          </Typography>
        ) : messages.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            Start Chatting Below...
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 1.5,
                  borderRadius:
                    msg.sender === "user"
                      ? "15px 15px 0 15px"
                      : "15px 15px 15px 0",
                  backgroundColor:
                    msg.sender === "user"
                      ? theme.palette.primary.main
                      : theme.palette.grey[300],
                  color:
                    msg.sender === "user"
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Box>
            </Box>
          ))
        )}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: "15px 15px 15px 0",
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.text.primary,
              }}
            >
              <CircularProgress size={24} />
              <Typography variant="body1">Thinking...</Typography>
            </Box>
          </Box>
        )}
        {error && <Typography color="error">Error: {error}</Typography>}
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderTop: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.grey[200],
          boxSizing: "border-box",
          overflow: "hidden",
          padding: "5px 10px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          sx={{
            flex: 1,
            mr: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          disabled={loading || !activeChatId}
        />

        <IconButton
          onClick={handleSend}
          sx={{
            color: theme.palette.primary.main,
            flexShrink: 0,
            width: 48,
            height: 48,
          }}
          disabled={loading || !activeChatId}
        >
          <SendIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Box>
    </Box>
  );
};

export default Chatbot;
