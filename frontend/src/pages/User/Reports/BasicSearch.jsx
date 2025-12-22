import React, { useState } from "react";
import api from "../../../api/api";

const BasicSearch = () => {
  const [filters, setFilters] = useState({
    searchBy: "DateOfFiling",
    startDate: "",
    endDate: "",
    trademark: "",
    applicant: "",
    applicationNo: "",
    classFrom: "",
    classTo: "",
    status: "",
    reportType: "summary"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await api.post("/reports/basic-search", filters);
      setResults(res.data.data || []);
    } catch (err) {
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Basic Search Report
        </h2>
        <p className="text-sm text-gray-500">
          Search trademark applications using different filters
        </p>
      </div>

      {/* FILTER BOX */}
      <div className="bg-white border rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="text-sm font-medium">Trademark</label>
          <input
            type="text"
            name="trademark"
            value={filters.trademark}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Application No</label>
          <input
            type="text"
            name="applicationNo"
            value={filters.applicationNo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <input
            type="text"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Report Type</label>
          <select
            name="reportType"
            value={filters.reportType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="summary">Summary</option>
            <option value="details">Details</option>
          </select>
        </div>

      </div>

      {/* SEARCH BUTTON */}
      <div className="mb-6">
        <button
          onClick={handleSearch}
          className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Generate Report
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">Loading report...</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* RESULT TABLE */}
      {!loading && results.length > 0 && (
        <div className="bg-white border rounded shadow-sm overflow-auto">

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Application No</th>
                <th className="border px-3 py-2">Trademark</th>
                <th className="border px-3 py-2">Applicant</th>
                <th className="border px-3 py-2">Date Of Filing</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {app.applicationNumber}
                  </td>
                  <td className="border px-3 py-2">
                    {app.trademark}
                  </td>
                  <td className="border px-3 py-2">
                    {app.client?.customerName || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(app.dateOfFiling).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2">
                    {app.status?.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="text-gray-500 mt-6">
          No records found
        </div>
      )}

    </div>
  );
};

export default BasicSearch;
