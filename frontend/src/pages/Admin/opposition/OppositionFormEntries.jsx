import React, { useState } from "react";
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
    remarks: "",
  });

  /* ================= FETCH GRID ================= */
  const fetchEntries = async () => {
    if (!applicationNumber.trim()) {
      toast.warning("Enter application number");
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
        ...form,
      });

      toast.success("Opposition form entry added");

      setForm({
        oppositionNumber: "",
        formNumber: "",
        filingDate: "",
        remarks: "",
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
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-[70vh] px-4 py-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white border rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Opposition Form Entries
          </h2>
          <p className="text-sm text-gray-500">
            Manage opposition form submissions against an application
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-gray-50 border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Application Number
            </label>
            <input
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter Application Number"
            />
          </div>

          <button
            onClick={fetchEntries}
            className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg hover:bg-[#2f3970]"
          >
            Search
          </button>
        </div>

        {/* FORM ENTRY */}
        <div className="border rounded-xl bg-gray-50 p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Add Opposition Form Entry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              placeholder="Opposition Number"
              value={form.oppositionNumber}
              onChange={(e) =>
                setForm({ ...form, oppositionNumber: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="Form Number"
              value={form.formNumber}
              onChange={(e) =>
                setForm({ ...form, formNumber: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="date"
              value={form.filingDate}
              onChange={(e) =>
                setForm({ ...form, filingDate: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="Remarks (optional)"
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg"
          >
            Save Entry
          </button>
        </div>

        {/* GRID */}
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Form #</th>
                <th className="p-3 text-left">Filing Date</th>
                <th className="p-3 text-left">Remarks</th>
                <th className="p-3 text-center">Action</th>
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
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{e.formNumber}</td>
                    <td className="p-3">
                      {new Date(e.filingDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{e.remarks || "-"}</td>
                    <td className="p-3 text-center">
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
    </div>
  );
};

export default OppositionFormEntries;
