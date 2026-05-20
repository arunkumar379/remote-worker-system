import {
  Users,
  CalendarDays,
  Clock3,
  CheckCircle,
  XCircle,
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

  useEffect(() => {

    loadAttendance();
    loadLeaves();

  }, []);

  const loadAttendance = async () => {

    try {

      const response =
        await axios.get(
          "https://remote-worker-backend.onrender.com/all-attendance"
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
          "https://remote-worker-backend.onrender.com/all-leaves"
        );

      setLeaves(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white p-6">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Admin Dashboard 👨‍💼
        </h1>

        <p className="text-slate-400 text-lg">
          Employee Management System
        </p>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

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
                  }{" "}
                  hrs
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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Admin;