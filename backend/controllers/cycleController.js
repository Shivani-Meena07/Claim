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

module.exports = {
  createCycle,
  getCycles,
  updateCycle,
  deleteCycle,
};