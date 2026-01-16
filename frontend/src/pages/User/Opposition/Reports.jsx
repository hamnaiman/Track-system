import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserOppositionReport = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    oppositionNumber: "",
    trademark: "",
    oppositionType: "",
    status: "",
    journalNo: "",
    startDate: "",
    endDate: ""
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/reports/opposition/user", {
        params: filters
      });
      setResults(res.data?.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to fetch opposition reports";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3E4A8A]">
          Opposition Report
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your opposition filings
        </p>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="bg-white rounded-xl p-6 border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <input
            name="oppositionNumber"
            value={filters.oppositionNumber}
            onChange={handleChange}
            placeholder="Opposition Number"
            className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
          />

          <input
            name="trademark"
            value={filters.trademark}
            onChange={handleChange}
            placeholder="Trademark"
            className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
          />

          <select
            name="oppositionType"
            value={filters.oppositionType}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">Opposition Type</option>
            <option value="Applicant">Applicant</option>
            <option value="Opponent">Opponent</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Decided">Decided</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>

          <input
            name="journalNo"
            value={filters.journalNo}
            onChange={handleChange}
            placeholder="Journal Number"
            className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
          />

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={generateReport}
            className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F4F6F8] text-[#3E4A8A]">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Opposition No</th>
              <th className="p-3 text-left">Trademark</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Journal</th>
              <th className="p-3 text-left">Opposition Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              results.map((row, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-[#F9FAFB]"
                >
                  <td className="p-3">{row.srNo || index + 1}</td>
                  <td className="p-3">{row.oppositionNumber}</td>
                  <td className="p-3">{row.trademark}</td>
                  <td className="p-3">{row.oppositionType}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.journalNo}</td>
                  <td className="p-3">
                    {row.oppositionDate
                      ? new Date(row.oppositionDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* ===== VIEW DETAILS ===== */}
                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/user/opposition/details?oppositionNumber=${row.oppositionNumber}`
                        )
                      }
                      className="text-[#3E4A8A] font-medium text-sm hover:underline"
                    >
                      View Details
                    </button>
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
