import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionReport = () => {
  const [filters, setFilters] = useState({
    oppositionNumber: "",
    startDate: "",
    endDate: "",
    oppositionType: "",
    status: "",
    clientId: "",
    trademark: "",
    journalNo: ""
  });

  const [customers, setCustomers] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= FILTER HANDLER ================= */
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ================= GENERATE REPORT ================= */
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/opposition/admin", {
        params: filters
      });
      setRecords(res.data?.data || []);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] p-6 flex justify-center bg-gray-50">
      <div className="w-full max-w-7xl space-y-6">

        {/* ================= HEADER ================= */}
        <div>
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Opposition Report
          </h2>
          <p className="text-sm text-gray-500">
            Search & view opposition records
          </p>
        </div>

        {/* ================= FILTER CARD ================= */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="input"
              placeholder="Opposition Number"
              name="oppositionNumber"
              onChange={handleChange}
            />

            <input
              type="date"
              className="input"
              name="startDate"
              onChange={handleChange}
            />

            <input
              type="date"
              className="input"
              name="endDate"
              onChange={handleChange}
            />

            <select
              className="input"
              name="oppositionType"
              onChange={handleChange}
            >
              <option value="">Opposition Type</option>
              <option value="Applicant">Applicant</option>
              <option value="Opponent">Opponent</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="input"
              name="status"
              onChange={handleChange}
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Decided">Decided</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            <input
              className="input"
              placeholder="Trademark"
              name="trademark"
              onChange={handleChange}
            />

            <input
              className="input"
              placeholder="Journal No"
              name="journalNo"
              onChange={handleChange}
            />

            <select
              className="input"
              name="clientId"
              onChange={handleChange}
            >
              <option value="">Client</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#3E4A8A] text-white px-8 py-2 rounded-lg hover:bg-[#2f3970]"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Opposition No</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Trademark</th>
                <th className="p-3 text-left">Journal No</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Opposition Date</th>
              </tr>
            </thead>

            <tbody>
              {records.length ? records.map(r => (
                <tr key={r.srNo} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.srNo}</td>
                  <td className="p-3">{r.oppositionNumber}</td>
                  <td className="p-3">{r.oppositionType}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.trademark}</td>
                  <td className="p-3">{r.journalNo}</td>
                  <td className="p-3">{r.clientName}</td>
                  <td className="p-3">
                    {new Date(r.oppositionDate).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
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
