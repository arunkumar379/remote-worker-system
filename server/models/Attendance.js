const mongoose = require("mongoose");

const attendanceSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      checkIn: {
        type: Date,
        default: null,
      },

      checkOut: {
        type: Date,
        default: null,
      },

      totalHours: {
        type: String,
        default: "0",
      },

      date: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Attendance",
    attendanceSchema
  );