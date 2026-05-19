import {
  Bell,
  Clock3,
  LogOut,
  Users,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";

import axios from "axios";

export default function ProfessionalDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [time, setTime] = useState(
    new Date()
  );

  const [attendance, setAttendance] =
    useState([]);

  const [status, setStatus] =
    useState("Offline");

  const [todayHours, setTodayHours] =
    useState("0");

  useEffect(() => {

    const timer = setInterval(() => {

      setTime(new Date());

    }, 1000);

    loadAttendance();

    return () => clearInterval(timer);

  }, []);

  const loadAttendance = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/attendance/${user._id}`
      );

      setAttendance(response.data);

      if (response.data.length > 0) {

        const latest = response.data[0];

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

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  const checkIn = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/checkin",
        {
          userId: user._id,
        }
      );

      alert(response.data.message);

      loadAttendance();

    } catch (error) {

      console.log(error);

      alert("Check In Failed");
    }
  };

  const checkOut = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/checkout",
        {
          userId: user._id,
        }
      );

      alert(
        `Checked Out Successfully

Total Hours:
${response.data.totalHours}`
      );

      loadAttendance();

    } catch (error) {

      console.log(error);

      alert("Check Out Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-violet-900 via-slate-950 to-black border-r border-violet-500/20 p-6 hidden lg:flex flex-col justify-between shadow-2xl">

        <div>

          <div className="flex items-center gap-3 mb-12">

            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold shadow-lg">
              RW
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Remote Worker
              </h1>

              <p className="text-slate-400 text-sm">
                Employee System
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <div className="bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-4 flex items-center gap-3 shadow-lg">

              <Users className="w-5 h-5 text-violet-300" />

              <span className="font-medium">
                Dashboard
              </span>

            </div>

            <div className="bg-slate-800/70 rounded-2xl p-4 flex items-center gap-3 text-slate-300 hover:bg-violet-600/20 hover:text-white transition-all cursor-pointer">

              <Clock3 className="w-5 h-5" />

              <span>
                Attendance
              </span>

            </div>

            <div className="bg-slate-800/70 rounded-2xl p-4 flex items-center gap-3 text-slate-300 hover:bg-cyan-600/20 hover:text-white transition-all cursor-pointer">

              <CalendarDays className="w-5 h-5" />

              <span>
                Reports
              </span>

            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:scale-105 transition-all rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

      </div>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
              Welcome Back 👋
            </h1>

            <p className="text-slate-400 text-lg">
              {user?.name || "Employee"}
            </p>

            <p className="text-cyan-400 mt-2 text-lg">
              {time.toLocaleDateString()} •{" "}
              {time.toLocaleTimeString()}
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-lg">
              <Bell className="w-6 h-6 text-yellow-400" />
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-violet-500/20 rounded-2xl px-6 py-4 shadow-lg">

              <p className="text-sm text-slate-400">
                Employee ID
              </p>

              <h2 className="font-bold text-xl">
                EMP-1024
              </h2>

            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all">

            <p className="text-violet-100 mb-3">
              Working Hours
            </p>

            <h2 className="text-5xl font-bold">
              {todayHours} hrs
            </h2>

          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all">

            <p className="text-cyan-100 mb-3">
              Attendance
            </p>

            <h2 className="text-5xl font-bold">
              {attendance.length}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all">

            <p className="text-green-100 mb-3">
              Tasks Completed
            </p>

            <h2 className="text-5xl font-bold">
              24
            </h2>

          </div>

          <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all">

            <p className="text-rose-100 mb-3">
              Status
            </p>

            <div className="flex items-center gap-2 mt-4">

              <CheckCircle2
                className={
                  status === "Working"
                    ? "text-green-300"
                    : "text-red-300"
                }
              />

              <span className="text-2xl font-bold">
                {status}
              </span>

            </div>

          </div>

        </div>

        {/* Attendance Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-4">
              Check In
            </h2>

            <p className="text-green-100 mb-8 text-lg">
              Start your workday attendance.
            </p>

            <button
              onClick={checkIn}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all"
            >
              Start Work
            </button>

          </div>

          <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-4">
              Check Out
            </h2>

            <p className="text-red-100 mb-8 text-lg">
              End your workday attendance.
            </p>

            <button
              onClick={checkOut}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all"
            >
              End Work
            </button>

          </div>

        </div>

        {/* Attendance Table */}

        <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            Attendance History
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="text-left border-b border-slate-700 text-slate-400">

                  <th className="pb-4">
                    Date
                  </th>

                  <th className="pb-4">
                    Check In
                  </th>

                  <th className="pb-4">
                    Check Out
                  </th>

                  <th className="pb-4">
                    Hours
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendance.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-slate-800"
                  >

                    <td className="py-4">
                      {item.date}
                    </td>

                    <td>
                      {item.checkIn
                        ? new Date(
                            item.checkIn
                          ).toLocaleTimeString()
                        : "--"}
                    </td>

                    <td>
                      {item.checkOut
                        ? new Date(
                            item.checkOut
                          ).toLocaleTimeString()
                        : "--"}
                    </td>

                    <td>
                      {item.totalHours || "--"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}