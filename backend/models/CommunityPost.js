const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tag: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    likes: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);