import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionReminderReport = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: ""
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  /* LOAD APPLICANTS (CUSTOMERS) */
  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await api.get("/customers");
        setClients(res.data?.data || []);
      } catch {
        toast.error("Failed to load applicants");
      }
    };
    loadClients();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateReport = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/opposition/reminders/report",
        {
          params: filters
        }
      );

      setResults(res.data?.data || []);
    } catch {
      toast.error("Failed to load reminder report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-[#3E4A8A]">
            Opposition Reminder Report
          </h1>
          <p className="text-sm text-gray-500">
            Shows pending opposition work within selected reminder dates
          </p>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            <div>
              <label className="label">Reminder Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Reminder End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Applicant</label>
              <select
                name="clientId"
                value={filters.clientId}
                onChange={handleChange}
                className="input"
              >
                <option value="">All Applicants</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-[#3E4A8A] text-white h-10 rounded-lg hover:bg-[#2f3970]"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Opposition #</th>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Reminder Date</th>
                <th className="p-3 text-left">Task Description</th>
                <th className="p-3 text-left">Created On</th>
              </tr>
            </thead>

            <tbody>
              {results.length ? results.map(row => {
                const isOverdue = new Date(row.reminderDate) < new Date();

                return (
                  <tr
                    key={row._id}
                    className={`border-t ${
                      isOverdue ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {row.oppositionNumber}
                    </td>
                    <td className="p-3">
                      {row.applicantName}
                    </td>
                    <td className="p-3">
                      {new Date(row.reminderDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 max-w-lg">
                      {row.taskDescription}
                    </td>
                    <td className="p-3">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No pending reminders found
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

export default OppositionReminderReport;
