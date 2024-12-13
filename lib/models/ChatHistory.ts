//lib/models/ChatHistory.ts
import mongoose from 'mongoose';

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
