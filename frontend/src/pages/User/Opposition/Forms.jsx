import React, { useState } from "react";
import api from "../../../api/api";
import { hasPermission } from "../../../utils/hasPermission";

const UserOppositionFormEntries = () => {
  const canView = hasPermission("view");
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

  /* ========== SECURITY UX ========= */
  if (!canView) {
    return (
      <div className="p-6 text-sm text-red-600">
        You are not authorized to view Opposition Form Entries.
      </div>
    );
  }

  /* ========== FETCH ========= */
  const fetchEntries = async () => {
    if (!applicationNumber) return;

    setLoading(true);
    try {
      const res = await api.get("/opposition-form-entries", {
        params: { applicationNumber }
      });
      setEntries(res.data || []);
    } catch (err) {
      setError("Failed to load form entries");
    } finally {
      setLoading(false);
    }
  };

  /* ========== ADD ========= */
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
    <div className="p-6 bg-gray-100 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Opposition Form Entries
        </h1>
        <p className="text-sm text-gray-500">
          View opposition related form filings
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 border rounded flex gap-3">
        <input
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          placeholder="Application Number"
          className="border px-3 py-2 rounded text-sm w-64"
        />
        <button
          onClick={fetchEntries}
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
        >
          Search
        </button>
      </div>

      {/* ADD FORM (ONLY IF ALLOWED) */}
      {canAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white border rounded p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            placeholder="Opposition No"
            value={form.oppositionNumber}
            onChange={(e) =>
              setForm({ ...form, oppositionNumber: e.target.value })
            }
            className="border px-3 py-2 text-sm rounded"
          />
          <input
            placeholder="Form No"
            value={form.formNumber}
            onChange={(e) =>
              setForm({ ...form, formNumber: e.target.value })
            }
            className="border px-3 py-2 text-sm rounded"
          />
          <input
            type="date"
            value={form.filingDate}
            onChange={(e) =>
              setForm({ ...form, filingDate: e.target.value })
            }
            className="border px-3 py-2 text-sm rounded"
          />
          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
            className="border px-3 py-2 text-sm rounded"
          />
          <button className="bg-gray-700 text-white py-2 rounded text-sm md:col-span-4">
            Add Entry
          </button>
        </form>
      )}

      {/* GRID */}
      <div className="bg-white border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Form</th>
              <th className="p-3">Opposition</th>
              <th className="p-3">Filing Date</th>
              <th className="p-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id} className="border-t">
                <td className="p-3">{e.formNumber}</td>
                <td className="p-3">{e.oppositionNumber}</td>
                <td className="p-3">
                  {new Date(e.filingDate).toLocaleDateString()}
                </td>
                <td className="p-3">{e.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};

export default UserOppositionFormEntries;
