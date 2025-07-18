const express = require('express');
const postController = require('../controllers/postControllers');
const { createPostValidator, updatePostValidator } = require('../validators/postValidator');
const router = express.Router();

// GET all posts
router.get('/', postController.getPosts);
// GET post by ID
router.get('/:id', postController.getPostById);
// POST create post
router.post('/', createPostValidator, postController.createPost);
// PUT update post
router.put('/:id', updatePostValidator, postController.updatePost);
// DELETE post
router.delete('/:id', postController.deletePost);

module.exports = router;