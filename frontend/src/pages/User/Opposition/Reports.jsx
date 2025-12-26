import React, { useState } from "react";
import api from "../../../api/api";

/* ===== Permission helper ===== */
const hasPermission = (perm) => {
  try {
    const permissions =
      JSON.parse(localStorage.getItem("permissions")) || [];
    return permissions.includes(perm);
  } catch {
    return false;
  }
};

const UserOppositionReport = () => {
  const canView = hasPermission("view");

  const [filters, setFilters] = useState({
    oppositionNumber: "",
    trademark: "",
    oppositionType: "",
    status: "",
    trademarkJournalNumber: "",
    startDate: "",
    endDate: ""
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===== Security UX ===== */
  if (!canView) {
    return (
      <div className="p-6 text-sm text-red-600">
        You are not authorized to view Opposition Reports.
      </div>
    );
  }

  /* ===== Generate Report ===== */
  const generateReport = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/opposition-report", {
        params: filters
      });

      setResults(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate report"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===== Handle Change ===== */
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6 bg-gray-100 space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Opposition Report
        </h1>
        <p className="text-sm text-gray-500">
          Generate and view opposition related reports
        </p>
      </div>

      {/* ===== FILTER PANEL ===== */}
      <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">

        <input
          name="oppositionNumber"
          value={filters.oppositionNumber}
          onChange={handleChange}
          placeholder="Opposition Number"
          className="border px-3 py-2 text-sm rounded"
        />

        <input
          name="trademark"
          value={filters.trademark}
          onChange={handleChange}
          placeholder="Trademark"
          className="border px-3 py-2 text-sm rounded"
        />

        <select
          name="oppositionType"
          value={filters.oppositionType}
          onChange={handleChange}
          className="border px-3 py-2 text-sm rounded"
        >
          <option value="">Opposition Type</option>
          <option value="Applicant">Applicant</option>
          <option value="Opponent">Opponent</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border px-3 py-2 text-sm rounded"
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Decided">Decided</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          name="trademarkJournalNumber"
          value={filters.trademarkJournalNumber}
          onChange={handleChange}
          placeholder="Journal Number"
          className="border px-3 py-2 text-sm rounded"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="border px-3 py-2 text-sm rounded"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="border px-3 py-2 text-sm rounded"
        />

        <div className="flex items-end md:col-span-4">
          <button
            onClick={generateReport}
            className="bg-gray-700 text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition"
          >
            Generate Report
          </button>
        </div>

      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Opposition No</th>
              <th className="p-3 text-left">Trademark</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Journal</th>
              <th className="p-3 text-left">Filing Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Generating report...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              results.map((row) => (
                <tr
                  key={row._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{row.oppositionNumber}</td>
                  <td className="p-3">{row.trademark}</td>
                  <td className="p-3">{row.oppositionType}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.trademarkJournalNumber || "-"}</td>
                  <td className="p-3">
                    {row.filingDate
                      ? new Date(row.filingDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserOppositionReport;
