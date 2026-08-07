const express = require("express");
const router = express.Router();

const {
  getDoctors,
  createBooking,
  getMyBookings,
} = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all doctors
router.get("/", getDoctors);

// Create a consultation booking
router.post("/book", authMiddleware, createBooking);

// Get bookings of logged-in user
router.get("/bookings", authMiddleware, getMyBookings);

module.exports = router;