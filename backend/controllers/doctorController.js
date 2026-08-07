const Doctor = require("../models/doctor");

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

module.exports = {
  getDoctors,
};