const Sleep = require("../models/Sleep");

// ===============================
// CREATE SLEEP ENTRY
// ===============================

const createSleep = async (req, res) => {
  try {
    const { hours, quality, date } = req.body;

    if (hours === undefined || quality === undefined) {
      return res.status(400).json({
        success: false,
        message: "Sleep hours and quality are required",
      });
    }

    if (hours < 0 || hours > 24) {
      return res.status(400).json({
        success: false,
        message: "Sleep hours must be between 0 and 24",
      });
    }

    if (quality < 1 || quality > 5) {
      return res.status(400).json({
        success: false,
        message: "Sleep quality must be between 1 and 5",
      });
    }

    const sleep = await Sleep.create({
      user: req.user.id,
      hours,
      quality,
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Sleep data saved successfully",
      sleep,
    });
  } catch (error) {
    console.error("Create sleep error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save sleep data",
    });
  }
};

// ===============================
// GET USER SLEEP DATA
// ===============================

const getSleep = async (req, res) => {
  try {
    const sleep = await Sleep.find({
      user: req.user.id,
    }).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      sleep,
    });
  } catch (error) {
    console.error("Get sleep error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sleep data",
    });
  }
};

module.exports = {
  createSleep,
  getSleep,
};