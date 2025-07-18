const express = require('express');
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const router = express.Router();

// Register
router.post('/register', registerValidator, validate, authController.register);
// Login
router.post('/login', loginValidator, validate, authController.login);

module.exports = router;