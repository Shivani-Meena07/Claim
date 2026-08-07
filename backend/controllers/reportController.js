const { generateMonthlyReport } = require("../services/geminiService");

const getMonthlyReportAI = async (req, res) => {
  try {
    const {
      cycleLengths,
      symptomFrequency,
      flowSplit,
      moodTrend,
      sleepTrend,
    } = req.body;

    const reportData = {
      cycleLengths: cycleLengths || [],
      symptomFrequency: symptomFrequency || [],
      flowSplit: flowSplit || [],
      moodTrend: moodTrend || [],
      sleepTrend: sleepTrend || [],
    };

    const summary = await generateMonthlyReport(reportData);

    res.status(200).json({
      success: true,
      summary,
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