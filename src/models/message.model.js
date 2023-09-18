import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  content: {
    type: String,
    required: true,
  },
  isLastMessage: {
    type: Boolean,
    default: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  messageType: {
    type: String,
    enum: ['support', 'business'],
    required: true,
  },
});

messageSchema.index({
  createdAt: -1,
});

const Message = mongoose.model('message', messageSchema);

export { Message };
