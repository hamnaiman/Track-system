import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMReminderReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicant, setApplicant] = useState("");

  const [customers, setCustomers] = useState([]);
  const [results, setResults] = useState([]);

  /* ================= LOAD CUSTOMERS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => toast.error("Failed to load applicants"));
  }, []);

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast.warning("Reminder date range is required");
      return;
    }

    try {
      const res = await api.post("/tm-reminder-report", {
        startDate,
        endDate,
        applicant,
      });

      setResults(res.data.data || []);
      toast.success("Reminder report generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate report");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Reminder Report
        </h2>
        <p className="text-sm text-gray-500">
          Generate trademark reminder reports by date and client
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Reminder Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Reminder End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              Applicant
            </label>
            <select
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Clients</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-right mt-2">
            <button
              onClick={generateReport}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-8 py-3 rounded-lg font-semibold"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>#</Th>
              <Th>Application #</Th>
              <Th>Trademark</Th>
              <Th>Client</Th>
              <Th>Reminder Date</Th>
              <Th>Remark</Th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No reminders found
                </td>
              </tr>
            ) : (
              results.map((app, i) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <Td>{i + 1}</Td>
                  <Td>{app.applicationNumber}</Td>
                  <Td>{app.trademark}</Td>
                  <Td>{app.client?.customerName}</Td>
                  <Td>
                    {new Date(app.reminderDate).toLocaleDateString()}
                  </Td>
                  <Td>{app.reminderRemark}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TMReminderReport;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-3 border text-left font-semibold text-gray-700">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-3 border text-gray-700">
    {children}
  </td>
);
