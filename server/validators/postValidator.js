// postValidator.js - Validation rules for posts

const { body } = require('express-validator');

exports.createPostValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

exports.updatePostValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
];
