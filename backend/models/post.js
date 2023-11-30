// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number, 
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const post = mongoose.models.Post ||mongoose.model('Post', postSchema);

module.exports = post;