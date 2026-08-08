const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  toggleLike,
  getComments,
  addComment,
} = require("../controllers/communityController");

// Get all posts
router.get(
  "/posts",
  authMiddleware,
  getPosts
);

// Create a post
router.post(
  "/posts",
  authMiddleware,
  createPost
);

// Like / unlike a post
router.post(
  "/posts/:postId/like",
  authMiddleware,
  toggleLike
);

// Get comments for a post
router.get(
  "/posts/:postId/comments",
  authMiddleware,
  getComments
);

// Add comment
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  addComment
);

module.exports = router;