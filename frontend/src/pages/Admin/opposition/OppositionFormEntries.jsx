import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionFormEntries = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    oppositionNumber: "",
    formNumber: "",
    filingDate: "",
    remarks: ""
  });

  /* ================= FETCH GRID ================= */
  const fetchEntries = async () => {
    if (!applicationNumber) {
      toast.warn("Enter application number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/opposition/forms?applicationNumber=${applicationNumber}`
      );
      setEntries(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ENTRY ================= */
  const handleAdd = async () => {
    const { oppositionNumber, formNumber, filingDate } = form;

    if (!oppositionNumber || !formNumber || !filingDate) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      await api.post("/opposition/forms", {
        applicationNumber,
        ...form
      });

      toast.success("Form entry added");
      setForm({
        oppositionNumber: "",
        formNumber: "",
        filingDate: "",
        remarks: ""
      });

      fetchEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await api.delete(`/opposition/forms/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-xl font-semibold text-gray-800 mb-1">
        Opposition Form Entries
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Maintain records of opposition forms submitted against a specific application.
      </p>

      {/* SEARCH */}
      <div className="bg-white border rounded p-4 mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Application #
        </label>
        <input
          type="text"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          className="border rounded px-3 py-1 text-sm w-48"
        />
        <button
          onClick={fetchEntries}
          className="bg-gray-700 text-white px-4 py-1 rounded text-sm"
        >
          Search
        </button>
      </div>

      {/* FORM ENTRY */}
      <div className="bg-white border rounded p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Opposition Form Entry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            placeholder="Opposition #"
            value={form.oppositionNumber}
            onChange={(e) =>
              setForm({ ...form, oppositionNumber: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            placeholder="Form #"
            value={form.formNumber}
            onChange={(e) =>
              setForm({ ...form, formNumber: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={form.filingDate}
            onChange={(e) =>
              setForm({ ...form, filingDate: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleAdd}
          className="bg-gray-700 text-white px-6 py-2 rounded text-sm"
        >
          Update
        </button>
      </div>

      {/* GRID */}
      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Form #</th>
              <th className="p-2 text-left">Filing Date</th>
              <th className="p-2 text-left">Remarks</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No entries found
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="p-2">{e.formNumber}</td>
                  <td className="p-2">
                    {new Date(e.filingDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">{e.remarks || "-"}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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

export default OppositionFormEntries;
