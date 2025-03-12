import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import {
  getConversationDetails,
  getMessages,
  markAsRead,
  sendMessage,
} from "../api/chatAPI";
import { useAuth } from "../hooks/useAuth";
import { Send, Image, MoreVertical, ArrowLeft, Phone, VideoIcon } from "lucide-react";

const ChatPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, conversationRes] = await Promise.all([
          getMessages(conversationId),
          getConversationDetails(conversationId),
        ]);
        const sortedMessages = sortMessages(messagesRes);
        setMessages(sortedMessages);
        setConversation(conversationRes);
        await markAsRead(conversationId);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();

    socket.current = io(process.env.REACT_APP_API_URL);
    socket.current.emit("joinConversation", conversationId);

    socket.current.on("newMessage", (message) => {
      setMessages((prev) => sortMessages([...prev, message]));
      scrollToBottom();
    });

    return () => {
      socket.current.emit("leaveConversation", conversationId);
      socket.current.disconnect();
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = {
      conversationId,
      text: newMessage,
      attachments: [],
    };

    let tempMessage;

    try {
      // tempMessage = {
      //   ...messageToSend,
      //   _id: Date.now().toString(),
      //   sender: { _id: user.id },
      //   createdAt: new Date(),
      //   readBy: [user.id],
      // };

      //setMessages((prev) => sortMessages([...prev, tempMessage]));
      setNewMessage("");
      scrollToBottom();

      await sendMessage(messageToSend);

     //setMessages((prev) => [...prev, savedMessage]);
      // setMessages((prev) =>
      //   sortMessages(
      //     prev.map((msg) =>
      //       msg._id === tempMessage._id ? savedMessage : msg
      //     )
      //   )
      // );

      //socket.current.emit("sendMessage", savedMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== tempMessage._id)
      );
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          {conversation?.product && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                {conversation.product.displayImage ? (
                  <img
                    src={`${'http://localhost:5000'}${conversation.product.displayImage}`}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{conversation.product.title}</h2>
                <p className="text-green-600 font-medium">${conversation.product.price}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <VideoIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => {
          const isSender = message.sender._id === user.id;
          return (
            <div
              key={message._id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isSender
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-xs mt-1 block ${
                    isSender ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;