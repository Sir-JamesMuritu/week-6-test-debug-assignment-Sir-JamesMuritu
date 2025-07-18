// postControllers.js - CRUD logic for blog posts

const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// GET /api/posts - Get all posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'username').populate('category', 'name');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id - Get a single post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username').populate('category', 'name');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// POST /api/posts - Create a new post
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id - Update a post
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id - Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
