// Mongoose model for comments

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
