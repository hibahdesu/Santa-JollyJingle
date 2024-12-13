// lib/chatHistory.ts
import mongoose from 'mongoose';

export interface ChatHistoryMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const chatHistorySchema = new mongoose.Schema({
  childName: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});


const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;

export const getChatHistory = async (childName: string) => {
  try {
    const chatHistory = await ChatHistory.findOne({ childName });
    return chatHistory ? chatHistory.messages : [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Error fetching chat history');
  }
};

export const updateChatHistory = async (childName: string, newMessage: ChatHistoryMessage) => {
  try {
    const existingChat = await ChatHistory.findOne({ childName });

    if (existingChat) {
      existingChat.messages.push(newMessage);
      await existingChat.save();
    } else {
      const newChatHistory = new ChatHistory({
        childName,
        messages: [newMessage]
      });
      await newChatHistory.save();
    }
  } catch (error) {
    console.error('Error updating chat history:', error);
    throw new Error('Error updating chat history');
  }
};
