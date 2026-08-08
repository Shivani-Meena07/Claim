const mongoose = require("mongoose");
const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");

const ANONYMOUS_NAMES = [
  "Anonymous Rose",
  "Anonymous Daisy",
  "Anonymous Luna",
  "Anonymous Pearl",
  "Anonymous Sage",
  "Anonymous Willow",
  "Anonymous Lotus",
  "Anonymous Iris",
  "Anonymous Fern",
  "Anonymous Sky",
];

function getAnonymousName() {
  return ANONYMOUS_NAMES[
    Math.floor(Math.random() * ANONYMOUS_NAMES.length)
  ];
}

// ==========================================
// GET ALL COMMUNITY POSTS
// ==========================================

const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .lean();

    const userId = req.user.id.toString();

    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      author: post.author,
      tag: post.tag,
      text: post.text,
      likes: post.likes,
      comments: post.comments,
      liked: post.likedBy.some(
        (id) => id.toString() === userId
      ),
      createdAt: post.createdAt,
      time: formatTime(post.createdAt),
    }));

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("GET COMMUNITY POSTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch community posts",
    });
  }
};

// ==========================================
// CREATE POST
// ==========================================

const createPost = async (req, res) => {
  try {
    const { text, tag } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post text is required",
      });
    }

    const post = await CommunityPost.create({
      user: req.user.id,
      author: getAnonymousName(),
      text: text.trim(),
      tag: tag || "General",
      likes: 0,
      comments: 0,
      likedBy: [],
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        id: post._id.toString(),
        author: post.author,
        tag: post.tag,
        text: post.text,
        likes: post.likes,
        comments: post.comments,
        liked: false,
        createdAt: post.createdAt,
        time: "Just now",
      },
    });
  } catch (error) {
    console.error("CREATE COMMUNITY POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

// ==========================================
// TOGGLE LIKE
// ==========================================

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.id.toString();

    const alreadyLiked = post.likedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId
      );

      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(req.user.id);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("TOGGLE LIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};

// ==========================================
// GET COMMENTS
// ==========================================

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const comments = await CommunityComment.find({
      post: postId,
    })
      .sort({ createdAt: 1 })
      .lean();

    const formattedComments = comments.map((comment) => ({
      id: comment._id.toString(),
      postId: comment.post.toString(),
      author: comment.author,
      text: comment.text,
      createdAt: comment.createdAt,
      time: formatTime(comment.createdAt),
    }));

    res.status(200).json({
      success: true,
      comments: formattedComments,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// ==========================================
// ADD COMMENT
// ==========================================

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await CommunityComment.create({
      post: postId,
      user: req.user.id,
      author: getAnonymousName(),
      text: text.trim(),
    });

    post.comments += 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: {
        id: comment._id.toString(),
        postId: postId,
        author: comment.author,
        text: comment.text,
        createdAt: comment.createdAt,
        time: "Just now",
      },
      commentsCount: post.comments,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// ==========================================
// TIME FORMATTER
// ==========================================

function formatTime(date) {
  const now = new Date();
  const created = new Date(date);

  const diff = Math.floor(
    (now.getTime() - created.getTime()) / 1000
  );

  if (diff < 60) {
    return "Just now";
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hr ago`;
  }

  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return created.toLocaleDateString();
}

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  getComments,
  addComment,
};