const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

// Controller for comment-related logic

// GET /api/comments/:postId - Get all comments for a post
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// POST /api/comments/:postId - Add a comment to a post
exports.createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { content, user } = req.body;
    const comment = new Comment({
      user,
      post: req.params.postId,
      content,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports = {};
