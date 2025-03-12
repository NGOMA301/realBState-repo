import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { format } from "date-fns";
import {
  MessageSquare,
  Send,
  RefreshCw,
  ChevronLeft,
  Paperclip,
  Image,
  X,
  Phone,
  VideoIcon,
  MoreVertical,
  ShoppingBag,
  User
} from "lucide-react";

import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Avatar } from "../Components/Avatar";
import { Badge } from "../Components/Badge";
import { useAuth } from "../hooks/useAuth";

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_BASE_URL = `${API_URL}/api/chat`;

// Socket.io connection
let socket = null;

export default function ChatPage() {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      console.log("Initializing socket connection...");
      
      socket = io(API_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        // Show error toast
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log(`Socket reconnected after ${attemptNumber} attempts`);
        // Show success toast
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("typing");
      }
    };
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/conversations`, {
          withCredentials: true,
        });
        
        setConversations(response.data);
        
        const unreadResponse = await axios.get(`${API_BASE_URL}/unread`, {
          withCredentials: true,
        });
        
        const unreadMap = {};
        unreadResponse.data.forEach(msg => {
          unreadMap[msg.conversationId] = (unreadMap[msg.conversationId] || 0) + 1;
        });
        
        setUnreadCounts(unreadMap);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;

    if (socket) {
      socket.on("newMessage", (message) => {
        if (selectedConversation && message.conversationId === selectedConversation._id) {
          setMessages(prev => [...prev, message]);
          markMessagesAsRead(selectedConversation._id);
        } else {
          setUnreadCounts(prev => ({
            ...prev,
            [message.conversationId]: (prev[message.conversationId] || 0) + 1
          }));
          
          setConversations(prev => 
            prev.map(convo => 
              convo._id === message.conversationId 
                ? { ...convo, lastMessage: message.text, updatedAt: message.createdAt }
                : convo
            )
          );
        }
        scrollToBottom();
      });

      socket.on("typing", (data) => {
        if (selectedConversation && data.conversationId === selectedConversation._id && data.userId !== user._id) {
          setIsTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("typing");
      }
    };
  }, [selectedConversation, user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        if (socket) {
          socket.emit("joinRoom", selectedConversation._id);
        }
        
        const response = await axios.get(`${API_BASE_URL}/messages/${selectedConversation._id}`, {
          withCredentials: true,
        });
        
        setMessages(response.data);
        await markMessagesAsRead(selectedConversation._id);
        
        setUnreadCounts(prev => ({
          ...prev,
          [selectedConversation._id]: 0
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (socket && selectedConversation) {
        socket.emit("leaveRoom", selectedConversation._id);
      }
    };
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageData = {
        conversationId: selectedConversation._id,
        text: newMessage,
        attachments: attachments.map(att => att.url),
      };

      const response = await axios.post(`${API_BASE_URL}/message`, messageData, {
        withCredentials: true,
      });

      setNewMessage("");
      setAttachments([]);
      
      socket.emit("sendMessage", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await axios.post(`${API_BASE_URL}/mark-as-read`, { conversationId }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setAttachments(prev => [
        ...prev, 
        { 
          file, 
          url: previewUrl, 
          name: file.name,
          type: file.type
        }
      ]);
    });

    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].url);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && selectedConversation && user) {
      socket.emit("typing", { 
        conversationId: selectedConversation._id, 
        userId: user._id,
        isTyping: e.target.value.length > 0 
      });
    }
  };

  const formatMessageTime = (date) => {
    return format(new Date(date), 'h:mm a');
  };

  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(messageDate, 'EEEE, MMMM d');
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Messages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Chat with sellers about products you're interested in</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 
          ${selectedConversation ? 'hidden md:block md:w-1/3' : 'w-full md:w-1/3'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
            <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-white">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Conversations
            </h2>
          </div>

          {loading && !conversations.length ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                When you message a seller about a product, your conversations will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                  p => p._id.toString() !== user._id.toString()
                );
                
                const unreadCount = unreadCounts[conversation._id] || 0;
                
                return (
                  <div
                    key={conversation._id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
                      ${selectedConversation?._id === conversation._id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : unreadCount > 0
                        ? "bg-gray-50 dark:bg-gray-800/50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/30"}`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={otherParticipant?.profileImage ? `${API_URL}${otherParticipant.profileImage}` : undefined}
                        alt={otherParticipant?.name || "Unknown User"}
                        fallback={otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                        size="lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {otherParticipant?.name || "Unknown User"}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {format(new Date(conversation.updatedAt), 'h:mm a')}
                            </span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                        
                        {conversation.product && (
                          <div className="mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {conversation.product.title}
                              </span>
                              {conversation.product.price && (
                                <span className="font-semibold">${conversation.product.price}</span>
                              )}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Avatar
                  src={selectedConversation.otherParticipant?.profileImage ? 
                    `${API_URL}${selectedConversation.otherParticipant.profileImage}` : undefined}
                  alt={selectedConversation.otherParticipant?.name || "Unknown User"}
                  fallback={selectedConversation.otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                  size="md"
                  className="mr-3"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedConversation.otherParticipant?.name || "Unknown User"}
                  </h3>
                  
                  {selectedConversation.product && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Regarding: </span>
                      <Badge variant="outline" className="ml-1">
                        {selectedConversation.product.title}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <VideoIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 text-gray-400 dark:text-gray-600 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                      Start the conversation by sending a message.
                    </p>
                  </div>
                ) : (
                  groupedMessages.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      <div className="flex justify-center mb-4">
                        <Badge variant="outline">
                          {formatMessageDate(group.messages[0].createdAt)}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {group.messages.map((msg) => {
                          const isCurrentUser = msg.sender._id === user._id;
                          const hasAttachments = msg.attachments && msg.attachments.length > 0;

                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-[75%] ${isCurrentUser ? "order-1" : "order-2"}`}>
                                {!isCurrentUser && (
                                  <div className="flex items-center mb-1 ml-2">
                                    <Avatar
                                      src={msg.sender?.profileImage ? `${API_URL}${msg.sender.profileImage}` : undefined}
                                      alt={msg.sender?.name || "Unknown"}
                                      fallback={msg.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                                      size="sm"
                                      className="mr-2"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {msg.sender?.name || "Unknown"}
                                    </span>
                                  </div>
                                )}
                                
                                <div className={`rounded-2xl px-4 py-2 break-words
                                  ${isCurrentUser
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"}
                                  ${isCurrentUser ? "rounded-tr-none" : "rounded-tl-none"}`}
                                >
                                  {msg.text && (
                                    <p className="text-sm whitespace-pre-wrap">
                                      {msg.text}
                                    </p>
                                  )}
                                  
                                  {hasAttachments && (
                                    <div className={`mt-2 ${msg.text ? 'pt-2 border-t' : ''} 
                                      ${isCurrentUser ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}
                                    >
                                      <div className="grid grid-cols-2 gap-2">
                                        {msg.attachments.map((attachment, index) => {
                                          const isImage = attachment.match(/\.(jpeg|jpg|gif|png)$/i);
                                          
                                          return isImage ? (
                                            <div key={index} className="relative rounded overflow-hidden">
                                              <img 
                                                src={attachment} 
                                                alt="Attachment" 
                                                className="w-full h-auto object-cover"
                                              />
                                            </div>
                                          ) : (
                                            <div key={index} className="flex items-center p-2 rounded bg-gray-100 dark:bg-gray-700 text-xs">
                                              <Paperclip className="h-3 w-3 mr-2" />
                                              <span className="truncate">{attachment.split('/').pop()}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1
                                  ${isCurrentUser ? "text-right mr-2" : "ml-2"}`}
                                >
                                  {formatMessageTime(msg.createdAt)}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs">
                                      {msg.readBy?.includes(selectedConversation.otherParticipant._id) ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                             style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                             style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                             style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="relative group">
                        {attachment.type.startsWith('image/') ? (
                          <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img 
                              src={attachment.url} 
                              alt={attachment.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                            <div className="text-xs text-center truncate">
                              <Paperclip className="h-4 w-4 mx-auto mb-1" />
                              <span className="block truncate">{attachment.name}</span>
                            </div>
                          </div>
                        )}
                        <button 
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={handleTyping}
                      className="rounded-full"
                      disabled={sendingMessage}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={(!newMessage.trim() && attachments.length === 0) || sendingMessage}
                    size="icon"
                  >
                    {sendingMessage ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="max-w-md">
                <div className="bg-blue-100 dark:bg-blue-900/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Choose a conversation from the list to view your messages and respond.
                </p>
                {conversations.length === 0 && !loading && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="h-4 w-4" />
                      No conversations yet
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      When you message a seller about a product, your conversations will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}