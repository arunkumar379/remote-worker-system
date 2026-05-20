import {
  Bell,
  Clock3,
  LogOut,
  Users,
  CalendarDays,
  Activity,
  Briefcase,
  Sparkles,
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

    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white flex">

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-bounce"></div>

      {/* Sidebar */}
      <div className="w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 hidden lg:flex flex-col justify-between z-10">

        <div>

          <div className="flex items-center gap-3 mb-12">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-2xl animate-pulse">
              AK
            </div>

            <div>

              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                AKs IT PARK
              </h1>

              <p className="text-slate-400 text-sm">
                Premium HR System
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div className="bg-violet-600/20 border border-violet-500/30 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl shadow-2xl hover:scale-105 transition duration-300">

              <Activity className="w-5 h-5" />

              Dashboard

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

              <Clock3 className="w-5 h-5" />

              Attendance

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

              <Users className="w-5 h-5" />

              Employees

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

              <CalendarDays className="w-5 h-5" />

              Leaves

            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

              <Briefcase className="w-5 h-5" />

              Reports

            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-rose-600 p-4 rounded-2xl hover:scale-105 transition duration-300 shadow-2xl flex items-center justify-center gap-3 font-semibold"
        >

          <LogOut className="w-5 h-5" />

          Logout

        </button>

      </div>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto relative z-10">

        {/* Floating Brand */}
        <div className="fixed top-5 right-5 z-50">

          <div className="bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 p-[2px] rounded-3xl shadow-2xl animate-pulse">

            <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-3xl flex items-center gap-3">

              <Sparkles className="w-7 h-7 text-yellow-400 animate-spin" />

              <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent tracking-widest">

                AKs IT PARK

              </h1>

            </div>

          </div>

        </div>

        {/* Welcome */}
        <div className="mb-10">

          <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent animate-pulse">

            Welcome To AKs IT PARK 🚀

          </h1>

          <p className="text-2xl text-slate-300">
            {user?.name}
          </p>

          <p className="text-cyan-400 mt-3 text-lg">
            {time.toLocaleDateString()} •{" "}
            {time.toLocaleTimeString()}
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

            <p className="text-violet-100 mb-3">
              Working Hours
            </p>

            <h2 className="text-5xl font-bold">
              {todayHours} hrs
            </h2>

          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

            <p className="text-cyan-100 mb-3">
              Attendance
            </p>

            <h2 className="text-5xl font-bold">
              {attendance.length}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

            <p className="text-green-100 mb-3">
              Productivity
            </p>

            <h2 className="text-5xl font-bold">
              92%
            </h2>

          </div>

          <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-105 transition duration-300">

            <p className="text-rose-100 mb-3">
              Status
            </p>

            <h2 className="text-4xl font-bold">
              {status}
            </h2>

          </div>

        </div>

        {/* Work Buttons */}
        <div className="flex flex-wrap gap-5 mb-10">

          <button
            onClick={checkIn}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-2xl hover:scale-105 transition duration-300 shadow-2xl font-bold text-lg"
          >
            Start Work
          </button>

          <button
            onClick={checkOut}
            className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 rounded-2xl hover:scale-105 transition duration-300 shadow-2xl font-bold text-lg"
          >
            End Work
          </button>

        </div>

        {/* Leave Form */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-xl shadow-2xl">

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
            className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-4 rounded-2xl hover:scale-105 transition duration-300 shadow-2xl font-bold"
          >
            Apply Leave
          </button>

        </div>

        {/* Chart */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            Weekly Analytics 📊
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