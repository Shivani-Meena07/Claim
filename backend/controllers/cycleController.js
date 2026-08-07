const { generateCycleInsight } = require("../services/geminiService");
const Cycle = require("../models/Cycle");

const createCycle = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      cycleLength,
      flow,
      symptoms,
      pain,
    } = req.body;

    if (!startDate) {
      return res.status(400).json({
        message: "Start date is required",
      });
    }

    const cycle = await Cycle.create({
      user: req.user.id,
      startDate,
      endDate,
      cycleLength,
      flow,
      symptoms,
      pain,
    });

    res.status(201).json({
      message: "Cycle saved successfully",
      cycle,
    });
  } catch (error) {
    console.error("Create cycle error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({
      user: req.user.id,
    }).sort({ startDate: -1 });

    res.status(200).json({
      cycles,
    });
  } catch (error) {
    console.error("Get cycles error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getCycleAIInsight = async (req, res) => {
  try {
    const cycles = await Cycle.find({
      user: req.user.id,
    }).sort({ startDate: -1 });

    if (!cycles.length) {
      return res.status(400).json({
        message: "Please save at least one cycle before requesting an AI insight.",
      });
    }

    const latestCycle = cycles[0];

    const averageCycleLength =
      Math.round(
        cycles.reduce(
          (sum, cycle) => sum + (cycle.cycleLength || 28),
          0
        ) / cycles.length
      ) || 28;

    const lastStartDate = new Date(latestCycle.startDate);

    const nextPeriod = new Date(lastStartDate);
    nextPeriod.setDate(
      nextPeriod.getDate() + averageCycleLength
    );

    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(
      ovulationDate.getDate() - 14
    );

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(
      fertileStart.getDate() - 5
    );

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(
      fertileEnd.getDate() + 1
    );

    const prediction = {
      averageCycleLength,
      nextPeriod: nextPeriod.toISOString(),
      ovulationDate: ovulationDate.toISOString(),
      fertileWindow: {
        start: fertileStart.toISOString(),
        end: fertileEnd.toISOString(),
      },
    };

    const insight = await generateCycleInsight(
      {
        cycleLength: latestCycle.cycleLength || averageCycleLength,
        flow: latestCycle.flow,
        symptoms: latestCycle.symptoms,
        pain: latestCycle.pain,
      },
      prediction
    );

    res.status(200).json({
      insight,
      prediction,
    });
  } catch (error) {
    console.error("AI cycle insight error:", error);

    res.status(500).json({
      message: "Failed to generate AI cycle insight",
    });
  }
};

const updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cycle) {
      return res.status(404).json({
        message: "Cycle not found",
      });
    }

    res.status(200).json({
      message: "Cycle updated successfully",
      cycle,
    });
  } catch (error) {
    console.error("Update cycle error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!cycle) {
      return res.status(404).json({
        message: "Cycle not found",
      });
    }

    res.status(200).json({
      message: "Cycle deleted successfully",
    });
  } catch (error) {
    console.error("Delete cycle error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPrediction = async (req, res) => {
  try {
    const cycles = await Cycle.find({
      user: req.user.id,
    }).sort({ startDate: -1 });

    if (cycles.length === 0) {
      return res.status(200).json({
        message: "Not enough cycle data for prediction",
        prediction: null,
      });
    }

    // Use saved cycle lengths
    const cycleLengths = cycles
      .map((cycle) => cycle.cycleLength)
      .filter(
        (length) =>
          typeof length === "number" &&
          length > 0
      );

    // Default to 28 days if no valid length exists
    const averageCycleLength =
      cycleLengths.length > 0
        ? Math.round(
            cycleLengths.reduce(
              (sum, length) => sum + length,
              0
            ) / cycleLengths.length
          )
        : 28;

    // Latest saved cycle
    const latestCycle = cycles[0];

    const latestStartDate = new Date(
      latestCycle.startDate
    );

    // Next expected period
    const nextPeriod = new Date(
      latestStartDate
    );

    nextPeriod.setDate(
      nextPeriod.getDate() + averageCycleLength
    );

    // Estimated ovulation
    const ovulationDate = new Date(
      nextPeriod
    );

    ovulationDate.setDate(
      ovulationDate.getDate() - 14
    );

    // Fertile window: 5 days before ovulation
    // through 1 day after ovulation
    const fertileStart = new Date(
      ovulationDate
    );

    fertileStart.setDate(
      fertileStart.getDate() - 5
    );

    const fertileEnd = new Date(
      ovulationDate
    );

    fertileEnd.setDate(
      fertileEnd.getDate() + 1
    );

    res.status(200).json({
      prediction: {
        averageCycleLength,
        nextPeriod: nextPeriod.toISOString(),
        ovulationDate: ovulationDate.toISOString(),
        fertileWindow: {
          start: fertileStart.toISOString(),
          end: fertileEnd.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error(
      "Prediction error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createCycle,
  getCycles,
  updateCycle,
  deleteCycle,
  getPrediction,
  getCycleAIInsight,
};