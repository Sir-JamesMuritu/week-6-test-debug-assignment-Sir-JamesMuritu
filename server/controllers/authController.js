const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

module.exports = {
  login: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } catch (err) {
      next(err);
    }
  },
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
      user = new User({ username, email, password });
      await user.save();
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } catch (err) {
      next(err);
    }
  },
};