import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const [form, setForm] = useState({
    applicationNumber: "",
    fileNumber: "",
    dateOfFiling: "",
    takeOverDate: "",
    periodOfUse: "",
    wordOrLabel: "Word",
    classes: [],
    trademark: "",
    goods: "",
    client: "",
    showCauseReceived: "No",
    conflictingTrademark: "",
    tmNumber: "",
    status: "",
    reminderDate: "",
    reminderRemark: ""
  });

  const [applications, setApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);

  // ===========================
  // FETCH DATA
  // ===========================
  useEffect(() => {
    fetchApplications();
    fetchCustomers();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load customers");
    }
  };

  // ===========================
  // HANDLE INPUT
  // ===========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleClass = (num) => {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.includes(num)
        ? prev.classes.filter((c) => c !== num)
        : [...prev.classes, num]
    }));
  };

  // ===========================
  // SAVE / UPDATE
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.classes.length === 0) {
      toast.error("Select at least one class");
      return;
    }

    if (!form.client) {
      toast.error("Client is required");
      return;
    }

    const payload = { ...form };

    // ❌ remove empty optional ObjectId / Date fields
    if (!payload.status) delete payload.status;
    if (!payload.takeOverDate) delete payload.takeOverDate;
    if (!payload.reminderDate) delete payload.reminderDate;

    try {
      if (editId) {
        await api.put(`/applications/${editId}`, payload);
        toast.success("✅ Application Updated");
      } else {
        await api.post("/applications", payload);
        toast.success("✅ Application Saved");
      }

      resetForm();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Application Failed");
    }
  };

  const resetForm = () => {
    setForm({
      applicationNumber: "",
      fileNumber: "",
      dateOfFiling: "",
      takeOverDate: "",
      periodOfUse: "",
      wordOrLabel: "Word",
      classes: [],
      trademark: "",
      goods: "",
      client: "",
      showCauseReceived: "No",
      conflictingTrademark: "",
      tmNumber: "",
      status: "",
      reminderDate: "",
      reminderRemark: ""
    });
    setEditId(null);
  };

  // ===========================
  // EDIT
  // ===========================
  const handleEdit = (app) => {
    setForm({
      ...app,
      client: app.client?._id || "",
      status: app.status?._id || ""
    });
    setEditId(app._id);
  };

  // ===========================
  // DELETE
  // ===========================
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-2">Delete this application?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/applications/${id}`);
                toast.success("Deleted Successfully");
                fetchApplications();
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Application Details</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="applicationNumber"
          value={form.applicationNumber}
          onChange={handleChange}
          placeholder="Application Number"
          className="p-2 border rounded"
          required
        />

        <input
          name="fileNumber"
          value={form.fileNumber}
          onChange={handleChange}
          placeholder="File Number"
          className="p-2 border rounded"
          required
        />

        <input
          type="date"
          name="dateOfFiling"
          value={form.dateOfFiling}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <input
          type="date"
          name="takeOverDate"
          value={form.takeOverDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="periodOfUse"
          value={form.periodOfUse}
          onChange={handleChange}
          placeholder="Period of Use"
          className="p-2 border rounded"
        />

        <select
          name="wordOrLabel"
          value={form.wordOrLabel}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Word">Word</option>
          <option value="Label">Label</option>
        </select>

        {/* CLASSES */}
        <div className="col-span-2 grid grid-cols-9 gap-2">
          {[...Array(45)].map((_, i) => {
            const num = i + 1;
            return (
              <label key={num} className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={form.classes.includes(num)}
                  onChange={() => toggleClass(num)}
                />
                {num}
              </label>
            );
          })}
        </div>

        <input
          name="trademark"
          value={form.trademark}
          onChange={handleChange}
          placeholder="Trademark"
          className="p-2 border rounded"
          required
        />

        <textarea
          name="goods"
          value={form.goods}
          onChange={handleChange}
          placeholder="Goods"
          className="p-2 border rounded col-span-2"
        />

        <select
          name="client"
          value={form.client}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Client</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.customerName}
            </option>
          ))}
        </select>

        <select
          name="showCauseReceived"
          value={form.showCauseReceived}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <input
          name="conflictingTrademark"
          value={form.conflictingTrademark}
          onChange={handleChange}
          placeholder="Conflicting Trademark"
          className="p-2 border rounded"
        />

        <input
          name="tmNumber"
          value={form.tmNumber}
          onChange={handleChange}
          placeholder="TM Number"
          className="p-2 border rounded"
        />

        <input
          type="date"
          name="reminderDate"
          value={form.reminderDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="reminderRemark"
          value={form.reminderRemark}
          onChange={handleChange}
          placeholder="Reminder Remark"
          className="p-2 border rounded"
        />

        <div className="col-span-2 text-right mt-6">
          <button className="bg-gray-800 text-white px-8 py-2 rounded">
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <table className="w-full mt-10 border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">App #</th>
            <th className="border p-2">Trademark</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="border p-2">{app.applicationNumber}</td>
              <td className="border p-2">{app.trademark}</td>
              <td className="border p-2">{app.client?.customerName}</td>
              <td
                className="border p-2 text-blue-600 cursor-pointer"
                onClick={() => handleEdit(app)}
              >
                Edit
              </td>
              <td
                className="border p-2 text-red-600 cursor-pointer"
                onClick={() => handleDelete(app._id)}
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

export default ApplicationDetails;
