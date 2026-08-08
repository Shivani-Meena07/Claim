const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sleep", sleepSchema);