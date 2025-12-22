import React, { useState } from "react";
import api from "../../../api/api";

const OppositionReminderReport = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "Pending"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateReport = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;

      const res = await api.get(
        "/opposition/reminders/report",
        { params }
      );

      setResults(res.data.data || []);
    } catch (err) {
      console.error("Reminder Report Error:", err);
      alert("Failed to load reminder report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Opposition Reminder Report
      </h1>

      {/* FILTER CARD */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Reminder Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Reminder Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Reminder End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition text-sm"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Results ({results.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-3 py-2 text-left">Opposition #</th>
                <th className="border px-3 py-2 text-left">Reminder Date</th>
                <th className="border px-3 py-2 text-left">Task</th>
                <th className="border px-3 py-2 text-left">Status</th>
                <th className="border px-3 py-2 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No reminders found
                  </td>
                </tr>
              ) : (
                results.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {row.oppositionNumber}
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(row.reminderDate).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">
                      {row.taskDescription}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          row.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OppositionReminderReport;
