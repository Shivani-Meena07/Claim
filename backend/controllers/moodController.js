const Mood = require("../models/Mood");

// ===============================
// CREATE MOOD
// ===============================

const createMood = async (req, res) => {
  try {
    const { mood, note, date } = req.body;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required",
      });
    }

    if (mood < 1 || mood > 5) {
      return res.status(400).json({
        success: false,
        message: "Mood must be between 1 and 5",
      });
    }

    const newMood = await Mood.create({
      user: req.user.id,
      mood,
      note: note || "",
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      mood: newMood,
    });
  } catch (error) {
    console.error("Create mood error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save mood",
    });
  }
};

// ===============================
// GET USER MOODS
// ===============================

const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({
      user: req.user.id,
    }).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      moods,
    });
  } catch (error) {
    console.error("Get moods error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch moods",
    });
  }
};

module.exports = {
  createMood,
  getMoods,
};