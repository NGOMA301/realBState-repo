import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance with authentication header
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const startConversation = async (recipientId, productId) => {
  try {
    const response = await api.post(
      "/chat/conversation",
      {
        recipientId,
        ...(productId && { productId }),
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to start conversation";
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/message", messageData, {
      withCredentials: true,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send message";
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get("/chat/conversations", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get conversations";
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/chat/messages/${conversationId}`, {
      withCredentials: true,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get messages";
  }
};

export const getUnreadMessages = async () => {
  try {
    const response = await api.get("/chat/unread", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get unread messages";
  }
};

export const markAsRead = async (conversationId) => {
  try {
    const response = await api.post(
      "/chat/mark-as-read",
      { conversationId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to mark messages as read";
  }
};

export const getConversationDetails = async (conversationId) => {
  try {
    const response = await api.get(`/chat/conversation/${conversationId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get conversation details";
  }
};
