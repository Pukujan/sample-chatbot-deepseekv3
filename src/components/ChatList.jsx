import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchUserChats, setActiveChatId } from "../redux/chatbotSlice";
import { auth } from "../firebase";
import { format } from "date-fns";

const ChatList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { chats, activeChatId, loading, error } = useSelector((state) => state.chatbot);
  const user = useSelector((state) => state.auth.user);

  // Fetch chats when component mounts or user changes
  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchUserChats(user.uid));
    }
  }, [dispatch, user]);

  // Handle chat selection
  const handleChatSelect = (chatId) => {
    dispatch(setActiveChatId(chatId));
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    // Handle Firestore timestamps
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "MMM d, yyyy");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "280px",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h6">Your Chats</Typography>
      </Box>
      <Divider />
      
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      ) : (
        <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
          {chats.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                No chats yet. Start a new conversation!
              </Typography>
            </Box>
          ) : (
            chats.map((chat) => (
              <ListItem key={chat.id} disablePadding divider>
                <ListItemButton
                  selected={activeChatId === chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={chat.title || "Untitled Chat"}
                    secondary={formatTimestamp(chat.createdAt)}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: activeChatId === chat.id ? "bold" : "normal",
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.75rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Paper>
  );
};

export default ChatList;
