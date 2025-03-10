"use client"

import { useState, useEffect } from "react"
import { Users } from 'lucide-react'

import Sidebar from "@/components/Sidebar"
import { TopLoader } from "@/components/TopLoader"
import { initializeSocket } from "@/api/api" 
import { useAuthStore } from "@/store/authStore"
import { MessagesList } from "@/components/MessagesList"
import { ChatBox } from "@/components/ChatBox"

export default function AdminChatPage() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const [socketInitialized, setSocketInitialized] = useState(false)

  // Initialize socket when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && !socketInitialized) {
      initializeSocket();
      
      // Set up global socket event listeners here if needed
      
      setSocketInitialized(true);
      
      // Clean up function
      return () => {
        // Clean up global socket listeners if needed
        // Note: Don't disconnect the socket here as it might be used by other components
      };
    }
  }, [isAuthenticated, socketInitialized]);

  return (
    <div className="flex h-screen bg-background">
      <TopLoader isLoading={loading} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-foreground">Customer Support</h1>
            <p className="text-sm text-muted-foreground">Manage customer inquiries and provide assistance</p>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Messages List */}
          <div className="w-1/3 border-r border-border bg-card overflow-y-auto">
            <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Conversations</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Select a customer to view their messages</p>
            </div>
            <MessagesList 
              onSelectUser={setSelectedUser} 
              setLoading={setLoading} 
              socketReady={socketInitialized}
            />
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col bg-background">
            <ChatBox 
              selectedUser={selectedUser} 
              setLoading={setLoading} 
              socketReady={socketInitialized}
            />
          </div>
        </div>
      </div>
    </div>
  )
}