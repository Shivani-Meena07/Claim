const { generateMonthlyReport } = require("../services/geminiService");

const Cycle = require("../models/Cycle");
const Mood = require("../models/Mood");
const Sleep = require("../models/Sleep");

const getMonthlyReportAI = async (req, res) => {
  try {
    const userId = req.user.id;

    // ===============================
    // GET USER'S CYCLE DATA
    // ===============================

    const cycles = await Cycle.find({
      user: userId,
    })
      .sort({ startDate: -1 })
      .limit(6);

    if (!cycles.length) {
      return res.status(400).json({
        success: false,
        message: "No cycle data found for this user.",
      });
    }

    // ===============================
    // GET USER'S MOOD DATA
    // ===============================

    const moods = await Mood.find({
      user: userId,
    })
      .sort({ date: -1 })
      .limit(30);

    // ===============================
    // GET USER'S SLEEP DATA
    // ===============================

    const sleep = await Sleep.find({
      user: userId,
    })
      .sort({ date: -1 })
      .limit(30);

    // ===============================
    // CYCLE LENGTHS
    // ===============================

    const cycleLengths = cycles
      .filter(
        (cycle) =>
          typeof cycle.cycleLength === "number" &&
          cycle.cycleLength > 0
      )
      .map((cycle) => ({
        month: new Date(cycle.startDate).toLocaleString("en-US", {
          month: "short",
        }),
        length: cycle.cycleLength,
      }))
      .reverse();

    // ===============================
    // SYMPTOM FREQUENCY
    // ===============================

    const symptomCounts = {};

    cycles.forEach((cycle) => {
      if (Array.isArray(cycle.symptoms)) {
        cycle.symptoms.forEach((symptom) => {
          symptomCounts[symptom] =
            (symptomCounts[symptom] || 0) + 1;
        });
      }
    });

    const symptomFrequency = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({
        symptom,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // ===============================
    // FLOW DISTRIBUTION
    // ===============================

    const flowCounts = {};

    cycles.forEach((cycle) => {
      if (cycle.flow && cycle.flow !== "None") {
        flowCounts[cycle.flow] =
          (flowCounts[cycle.flow] || 0) + 1;
      }
    });

    const flowSplit = Object.entries(flowCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // ===============================
    // MOOD TREND
    // ===============================

    const moodTrend = moods
      .map((entry) => ({
        date: new Date(entry.date).toISOString().split("T")[0],
        mood: entry.mood,
        note: entry.note || "",
      }))
      .reverse();

    // ===============================
    // SLEEP TREND
    // ===============================

    const sleepTrend = sleep
      .map((entry) => ({
        date: new Date(entry.date).toISOString().split("T")[0],
        hours: entry.hours,
        quality: entry.quality,
      }))
      .reverse();

    // ===============================
    // REPORT DATA
    // ===============================

    const reportData = {
      cycleLengths,
      symptomFrequency,
      flowSplit,
      moodTrend,
      sleepTrend,
    };

    console.log(
      "Monthly report data:",
      JSON.stringify(reportData, null, 2)
    );

    // ===============================
    // GENERATE AI SUMMARY
    // ===============================

    const summary = await generateMonthlyReport(reportData);

    res.status(200).json({
      success: true,
      summary,
      reportData,
    });
  } catch (error) {
    console.error("Monthly report AI error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate monthly report",
    });
  }
};

module.exports = {
  getMonthlyReportAI,
};