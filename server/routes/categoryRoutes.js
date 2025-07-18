const express = require('express');
const categoryController = require('../controllers/categoryController');
const { createCategoryValidator } = require('../validators/categoryValidator');
const router = express.Router();

// GET all categories
router.get('/', categoryController.getCategories);
// POST create category
router.post('/', createCategoryValidator, categoryController.createCategory);

module.exports = router;