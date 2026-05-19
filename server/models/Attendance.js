const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  checkIn: Date,

  checkOut: Date,

  totalHours: Number,

  date: String,

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);