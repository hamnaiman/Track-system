import React, { useState } from "react";
import api from "../../../api/api";

const ReminderReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const generateReport = async () => {
    if (!fromDate || !toDate) {
      setError("Please select From Date and To Date");
      return;
    }

    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const res = await api.post("/reminder-reports", {
        fromDate,
        toDate,
        applicant: "all" // user side = own data
      });

      setRecords(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate reminder report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Reminder Report
        </h2>
        <p className="text-sm text-gray-500">
          View reminder-based trademark applications
        </p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      {!loading && records.length > 0 && (
        <div className="bg-white border rounded shadow-sm overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Application No</th>
                <th className="border px-3 py-2 text-left">File No</th>
                <th className="border px-3 py-2 text-left">Trademark</th>
                <th className="border px-3 py-2 text-left">Goods</th>
                <th className="border px-3 py-2 text-left">Reminder Date</th>
                <th className="border px-3 py-2 text-left">Remark</th>
              </tr>
            </thead>

            <tbody>
              {records.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {row.applicationNumber}
                  </td>
                  <td className="border px-3 py-2">
                    {row.fileNumber || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {row.trademark}
                  </td>
                  <td className="border px-3 py-2">
                    {row.goods || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(row.reminderDate).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2">
                    {row.reminderRemark || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && records.length === 0 && !error && (
        <div className="text-gray-500 text-center py-8">
          No reminder records found for selected dates
        </div>
      )}

    </div>
  );
};

export default ReminderReport;
