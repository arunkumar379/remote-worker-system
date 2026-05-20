require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/User");
const Attendance = require("./models/Attendance");
const Leave = require("./models/Leave");

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

    const { name, email, password } =
      req.body;

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
      message:
        "Registration Failed",
    });
  }
});


// LOGIN
app.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;

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
        message:
          "User ID Missing",
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
        message:
          "Already Checked In",
      });
    }

    const now = new Date();

    const late =
      now.getHours() >= 9 &&
      now.getMinutes() > 15;

    const attendance =
      new Attendance({

        userId,

        checkIn: now,

        checkOut: null,

        totalHours: "0",

        late,

        status: "Present",

        earlyLeave: false,

        date: today,

      });

    await attendance.save();

    res.json({
      message:
        late
          ? "Checked In Late"
          : "Checked In Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Check In Failed",
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

    const checkoutTime =
      new Date();

    const earlyLeave =
      checkoutTime.getHours() < 18;

    attendance.checkOut =
      checkoutTime;

    const diff =
      attendance.checkOut -
      attendance.checkIn;

    const hours =
      (diff / (1000 * 60 * 60))
      .toFixed(2);

    attendance.totalHours =
      hours;

    attendance.earlyLeave =
      earlyLeave;

    await attendance.save();

    res.json({
      message:
        earlyLeave
          ? "Checked Out Early"
          : "Checked Out Successfully",

      totalHours: hours,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Check Out Failed",
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


// APPLY LEAVE
app.post(
  "/apply-leave",
  async (req, res) => {

    try {

      const {
        userId,
        reason,
        fromDate,
        toDate,
      } = req.body;

      const leave =
        new Leave({
          userId,
          reason,
          fromDate,
          toDate,
        });

      await leave.save();

      res.json({
        message:
          "Leave Applied Successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Leave Application Failed",
      });
    }
  }
);


// USER LEAVES
app.get(
  "/leaves/:userId",
  async (req, res) => {

    try {

      const leaves =
        await Leave.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(leaves);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Failed To Load Leaves",
      });
    }
  }
);


// ADMIN ALL LEAVES
app.get(
  "/all-leaves",
  async (req, res) => {

    try {

      const leaves =
        await Leave.find()
        .populate("userId")
        .sort({
          createdAt: -1,
        });

      res.json(leaves);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Failed To Load Leaves",
      });
    }
  }
);


// APPROVE LEAVE
app.put(
  "/approve-leave/:id",
  async (req, res) => {

    try {

      await Leave.findByIdAndUpdate(
        req.params.id,
        {
          status: "Approved",
        }
      );

      res.json({
        message:
          "Leave Approved",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Approval Failed",
      });
    }
  }
);


// REJECT LEAVE
app.put(
  "/reject-leave/:id",
  async (req, res) => {

    try {

      await Leave.findByIdAndUpdate(
        req.params.id,
        {
          status: "Rejected",
        }
      );

      res.json({
        message:
          "Leave Rejected",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Reject Failed",
      });
    }
  }
);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});