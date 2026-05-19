import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  const [data, setData] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/all-attendance"
      );

      setData(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-violet-600 rounded-3xl p-8">
          <h2 className="text-2xl mb-3">
            Total Records
          </h2>

          <h1 className="text-5xl font-bold">
            {data.length}
          </h1>
        </div>

        <div className="bg-cyan-600 rounded-3xl p-8">
          <h2 className="text-2xl mb-3">
            Employees
          </h2>

          <h1 className="text-5xl font-bold">
            {
              [...new Set(
                data.map(
                  item =>
                    item.userId?._id
                )
              )].length
            }
          </h1>
        </div>

        <div className="bg-emerald-600 rounded-3xl p-8">
          <h2 className="text-2xl mb-3">
            Active Today
          </h2>

          <h1 className="text-5xl font-bold">
            {
              data.filter(
                item =>
                  !item.checkOut
              ).length
            }
          </h1>
        </div>

      </div>

      <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-slate-700 text-slate-400">

              <th className="pb-4">
                Employee
              </th>

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

            {data.map((item) => (

              <tr
                key={item._id}
                className="border-b border-slate-800"
              >

                <td className="py-4">
                  {item.userId?.name}
                </td>

                <td>
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
  );
}