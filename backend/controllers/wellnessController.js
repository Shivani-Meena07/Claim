
const {
  generateWellnessRecommendations,
} = require("../services/geminiService");

const Cycle = require("../models/Cycle");
const Mood = require("../models/Mood");
const Sleep = require("../models/Sleep");

const getWellnessRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const cycles = await Cycle.find({
      user: userId,
    })
      .sort({ startDate: -1 })
      .limit(3);

    const moods = await Mood.find({
      user: userId,
    })
      .sort({ date: -1 })
      .limit(14);

    const sleep = await Sleep.find({
      user: userId,
    })
      .sort({ date: -1 })
      .limit(14);

    const wellnessData = {
      cycles,
      moods,
      sleep,
    };

    console.log(
      "Wellness data:",
      JSON.stringify(wellnessData, null, 2)
    );

    const recommendations =
      await generateWellnessRecommendations(wellnessData);

    res.status(200).json({
      success: true,
      recommendations,
    });

  } catch (error) {
    console.error(
      "Wellness recommendations error:",
      error
    );

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI wellness recommendations are temporarily unavailable because the Gemini API quota has been reached.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate wellness recommendations",
    });
  }
};

module.exports = {
  getWellnessRecommendations,
};
