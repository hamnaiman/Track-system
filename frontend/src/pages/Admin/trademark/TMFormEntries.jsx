import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMFormEntries = () => {
  const [applications, setApplications] = useState([]);
  const [tmForms, setTMForms] = useState([]);
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    applicationId: "",
    tmForm: "",
    fillingDate: "",
    remark: ""
  });

  const [editId, setEditId] = useState(null);

  // ✅ Load Applications & Forms
  useEffect(() => {
    api.get("/applications").then(res => {
      setApplications(res.data.data || []);
    });

    api.get("/tm-forms").then(res => {
      setTMForms(res.data || []);
    });
  }, []);

  // ✅ Load Entries of Selected Application
  useEffect(() => {
    if (form.applicationId) {
      api.get(`/tm-form-entries/${form.applicationId}`).then(res => {
        setEntries(res.data || []);
      });
    }
  }, [form.applicationId]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.applicationId || !form.tmForm || !form.fillingDate) {
      toast.warning("All required fields must be filled");
      return;
    }

    try {
      if (editId) {
        await api.put(`/tm-form-entries/${editId}`, form);
        toast.success("✅ Entry Updated");
      } else {
        await api.post("/tm-form-entries", form);
        toast.success("✅ Entry Saved");
      }

      setForm({
        applicationId: form.applicationId,
        tmForm: "",
        fillingDate: "",
        remark: ""
      });

      setEditId(null);

      const res = await api.get(`/tm-form-entries/${form.applicationId}`);
      setEntries(res.data || []);

    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // ✅ EDIT
  const handleEdit = (entry) => {
    setForm({
      applicationId: entry.applicationId,
      tmForm: entry.tmForm,
      fillingDate: entry.fillingDate.slice(0, 10),
      remark: entry.remark
    });
    setEditId(entry._id);
  };

  // ✅ DELETE WITH CONFIRM TOAST
  const handleDelete = (id) => {
    toast.info(({ closeToast }) => (
      <div>
        <p className="font-semibold mb-2">Delete this entry?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={async () => {
              await api.delete(`/tm-form-entries/${id}`);
              toast.success("Deleted Successfully");

              const res = await api.get(`/tm-form-entries/${form.applicationId}`);
              setEntries(res.data || []);

              closeToast();
            }}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Yes
          </button>
          <button onClick={closeToast} className="bg-gray-300 px-4 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    ), { autoClose: false });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">TM Form Entries</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">

        <select
          name="applicationId"
          value={form.applicationId}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Application</option>
          {applications.map(app => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>

        <select
          name="tmForm"
          value={form.tmForm}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select TM Form</option>
          {tmForms.map(f => (
            <option key={f._id} value={f._id}>
              {f.formNumber}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fillingDate"
          value={form.fillingDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          name="remark"
          value={form.remark}
          onChange={handleChange}
          placeholder="Remark"
          className="p-2 border rounded"
        />

        <div className="col-span-2 text-right mt-4">
          <button className="bg-gray-800 text-white px-8 py-2 rounded">
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Form</th>
            <th className="border p-2">Filling Date</th>
            <th className="border p-2">Remark</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(e => (
            <tr key={e._id}>
              <td className="border p-2">{e.tmForm?.formNumber}</td>
              <td className="border p-2">{e.fillingDate?.slice(0, 10)}</td>
              <td className="border p-2">{e.remark}</td>

              <td
                className="border p-2 text-blue-600 cursor-pointer"
                onClick={() => handleEdit(e)}
              >
                Edit
              </td>

              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => handleDelete(e._id)}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default TMFormEntries;
