import {
  Bell,
  Clock3,
  LogOut,
  Users,
  CalendarDays,
  Activity,
  Briefcase,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";

import axios from "axios";

export default function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [time, setTime] =
    useState(new Date());

  const [attendance, setAttendance] =
    useState([]);

  const [status, setStatus] =
    useState("Offline");

  const [todayHours, setTodayHours] =
    useState("0");

  const [reason, setReason] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const chartData = [
    { day: "Mon", hours: 6 },
    { day: "Tue", hours: 8 },
    { day: "Wed", hours: 7 },
    { day: "Thu", hours: 9 },
    { day: "Fri", hours: 5 },
    { day: "Sat", hours: 4 },
  ];

  useEffect(() => {

    const timer = setInterval(() => {

      setTime(new Date());

    }, 1000);

    loadAttendance();

    return () => clearInterval(timer);

  }, []);

  const loadAttendance = async () => {

    try {

      const response =
        await axios.get(
          `https://remote-worker-backend.onrender.com/attendance/${user._id}`
        );

      setAttendance(response.data);

      if (response.data.length > 0) {

        const latest =
          response.data[0];

        if (
          latest.checkIn &&
          !latest.checkOut
        ) {

          setStatus("Working");

        } else {

          setStatus("Offline");
        }

        setTodayHours(
          latest.totalHours || "0"
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  const checkIn = async () => {

    try {

      const response =
        await axios.post(
          "https://remote-worker-backend.onrender.com/checkin",
          {
            userId: user._id,
          }
        );

      alert(response.data.message);

      loadAttendance();

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Check In Failed"
      );
    }
  };

  const checkOut = async () => {

    try {

      const response =
        await axios.post(
          "https://remote-worker-backend.onrender.com/checkout",
          {
            userId: user._id,
          }
        );

      alert(
        `Worked ${response.data.totalHours} hrs`
      );

      loadAttendance();

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Check Out Failed"
      );
    }
  };

  const applyLeave = async () => {

    try {

      const response =
        await axios.post(
          "https://remote-worker-backend.onrender.com/apply-leave",
          {
            userId: user._id,
            reason,
            fromDate,
            toDate,
          }
        );

      alert(response.data.message);

      setReason("");
      setFromDate("");
      setToDate("");

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Leave Apply Failed"
      );
    }
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white flex">

      {/* Sidebar */}
      <div className="w-72 bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 hidden lg:flex flex-col justify-between">

        <div>

          <div className="flex items-center gap-3 mb-12">

            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold">
              RW
            </div>

            <div>

              <h1 className="text-2xl font-bold">
                Remote Worker
              </h1>

              <p className="text-slate-400 text-sm">
                HR Management
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div className="bg-violet-600/20 border border-violet-500/30 rounded-2xl p-4 flex items-center gap-3">

              <Activity className="w-5 h-5" />

              Dashboard

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3">

              <Clock3 className="w-5 h-5" />

              Attendance

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3">

              <Users className="w-5 h-5" />

              Employees

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3">

              <CalendarDays className="w-5 h-5" />

              Leaves

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3">

              <Briefcase className="w-5 h-5" />

              Reports

            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-rose-600 p-4 rounded-2xl flex items-center justify-center gap-3 font-semibold"
        >

          <LogOut className="w-5 h-5" />

          Logout

        </button>

      </div>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">

        {/* Top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3">
              Welcome Back 👋
            </h1>

            <p className="text-slate-400 text-lg">
              {user?.name}
            </p>

            <p className="text-cyan-400 mt-2">
              {time.toLocaleDateString()} •{" "}
              {time.toLocaleTimeString()}
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">

              <Bell className="w-6 h-6 text-yellow-400" />

            </div>

          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6">

            <p className="text-violet-100 mb-3">
              Working Hours
            </p>

            <h2 className="text-5xl font-bold">
              {todayHours} hrs
            </h2>

          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6">

            <p className="text-cyan-100 mb-3">
              Attendance
            </p>

            <h2 className="text-5xl font-bold">
              {attendance.length}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6">

            <p className="text-green-100 mb-3">
              Productivity
            </p>

            <h2 className="text-5xl font-bold">
              92%
            </h2>

          </div>

          <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-6">

            <p className="text-rose-100 mb-3">
              Status
            </p>

            <h2 className="text-4xl font-bold">
              {status}
            </h2>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-5 mb-10">

          <button
            onClick={checkIn}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Start Work
          </button>

          <button
            onClick={checkOut}
            className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            End Work
          </button>

        </div>

        {/* Leave Form */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Apply Leave 📅
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="bg-slate-800 border border-white/10 rounded-2xl p-4 outline-none"
            />

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="bg-slate-800 border border-white/10 rounded-2xl p-4 outline-none"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="bg-slate-800 border border-white/10 rounded-2xl p-4 outline-none"
            />

          </div>

          <button
            onClick={applyLeave}
            className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-4 rounded-2xl font-bold"
          >
            Apply Leave
          </button>

        </div>

        {/* Chart */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Weekly Analytics
          </h2>

          <div style={{ width: "100%", height: 300 }}>

            <ResponsiveContainer>

              <BarChart data={chartData}>

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="hours"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}