// Validation logic for comments

const { body } = require('express-validator');

exports.createCommentValidator = [
  body('content').notEmpty().withMessage('Comment content is required'),
  body('user').notEmpty().withMessage('User is required'),
];
