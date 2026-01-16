import React, { useState } from "react";
import api from "../../../api/api";
import { hasPermission } from "../../../utils/hasPermission";

const UserOppositionFormEntries = () => {
  const canAdd = hasPermission("add");

  const [applicationNumber, setApplicationNumber] = useState("");
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    oppositionNumber: "",
    formNumber: "",
    filingDate: "",
    remarks: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== FETCH ===== */
  const fetchEntries = async () => {
    if (!applicationNumber) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.get("/opposition/forms", {
        params: { applicationNumber }
      });
      setEntries(res.data || []);
    } catch {
      setError("Failed to load form entries");
    } finally {
      setLoading(false);
    }
  };

  /* ===== ADD ===== */
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/opposition-form-entries", {
        applicationNumber,
        ...form
      });

      setForm({
        oppositionNumber: "",
        formNumber: "",
        filingDate: "",
        remarks: ""
      });

      fetchEntries();
    } catch {
      setError("Failed to add form entry");
    }
  };

  return (
    <div className="space-y-8">

      {/* ===== HEADER (same as Report) ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3E4A8A]">
          Opposition Form Entries
        </h1>
        <p className="text-gray-500 mt-1">
          Manage opposition related form filings
        </p>
      </div>

      {/* ===== SEARCH CARD ===== */}
      <div className="bg-white rounded-xl p-6 border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Application Number"
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-80 focus:ring-2 focus:ring-[#3E4A8A]"
          />

          <button
            onClick={fetchEntries}
            className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ===== ADD FORM (SYSTEM STYLE) ===== */}
      {canAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl p-6 border space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <input
              placeholder="Opposition Number"
              value={form.oppositionNumber}
              onChange={(e) =>
                setForm({ ...form, oppositionNumber: e.target.value })
              }
              className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
            />

            <input
              placeholder="Form Number"
              value={form.formNumber}
              onChange={(e) =>
                setForm({ ...form, formNumber: e.target.value })
              }
              className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
            />

            <input
              type="date"
              value={form.filingDate}
              onChange={(e) =>
                setForm({ ...form, filingDate: e.target.value })
              }
              className="border px-3 py-2 rounded-lg text-sm"
            />

            <input
              placeholder="Remarks"
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#3E4A8A]"
            />
          </div>

          <div className="flex justify-end">
            <button className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition">
              Add Entry
            </button>
          </div>
        </form>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ===== TABLE CARD (REPORT STYLE) ===== */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F4F6F8] text-[#3E4A8A]">
            <tr>
              <th className="p-3 text-left">Form No</th>
              <th className="p-3 text-left">Opposition No</th>
              <th className="p-3 text-left">Filing Date</th>
              <th className="p-3 text-left">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr
                  key={e._id}
                  className="border-t hover:bg-[#F9FAFB]"
                >
                  <td className="p-3">{e.formNumber}</td>
                  <td className="p-3">{e.oppositionNumber}</td>
                  <td className="p-3">
                    {e.filingDate
                      ? new Date(e.filingDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3">{e.remarks || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserOppositionFormEntries;
