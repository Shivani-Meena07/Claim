const Doctor = require("../models/doctor");
const Booking = require("../models/Booking");

// ==========================================
// GET ALL DOCTORS
// ==========================================

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

// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, date and time are required",
      });
    }

    // Make sure the doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Create booking using logged-in user's ID
    const booking = await Booking.create({
      userId: req.user.id,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date,
      time,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Consultation booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

// ==========================================
// GET MY BOOKINGS
// ==========================================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate("doctorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

module.exports = {
  getDoctors,
  createBooking,
  getMyBookings,
};