import { useEffect, useState, useRef } from "react";
import { Send, RefreshCw, Info, Phone, Calendar, Mail, ArrowRight, MessageSquare, ImageIcon, Paperclip, X } from 'lucide-react';

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TopLoader } from "./TopLoader";
import { 
  chatApi, 
  initializeSocket, 
  joinConversationRoom, 
  leaveConversationRoom, 
  subscribeToNewMessages, 
  subscribeToTypingEvents
} from "@/api/api";

export function ChatBox({ selectedUser, setLoading, socketReady }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();
  const API_URL = 'http://localhost:5000'

  useEffect(() => {
    if (!selectedUser || !socketReady) return;
  
    let activeSocket;
    let messageCleanup;
    let typingCleanup;
  
    // Handler for incoming new messages
    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === selectedUser.conversation._id) {
        setMessages(prev => [
          ...prev,
          {
            ...newMessage,
            isOwner: newMessage.sender._id === user._id,
          }
        ]);
        scrollToBottom();
      }
    };
  
    // Handler for typing events
    const handleTyping = (data) => {
      if (
        data.conversationId === selectedUser.conversation._id &&
        data.userId !== user._id
      ) {
        setIsTyping(data.isTyping);
      }
    };
  
    // Reconnect handler to rejoin the conversation room on reconnection
    const reconnectHandler = () => {
      joinConversationRoom(selectedUser.conversation._id);
    };
  
    // Setup the socket connection
    const setupSocket = async () => {
      try {
        const socket = await initializeSocket();
        activeSocket = socket;
  
        // Join the conversation room upon a successful connection
        joinConversationRoom(selectedUser.conversation._id);
  
        // Listen for reconnections and rejoin the room if necessary
        socket.on("reconnect", reconnectHandler);
  
        // Subscribe to real-time events for new messages and typing notifications
        messageCleanup = subscribeToNewMessages(handleNewMessage);
        typingCleanup = subscribeToTypingEvents(handleTyping);
      } catch (error) {
        console.error("Socket setup failed:", error);
      }
    };
  
    // Fetch the initial set of messages
    const fetchMessages = async () => {
      setLocalLoading(true);
      setLoading(true);
      try {
        console.log(`Joining conversation room: ${selectedUser.conversation._id}`);
        // Optionally, join here as well, if needed: joinConversationRoom(selectedUser.conversation._id);
        const messagesData = await chatApi.getMessages(selectedUser.conversation._id);
        const processedMessages = messagesData.map(msg => ({
          ...msg,
          isOwner: msg.sender._id === user._id,
        }));
        setMessages(processedMessages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLocalLoading(false);
        setLoading(false);
      }
    };
  
    // Run both the initial message fetch and socket setup
    fetchMessages();
    setupSocket();
  
    // Cleanup subscriptions and leave the conversation room when the component unmounts
    return () => {
      if (activeSocket) {
        activeSocket.off("reconnect", reconnectHandler);
      }
      leaveConversationRoom(selectedUser?.conversation?._id);
      messageCleanup?.();
      typingCleanup?.();
    };
  }, [selectedUser, socketReady, user._id]);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedUser || isSending) return;

    setIsSending(true);
    try {
      const messageData = {
        conversationId: selectedUser.conversation._id,
        message: newMessage,
        attachments: attachments.map(att => att.url),
      };

       await chatApi.sendMessage(messageData);


      setNewMessage("");
      setAttachments([]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Process each file
    files.forEach(file => {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // For this example, we'll just use the preview URL
      // In a real app, you would upload the file to your server/cloud storage
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

    // Reset the file input
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newAttachments[index].url);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    sortedMessages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString();
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

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select a conversation
          </h3>
          <p className="text-muted-foreground mb-6">
            Choose a customer from the list to view their messages and respond
            to their inquiries.
          </p>
          <div className="flex items-center justify-center text-sm text-primary">
            <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
            <span>Select a conversation to start</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <TopLoader isLoading={localLoading} />

      {/* Customer info header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {selectedUser.sender.profileImage ? (
                <img 
                  src={`${API_URL}${selectedUser.sender.profileImage}` || "/placeholder.svg"} 
                  alt={selectedUser.sender.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedUser.sender.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">
                {selectedUser.sender.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedUser.sender.email}
              </p>
            </div>
          </div>

          <TooltipProvider>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Call customer</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mail className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Email customer</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Customer details</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {selectedUser.product && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-muted-foreground mr-2">
              Regarding:
            </span>
            <Badge variant="secondary" className="flex items-center gap-2">
              {selectedUser.product.profileImage && (
                <div className="w-4 h-4 rounded overflow-hidden">
                  <img 
                    src={`${API_URL}${selectedUser.product.profileImage}` || "/placeholder.svg"} 
                    alt={selectedUser.product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {selectedUser.product.title || "Product"}
              {selectedUser.product.price && (
                <span className="text-xs font-semibold">${selectedUser.product.price}</span>
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/50">
        {localLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              No messages yet
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Start the conversation by sending a message to{" "}
              {selectedUser.sender.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="flex justify-center mb-4">
                  <Badge variant="outline" className="bg-muted">
                    {formatMessageDate(group.messages[0].createdAt)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {group.messages.map((msg, msgIndex) => {
                    const isCurrentUser = msg.isOwner;
                    const hasAttachments = msg.attachments && msg.attachments.length > 0;

                    return (
                      <div
                        key={msg._id || `temp-${msgIndex}`}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] ${
                            isCurrentUser ? "order-1" : "order-2"
                          }`}
                        >
                          {!isCurrentUser && (
                            <div className="flex items-center mb-1 ml-2">
                              <Avatar className="h-6 w-6 mr-2">
                                {msg.sender?.profileImage ? (
                                  <img 
                                    src={`${API_URL}${msg.sender.profileImage}` || "/placeholder.svg"} 
                                    alt={msg.sender.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {msg.sender?.name?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {msg.sender?.name || "Unknown"}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 break-words ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-card text-card-foreground border border-border rounded-tl-none"
                            }`}
                          >
                            {msg.text && (
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            )}
                            
                            {hasAttachments && (
                              <div className={`mt-2 ${msg.text ? 'pt-2 border-t' : ''} ${isCurrentUser ? 'border-primary-foreground/20' : 'border-border'}`}>
                                <div className="grid grid-cols-2 gap-2">
                                  {msg.attachments.map((attachment, index) => {
                                    const isImage = attachment.match(/\.(jpeg|jpg|gif|png)$/i);
                                    
                                    return isImage ? (
                                      <div key={index} className="relative rounded overflow-hidden">
                                        <img 
                                          src={attachment || "/placeholder.svg"} 
                                          alt="Attachment" 
                                          className="w-full h-auto object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div key={index} className="flex items-center p-2 rounded bg-background/50 text-xs">
                                        <Paperclip className="h-3 w-3 mr-2" />
                                        <span className="truncate">{attachment.split('/').pop()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${
                              isCurrentUser ? "text-right mr-2" : "ml-2"
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs">
                                {msg.readBy?.includes(selectedUser.sender._id) ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card rounded-2xl px-4 py-2 text-card-foreground border border-border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="p-2 border-t border-border bg-muted">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                {attachment.type.startsWith('image/') ? (
                  <div className="w-16 h-16 rounded overflow-hidden border border-border">
                    <img 
                      src={attachment.url || "/placeholder.svg"} 
                      alt={attachment.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded flex items-center justify-center bg-card border border-border p-1">
                    <div className="text-xs text-center truncate">
                      <Paperclip className="h-4 w-4 mx-auto mb-1" />
                      <span className="block truncate">{attachment.name}</span>
                    </div>
                  </div>
                )}
                <button 
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t border-border bg-card">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
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
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach files</span>
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-full pr-12"
              disabled={isSending}
            />
          </div>

          <Button
            type="submit"
            disabled={(newMessage.trim() === "" && attachments.length === 0) || isSending}
            size="icon"
            className="rounded-full"
          >
            {isSending ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>

        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Responses typically within 24 hours</span>
        </div>
      </div>
    </div>
  );
}