// categoryValidator.js - Validation rules for categories

const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name').notEmpty().withMessage('Category name is required'),
];
