import axios from "axios";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api/chat";
const API_REAL_TIME_BASE_URL = "http://localhost:5000";

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_ad_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Chat API functions
export const chatApi = {
  // Get all conversations for admin
  getAdminMessages: async () => {
    try {
      const response = await api.get("/admin/conversations");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin messages:", error);
      throw error;
    }
  },

  // Get unread messages
  getUnreadMessages: async () => {
    try {
      const response = await api.get("/admin/unread");
      return response.data;
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    try {
      const response = await api.post("/admin/mark-as-read", {
        conversationId,
      });
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  },

  // Get conversation by ID or start a new one
  getConversation: async (productId, recipientId) => {
    try {
      // First try to find an existing conversation
      const response = await api.post("/admin/conversation", {
        productId,
        recipientId,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/admin/messages/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async ({ conversationId, message, attachments = [] }) => {
    try {
      const response = await api.post("/admin/message", {
        conversationId,
        text: message,
        attachments,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};



/////////////////////////////////////////////////////////////////////////////////
// Socket.io connection setup
let socket = null;
let socketListeners = new Map();

// Updated initializeSocket function
export const initializeSocket = () => {
  // Return existing connected socket
  if (socket?.connected) return Promise.resolve(socket);

  // Return existing pending connection
  if (socket?.pending) return socket.pending;

  return import("socket.io-client").then(({ io }) => {
    return new Promise((resolve, reject) => {
      console.log("Initializing new socket connection...");
      
      socket = io(API_REAL_TIME_BASE_URL, {
        autoConnect: true,
        reconnectionAttempts: 5,
        withCredentials: true
      });

      // Store pending promise
      socket.pending = { resolve, reject };

      // Connection handlers
      socket.once("connect", () => {
        console.log("Socket connected");
        delete socket.pending;
        resolve(socket);
      });

      socket.once("connect_error", (err) => {
        console.error("Connection failed:", err);
        delete socket.pending;
        reject(err);
      });
    });
  });
};
export const joinConversationRoom = (conversationId) => {
  if (!socket) {
    console.error("Socket not initialized when trying to join room");
    return;
  }

  console.log(`Joining conversation room: ${conversationId}`);
  socket.emit("joinConversation", conversationId);
};

export const leaveConversationRoom = (conversationId) => {
  if (!socket) {
    console.error("Socket not initialized when trying to leave room");
    return;
  }

  console.log(`Leaving conversation room: ${conversationId}`);
  socket.emit("leaveRoom", conversationId);
};

export const subscribeToNewMessages = (callback) => {
  if (!socket) {
    console.error(
      "Socket not initialized when trying to subscribe to messages"
    );
    return () => {}; // Return empty cleanup function
  }

  console.log("Subscribing to new messages");

  // Remove any existing listener for this event
  if (socketListeners.has("newMessage")) {
    socket.off("newMessage", socketListeners.get("newMessage"));
  }

  // Add new listener
  socket.on("newMessage", (message) => {
    console.log("New message received:", message);
    callback(message);
  });

  // Store the callback for cleanup
  socketListeners.set("newMessage", callback);

  // Return cleanup function
  return () => {
    if (socket) {
      socket.off("newMessage", callback);
      socketListeners.delete("newMessage");
    }
  };
};

export const subscribeToTypingEvents = (callback) => {
  if (!socket) {
    console.error(
      "Socket not initialized when trying to subscribe to typing events"
    );
    return () => {}; // Return empty cleanup function
  }

  console.log("Subscribing to typing events");

  // Remove any existing listener for this event
  if (socketListeners.has("typing")) {
    socket.off("typing", socketListeners.get("typing"));
  }

  // Add new listener
  socket.on("typing", (data) => {
    console.log("Typing event received:", data);
    callback(data);
  });

  // Store the callback for cleanup
  socketListeners.set("typing", callback);

  // Return cleanup function
  return () => {
    if (socket) {
      socket.off("typing", callback);
      socketListeners.delete("typing");
    }
  };
};

export const emitTypingEvent = (conversationId, isTyping) => {
  if (!socket) {
    console.error("Socket not initialized when trying to emit typing event");
    return;
  }

  socket.emit("typing", { conversationId, isTyping });
};

export const subscribeToMessagesRead = (callback) => {
  if (!socket) {
    console.error("Socket not initialized when trying to subscribe to messages read events");
    return () => {}; // Return empty cleanup function
  }

  console.log("Subscribing to messages read events");

  // Remove any existing listener for this event
  if (socketListeners.has("messages-read")) {
    socket.off("messages-read", socketListeners.get("messages-read"));
  }

  // Add new listener
  socket.on("messages-read", (data) => {
    console.log("Messages read event received:", data);
    callback(data);
  });

  // Store the callback for cleanup
  socketListeners.set("messages-read", callback);

  // Return cleanup function
  return () => {
    if (socket) {
      socket.off("messages-read", callback);
      socketListeners.delete("messages-read");
    }
  };
};

export const emitMarkAsRead = (conversationId) => {
  if (!socket) {
    console.error("Socket not initialized when trying to mark messages as read");
    return;
  }

  console.log(`Marking messages as read for conversation: ${conversationId}`);
  socket.emit("markAsRead", { conversationId });
};


export const unsubscribeFromAllEvents = () => {
  if (!socket) return;

  console.log("Unsubscribing from all socket events");

  // Unsubscribe from all events
  socketListeners.forEach((callback, event) => {
    socket.off(event, callback);
  });

  // Clear the listeners map
  socketListeners.clear();
};

export default api;
