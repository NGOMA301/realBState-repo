import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const ChatInterface = () => {
  const { productId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch product and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product first to get createdBy
        const productResponse = await axios.get(
          `http://localhost:5000/api/product/details/i/${productId}`
        );
        setProduct(productResponse.data.product);

        // Then fetch conversation
        const conversationResponse = await axios.get(
          `http://localhost:5000/api/chat/conversation/${productId}`,
          { withCredentials: true }
        );
        setMessages(conversationResponse.data.messages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !product) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat/send/messages',
        {
          productId,
          receiverId: product.createdBy, // Use product creator as receiver
          message: newMessage
        },
        { withCredentials: true }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">Loading conversation...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center text-red-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="border rounded-lg p-4 mb-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${message.sender._id === user.id ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.sender._id === user.id
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.message}</p>
              <small className="text-gray-500 text-xs">
                {new Date(message.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
          placeholder="Type your message..."
          disabled={!product}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!newMessage.trim() || !product}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;