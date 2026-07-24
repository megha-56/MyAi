import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new Schema({
  sessionId: { type: String, required: true },
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.models.Conversation ||
  mongoose.model('Conversation', conversationSchema);