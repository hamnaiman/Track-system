import React, { useState } from "react";
import api from "../../../api/api"; // your axios instance
import { toast } from "react-toastify";

const OppositionReport = () => {
  const [filters, setFilters] = useState({
    oppositionNumber: "",
    startDate: "",
    endDate: "",
    oppositionType: "",
    status: "",
    trademarkJournal: "",
    client: "",
    trademark: ""
  });

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/opposition", { params: filters });
      setRecords(res.data.data || []);
    } catch (err) {
      toast.error("Failed to generate opposition report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Opposition Report
      </h1>

      {/* FILTER PANEL */}
      <div className="bg-white border rounded-md shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Basic Search Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            name="oppositionNumber"
            placeholder="Opposition / Rect #"
            className="input"
            value={filters.oppositionNumber}
            onChange={handleChange}
          />

          <input
            type="date"
            name="startDate"
            className="input"
            value={filters.startDate}
            onChange={handleChange}
          />

          <input
            type="date"
            name="endDate"
            className="input"
            value={filters.endDate}
            onChange={handleChange}
          />

          <select
            name="oppositionType"
            className="input"
            value={filters.oppositionType}
            onChange={handleChange}
          >
            <option value="">Select Opposition Type</option>
            <option value="Applicant">Applicant</option>
            <option value="Opponent">Opponent</option>
          </select>

          <select
            name="status"
            className="input"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Decided">Decided</option>
            <option value="Closed">Closed</option>
          </select>

          <input
            type="text"
            name="trademarkJournal"
            placeholder="Trademark Journal #"
            className="input"
            value={filters.trademarkJournal}
            onChange={handleChange}
          />

          <input
            type="text"
            name="client"
            placeholder="Client"
            className="input"
            value={filters.client}
            onChange={handleChange}
          />

          <input
            type="text"
            name="trademark"
            placeholder="Trademark"
            className="input"
            value={filters.trademark}
            onChange={handleChange}
          />

        </div>

        <div className="mt-4 text-right">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* RESULT GRID */}
      <div className="bg-white border rounded-md shadow-sm p-4">

        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Results ({records.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="th">Opposition #</th>
                <th className="th">Type</th>
                <th className="th">Status</th>
                <th className="th">Trademark</th>
                <th className="th">Journal</th>
                <th className="th">Client</th>
                <th className="th">Filing Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="td">{row.oppositionNumber}</td>
                  <td className="td">{row.oppositionType}</td>
                  <td className="td">{row.status}</td>
                  <td className="td">{row.trademark}</td>
                  <td className="td">{row.trademarkJournal}</td>
                  <td className="td">{row.client?.customerName || "-"}</td>
                  <td className="td">
                    {row.filingDate
                      ? new Date(row.filingDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default OppositionReport;
