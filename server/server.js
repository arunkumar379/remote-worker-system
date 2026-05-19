require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/User");
const Attendance = require("./models/Attendance");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});


// REGISTER
app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User Registered",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Registration Failed",
    });
  }
});


// LOGIN
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login Failed",
    });
  }
});


// CHECK IN
app.post("/checkin", async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID Missing",
      });
    }

    const today =
      new Date().toDateString();

    const alreadyCheckedIn =
      await Attendance.findOne({
        userId,
        date: today,
        checkOut: null,
      });

    if (alreadyCheckedIn) {
      return res.status(400).json({
        message: "Already Checked In",
      });
    }

    const attendance =
      new Attendance({

        userId,

        checkIn: new Date(),

        checkOut: null,

        totalHours: "0",

        date: today,

      });

    await attendance.save();

    res.json({
      message:
        "Checked In Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Check In Failed",
    });
  }
});


// CHECK OUT
app.post("/checkout", async (req, res) => {

  try {

    const { userId } = req.body;

    const attendance =
      await Attendance.findOne({
        userId,
        checkOut: null,
      });

    if (!attendance) {
      return res.status(400).json({
        message:
          "No Active Check In",
      });
    }

    attendance.checkOut =
      new Date();

    const diff =
      attendance.checkOut -
      attendance.checkIn;

    const hours =
      (diff / (1000 * 60 * 60))
      .toFixed(2);

    attendance.totalHours =
      hours;

    await attendance.save();

    res.json({
      message:
        "Checked Out Successfully",
      totalHours: hours,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Check Out Failed",
    });
  }
});


// USER ATTENDANCE
app.get(
  "/attendance/:userId",
  async (req, res) => {

    try {

      const attendance =
        await Attendance.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(attendance);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Failed To Load Attendance",
      });
    }
  }
);


// ADMIN ATTENDANCE
app.get(
  "/all-attendance",
  async (req, res) => {

    try {

      const attendance =
        await Attendance.find()
        .populate("userId")
        .sort({
          createdAt: -1,
        });

      res.json(attendance);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Failed To Load Data",
      });
    }
  }
);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});