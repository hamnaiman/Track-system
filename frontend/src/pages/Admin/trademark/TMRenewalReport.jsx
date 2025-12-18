import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const TMRenewalReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applicant, setApplicant] = useState("");

  const [customers, setCustomers] = useState([]);
  const [results, setResults] = useState([]);

  // -----------------------------
  // ✅ LOAD CUSTOMER LIST
  // -----------------------------
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  // -----------------------------
  // ✅ GENERATE REPORT
  // -----------------------------
  const generateReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Select both Renewal Due From & Renewal Due To");
      return;
    }

    try {
      const res = await api.post("/renewal-report", {
        fromDate,
        toDate,
        applicant,
      });

      setResults(res.data.data || []);
      toast.success("Report generated");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate report");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">TM Renewal Report</h2>

      {/* ----------------------------- */}
      {/* FILTER FORM */}
      {/* ----------------------------- */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div>
          <label className="font-semibold">Renewal Due From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-3 border rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold">Renewal Due To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-3 border rounded w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="font-semibold">Applicant:</label>
          <select
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Client</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.customerName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateReport}
          className="bg-gray-800 text-white px-8 py-2 rounded col-span-2"
        >
          Generate
        </button>
      </div>

      {/* ----------------------------- */}
      {/* RESULT TABLE */}
      {/* ----------------------------- */}
      <table className="w-full border-collapse text-sm mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Application #</th>
            <th className="border p-2">Trademark</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Renewed Upto</th>
            <th className="border p-2">Remark</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, i) =>
            r.entries.map((en, idx) => (
              <tr key={en._id}>
                <td className="border p-2">{i + 1}.{idx + 1}</td>
                <td className="border p-2">{r.application?.applicationNumber}</td>
                <td className="border p-2">{r.application?.trademark}</td>
                <td className="border p-2">{r.application?.client?.customerName}</td>
                <td className="border p-2">
                  {new Date(en.renewedUpto).toLocaleDateString()}
                </td>
                <td className="border p-2">{en.remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TMRenewalReport;
