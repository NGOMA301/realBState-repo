import { useEffect, useState } from "react";
import { Clock, MessageSquare, Search, RefreshCw } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TopLoader } from "./TopLoader";
import { chatApi, subscribeToNewMessages } from "@/api/api";

export function MessagesList({ onSelectUser, setLoading, socketReady }) {
  const [conversations, setConversations] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const API_URL = 'http://localhost:5000'

  const fetchData = async () => {
    setLocalLoading(true);
    setLoading(true);
    try {
      const [conversationsData, unreadData] = await Promise.all([
        chatApi.getAdminMessages(),
        chatApi.getUnreadMessages(),
      ]);
      
      // Create unread counts map
      const unreadMap = {};
      unreadData.forEach(msg => {
        unreadMap[msg.conversationId] = (unreadMap[msg.conversationId] || 0) + 1;
      });
      
      setConversations(conversationsData);
      setUnreadCounts(unreadMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Only set up socket subscription if socket is ready
    if (socketReady) {
      console.log("Setting up message subscription in MessagesList");
      
      // Subscribe to new messages for real-time updates
      const cleanup = subscribeToNewMessages((newMessage) => {
        console.log("MessagesList received new message:", newMessage);
        
        // Update conversations with new message
        setConversations(prevConversations => {
          return prevConversations.map(convo => {
            if (convo._id === newMessage.conversationId) {
              // If this isn't the active conversation, increment unread count
              if (activeConversationId !== newMessage.conversationId) {
                setUnreadCounts(prev => ({
                  ...prev,
                  [newMessage.conversationId]: (prev[newMessage.conversationId] || 0) + 1
                }));
              }
              
              return {
                ...convo,
                lastMessage: newMessage.text,
                updatedAt: newMessage.createdAt
              };
            }
            return convo;
          });
        });
      });

      return () => {
        // Clean up socket subscription
        cleanup();
      };
    }
  }, [activeConversationId, socketReady]); // Add socketReady to dependencies

  
  // Filter and sort conversations
  const filteredConversations = conversations
    .filter(convo => {
      if (!convo.participants || !convo.product) return false;
      
      const participant = convo.participants.find(p => p._id !== convo.product.createdBy);
      if (!participant) return false;
      
      return (
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        convo.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleRefresh = () => {
    fetchData();
  };

  const handleSelectConversation = async (conversation) => {
    setActiveConversationId(conversation._id);
    
    // Find the customer (participant who is not the product creator)
    const customer = conversation.participants.find(
      p => p._id !== conversation.product.createdBy
    );
    
    onSelectUser({
      _id: conversation._id,
      conversation: conversation,
      sender: customer,
      product: conversation.product,
      unreadCount: unreadCounts[conversation._id] || 0
    });

    // Mark as read if there are unread messages
    if (unreadCounts[conversation._id]) {
      try {
        await chatApi.markAsRead(conversation._id);
        setUnreadCounts(prev => ({
          ...prev,
          [conversation._id]: 0
        }));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const formatLastActive = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <TopLoader isLoading={localLoading} />

      <div className="p-4 border-b border-border">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {localLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No conversations found</p>
            {searchTerm && <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              if (!conversation.participants || !conversation.product) return null;
              
              const participant = conversation.participants.find(p => p._id !== conversation.product.createdBy);
              if (!participant) return null;
              
              const unreadCount = unreadCounts[conversation._id] || 0;
              const lastMessage = conversation.lastMessage || "";

              return (
                <li
                  key={conversation._id}
                  className={`cursor-pointer transition-colors ${
                    activeConversationId === conversation._id
                      ? "bg-primary/10 border-l-4 border-primary"
                      : unreadCount > 0
                      ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-200 dark:border-blue-800"
                      : "hover:bg-muted border-l-4 border-transparent"
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          {participant.profileImage ? (
                            <img 
                              src={`${API_URL}${participant.profileImage}` || "/placeholder.svg"} 
                              alt={participant.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{participant.name}</h3>
                          <p className="text-xs text-muted-foreground">{participant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLastActive(conversation.updatedAt)}
                        </span>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="rounded-full">{unreadCount}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="ml-13 pl-10">
                      <p className="text-sm font-medium line-clamp-1 text-foreground">
                        {lastMessage || "No messages yet"}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {conversation.product.title}
                      </Badge>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-border bg-muted sticky bottom-0">
        <Button onClick={handleRefresh} variant="outline" className="w-full cursor-pointer shadow-sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Conversations
        </Button>
      </div>
    </div>
  );
}