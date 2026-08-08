const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cycleRoutes = require("./routes/cycleRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const reportRoutes = require("./routes/reportRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const moodRoutes = require("./routes/moodRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cycles", cycleRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/wellness", wellnessRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Claim backend is running successfully 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Claim backend running on port ${PORT}`);
});