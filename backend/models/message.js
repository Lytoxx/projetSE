// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
     type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
  },
  chat : {
    type : mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true
  },
  content: {
     type: String, required: true 
  },
  timestamp: { 
    type: Date, default: Date.now 
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;