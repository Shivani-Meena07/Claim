const mongoose = require("mongoose");
require("dotenv").config();

const Doctor = require("./models/doctor");

const doctors = [
  {
    name: "Dr. Anjali Rao",
    specialty: "Gynecologist",
    rating: 4.9,
    experience: 12,
    distance: 1.2,
    phone: "+91 9876543210",
    location: "Delhi",
    availableSlots: [
      "10:00 AM",
      "11:00 AM",
      "2:00 PM",
      "4:00 PM",
    ],
  },
  {
    name: "Dr. Neha Sharma",
    specialty: "Gynecologist",
    rating: 4.8,
    experience: 9,
    distance: 2.5,
    phone: "+91 9876543211",
    location: "Delhi",
    availableSlots: [
      "9:00 AM",
      "12:00 PM",
      "3:00 PM",
      "5:00 PM",
    ],
  },
  {
    name: "Dr. Priya Mehta",
    specialty: "Endocrinologist",
    rating: 4.7,
    experience: 10,
    distance: 3.1,
    phone: "+91 9876543212",
    location: "Delhi",
    availableSlots: [
      "10:30 AM",
      "1:00 PM",
      "3:30 PM",
    ],
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Doctor.deleteMany();

    await Doctor.insertMany(doctors);

    console.log("Doctors added successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding doctors:", error);
    process.exit(1);
  }
};

seedDoctors();