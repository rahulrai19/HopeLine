import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  senderName: {
    type: String,
    required: true,
  },
  senderRole: {
    type: String,
    required: true,
    enum: ['student', 'admin', 'system'],
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
