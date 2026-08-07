const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    cycleLength: {
      type: Number,
      default: 28,
    },

    flow: {
      type: String,
      enum: ["None", "Light", "Medium", "Heavy"],
      default: "None",
    },

    symptoms: {
      type: [String],
      default: [],
    },

    pain: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cycle", cycleSchema);