import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Start a conversation between the authenticated user and a recipient.
// Optionally, a productId can be provided to associate the conversation with a product.
export const startConversation = async (req, res) => {
  try {
    const { recipientId, productId } = req.body;
    const senderId = req.userId;

    // Build the query including the product field if productId is provided
    const query = {
      participants: { $all: [senderId, recipientId] },
      ...(productId && { product: productId }),
    };

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        ...(productId && { product: productId }),
      });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a message in a conversation and emit it to connected clients via socket.io.
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, attachments } = req.body;
    const senderId = req.userId;
    const message = new Message({
      conversationId,
      sender: senderId,
      text,
      attachments: attachments || [],
    });
    await message.save();

    // Update the last message text in the conversation for previews.
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text });
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profileImage');

    // Emit the new message using socket.io.
    const io = req.app.get("io");
    if (io) {
      // Using the conversationId as the room name.
      io.to(conversationId.toString()).emit("newMessage", populatedMessage );
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all conversations for the authenticated user.
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
        participants: userId,
      })
      .populate('product', 'title price image')
      .populate('participants', 'name email profileImage') // Add participant population
      .sort({ updatedAt: -1 });

    // Format the response to include necessary participant details
    const formattedConversations = conversations.map(convo => ({
      ...convo._doc,
      otherParticipant: convo.participants.find(p => p._id.toString() !== userId.toString())
    }));

    res.status(200).json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all messages for a specific conversation.
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve unread messages for the authenticated user.
export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.userId;
    // First, find all conversation IDs for the user.
    const conversations = await Conversation.find({ participants: userId });
    const conversationIds = conversations.map((conv) => conv._id);

    const unreadMessages = await Message.find({
      conversationId: { $in: conversationIds },
      readBy: { $ne: userId },
    });
    res.status(200).json(unreadMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all messages in a conversation as read by the authenticated user.
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.userId;
    await Message.updateMany(
      {
        conversationId,
        readBy: { $ne: userId },
      },
      {
        $push: { readBy: userId },
      }
    );

    // Emit the new message using socket.io.
    const io = req.app.get("io");
    if (io) {
      // Using the conversationId as the room name.
      io.to(conversationId.toString()).emit("messages-read", { 
        conversationId,
        userId 
      } );
    }
    
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
