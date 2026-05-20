import {
  Users,
  CalendarDays,
  Clock3,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Admin() {

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const token =
    localStorage.getItem("token");

  useEffect(() => {

    loadAttendance();
    loadLeaves();

  }, []);

  const logout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  const loadAttendance = async () => {

    try {

      const response =
        await axios.get(
          "https://remote-worker-backend.onrender.com/all-attendance",
          {
            headers: {
              Authorization: token,
            },
          }
        );

      setAttendance(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const loadLeaves = async () => {

    try {

      const response =
        await axios.get(
          "https://remote-worker-backend.onrender.com/all-leaves",
          {
            headers: {
              Authorization: token,
            },
          }
        );

      setLeaves(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const approveLeave = async (id) => {

    try {

      await axios.put(
        `https://remote-worker-backend.onrender.com/approve-leave/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Leave Approved");

      loadLeaves();

    } catch (error) {

      console.log(error);
    }
  };

  const rejectLeave = async (id) => {

    try {

      await axios.put(
        `https://remote-worker-backend.onrender.com/reject-leave/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Leave Rejected");

      loadLeaves();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold mb-3">
            Admin Dashboard 👨‍💼
          </h1>

          <p className="text-slate-400 text-lg">
            Employee Management System
          </p>

        </div>

        <button
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold"
        >

          <LogOut className="w-5 h-5" />

          Logout

        </button>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-violet-100 mb-2">
                Total Attendance
              </p>

              <h2 className="text-5xl font-bold">
                {attendance.length}
              </h2>

            </div>

            <Clock3 className="w-14 h-14 text-white" />

          </div>

        </div>

        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-cyan-100 mb-2">
                Total Leaves
              </p>

              <h2 className="text-5xl font-bold">
                {leaves.length}
              </h2>

            </div>

            <CalendarDays className="w-14 h-14 text-white" />

          </div>

        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-green-100 mb-2">
                Employees
              </p>

              <h2 className="text-5xl font-bold">
                {
                  new Set(
                    attendance.map(
                      (a) =>
                        a.userId?._id
                    )
                  ).size
                }
              </h2>

            </div>

            <Users className="w-14 h-14 text-white" />

          </div>

        </div>

        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-red-100 mb-2">
                Absentees
              </p>

              <h2 className="text-5xl font-bold">

                {
                  Math.max(
                    0,
                    leaves.length -
                      new Set(
                        attendance.map(
                          (a) =>
                            a.userId?._id
                        )
                      ).size
                  )
                }

              </h2>

            </div>

            <XCircle className="w-14 h-14 text-white" />

          </div>

        </div>

      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 mb-10 overflow-x-auto">

        <h2 className="text-3xl font-bold mb-6">
          Attendance Records
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-white/10">

              <th className="py-4">
                Employee
              </th>

              <th>
                Check In
              </th>

              <th>
                Check Out
              </th>

              <th>
                Hours
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance.map((item) => (

              <tr
                key={item._id}
                className="border-b border-white/5"
              >

                <td className="py-4">
                  {
                    item.userId?.name
                  }
                </td>

                <td>
                  {item.checkIn
                    ? new Date(
                        item.checkIn
                      ).toLocaleTimeString()
                    : "-"}
                </td>

                <td>
                  {item.checkOut
                    ? new Date(
                        item.checkOut
                      ).toLocaleTimeString()
                    : "-"}
                </td>

                <td>
                  {
                    item.totalHours
                  } hrs
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Leave Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 overflow-x-auto">

        <h2 className="text-3xl font-bold mb-6">
          Leave Requests
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-white/10">

              <th className="py-4">
                Employee
              </th>

              <th>
                Reason
              </th>

              <th>
                From
              </th>

              <th>
                To
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {leaves.map((leave) => (

              <tr
                key={leave._id}
                className="border-b border-white/5"
              >

                <td className="py-4">
                  {
                    leave.userId?.name
                  }
                </td>

                <td>
                  {
                    leave.reason
                  }
                </td>

                <td>
                  {
                    leave.fromDate
                  }
                </td>

                <td>
                  {
                    leave.toDate
                  }
                </td>

                <td>

                  {leave.status ===
                  "Approved" ? (

                    <span className="flex items-center gap-2 text-green-400">

                      <CheckCircle className="w-5 h-5" />

                      Approved

                    </span>

                  ) : leave.status ===
                    "Rejected" ? (

                    <span className="flex items-center gap-2 text-red-400">

                      <XCircle className="w-5 h-5" />

                      Rejected

                    </span>

                  ) : (

                    <span className="text-yellow-400">
                      Pending
                    </span>

                  )}

                </td>

                <td className="py-4 flex gap-3">

                  <button
                    onClick={() =>
                      approveLeave(
                        leave._id
                      )
                    }
                    className="bg-green-600 px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectLeave(
                        leave._id
                      )
                    }
                    className="bg-red-600 px-4 py-2 rounded-xl"
                  >
                    Reject
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Admin;