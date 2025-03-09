import { db } from "./firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

// Add a new chat for a user
export const addChat = async (userId, chatTitle) => {
  try {
    const chatRef = await addDoc(collection(db, "users", userId, "chats"), {
      title: chatTitle,
      createdAt: serverTimestamp(),
    });
    console.log("Chat created with ID:", chatRef.id);
    return chatRef.id; // Return the chat ID for future use
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

// Add a message to a specific chat
export const addMessage = async (userId, chatId, message, sender) => {
  try {
    await addDoc(collection(db, "users", userId, "chats", chatId, "messages"), {
      text: message,
      sender: sender, // "user" or "bot"
      timestamp: serverTimestamp(),
    });
    console.log("Message added to chat:", chatId);
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Fetch all chats for a user
export const fetchChats = async (userId) => {
  try {
    const chatsSnapshot = await getDocs(collection(db, "users", userId, "chats"));
    const chats = chatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Chats:", chats);
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

// Fetch messages for a specific chat
export const fetchMessages = async (userId, chatId) => {
  try {
    const messagesSnapshot = await getDocs(
      collection(db, "users", userId, "chats", chatId, "messages")
    );
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Messages:", messages);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};