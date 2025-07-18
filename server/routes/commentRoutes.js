// Routes for comment-related endpoints

const express = require('express');
const commentController = require('../controllers/commentController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const router = express.Router();

// GET all comments for a post
router.get('/:postId', commentController.getCommentsByPost);
// POST a comment to a post
router.post(
  '/:postId',
  [body('content').notEmpty().withMessage('Comment content is required'), body('user').notEmpty().withMessage('User is required')],
  validate,
  commentController.createComment
);

module.exports = router;

