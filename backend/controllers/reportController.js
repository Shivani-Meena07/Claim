const { generateMonthlyReport } = require("../services/geminiService");
const Cycle = require("../models/Cycle");

const getMonthlyReportAI = async (req, res) => {
  try {
    // Get only the logged-in user's cycles
    const cycles = await Cycle.find({
      user: req.user.id,
    })
      .sort({ startDate: -1 })
      .limit(6);

    if (!cycles.length) {
      return res.status(400).json({
        success: false,
        message: "No cycle data found for this user.",
      });
    }

    // -----------------------------
    // Cycle lengths
    // -----------------------------

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

    // -----------------------------
    // Symptom frequency
    // -----------------------------

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

    // -----------------------------
    // Flow distribution
    // -----------------------------

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

    // -----------------------------
    // Report data
    // -----------------------------

    const reportData = {
      cycleLengths,
      symptomFrequency,
      flowSplit,

      // Mood and sleep are not currently
      // stored in the Cycle model.
      moodTrend: [],
      sleepTrend: [],
    };

    console.log(
      "Monthly report data:",
      JSON.stringify(reportData, null, 2)
    );

    // -----------------------------
    // Generate AI summary
    // -----------------------------

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