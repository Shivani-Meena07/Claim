const Booking = require("../models/Booking");
const Doctor = require("../models/doctor");

// ===============================
// CREATE BOOKING
// ===============================

const createBooking = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, date and time are required",
      });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check selected time slot
    if (
      Array.isArray(doctor.availableSlots) &&
      !doctor.availableSlots.includes(time)
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected time slot is not available",
      });
    }

    // Check duplicate booking
    const existingBooking = await Booking.findOne({
      doctorId,
      date,
      time,
      status: "confirmed",
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      doctorId,
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
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// ===============================
// GET USER BOOKINGS
// ===============================

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// ===============================
// CANCEL BOOKING
// ===============================

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
};