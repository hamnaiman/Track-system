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
    reminderRemark: "",
  });

  const [applications, setApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchApplications();
    fetchCustomers();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data.data || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
    } catch {
      toast.error("Failed to load customers");
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleClass = (num) => {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.includes(num)
        ? prev.classes.filter((c) => c !== num)
        : [...prev.classes, num],
    }));
  };

  /* ================= SAVE / UPDATE ================= */
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
    if (!payload.takeOverDate) delete payload.takeOverDate;
    if (!payload.reminderDate) delete payload.reminderDate;
    if (!payload.status) delete payload.status;

    try {
      if (editId) {
        await api.put(`/applications/${editId}`, payload);
        toast.success("Application Updated");
      } else {
        await api.post("/applications", payload);
        toast.success("Application Saved");
      }

      resetForm();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
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
      reminderRemark: "",
    });
    setEditId(null);
  };

  /* ================= EDIT ================= */
  const handleEdit = (app) => {
    setForm({
      ...app,
      client: app.client?._id || "",
      status: app.status?._id || "",
    });
    setEditId(app._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this application?
          </p>
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Application Details
        </h2>
        <p className="text-sm text-gray-500">
          Register and manage trademark applications
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input name="applicationNumber" value={form.applicationNumber} onChange={handleChange} placeholder="Application Number" required />
          <Input name="fileNumber" value={form.fileNumber} onChange={handleChange} placeholder="File Number" required />
          <Input type="date" name="dateOfFiling" value={form.dateOfFiling} onChange={handleChange} required />
          <Input type="date" name="takeOverDate" value={form.takeOverDate} onChange={handleChange} />

          <Input name="periodOfUse" value={form.periodOfUse} onChange={handleChange} placeholder="Period of Use" />

          <Select name="wordOrLabel" value={form.wordOrLabel} onChange={handleChange}>
            <option value="Word">Word</option>
            <option value="Label">Label</option>
          </Select>

          {/* CLASSES */}
          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-[#3E4A8A] mb-2">
              Trademark Classes
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
              {[...Array(45)].map((_, i) => {
                const num = i + 1;
                return (
                  <label
                    key={num}
                    className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                  >
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
          </div>

          <Input name="trademark" value={form.trademark} onChange={handleChange} placeholder="Trademark" required />
          <Textarea name="goods" value={form.goods} onChange={handleChange} placeholder="Goods / Services" className="md:col-span-2" />

          <Select name="client" value={form.client} onChange={handleChange} required>
            <option value="">Select Client</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.customerName}
              </option>
            ))}
          </Select>

          <Select name="showCauseReceived" value={form.showCauseReceived} onChange={handleChange}>
            <option value="No">Show Cause: No</option>
            <option value="Yes">Show Cause: Yes</option>
          </Select>

          <Input name="conflictingTrademark" value={form.conflictingTrademark} onChange={handleChange} placeholder="Conflicting Trademark" />
          <Input name="tmNumber" value={form.tmNumber} onChange={handleChange} placeholder="TM Number" />
          <Input type="date" name="reminderDate" value={form.reminderDate} onChange={handleChange} />
          <Input name="reminderRemark" value={form.reminderRemark} onChange={handleChange} placeholder="Reminder Remark" />

          <div className="md:col-span-2 text-right mt-6">
            <button className="bg-[#3E4A8A] hover:bg-[#2f3970] text-white px-8 py-3 rounded-lg font-semibold transition">
              {editId ? "Update Application" : "Save Application"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-4">
          Applications List
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th>App #</Th>
                <Th>Trademark</Th>
                <Th>Client</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <Td>{app.applicationNumber}</Td>
                  <Td>{app.trademark}</Td>
                  <Td>{app.client?.customerName}</Td>
                  <Td
                    className="text-[#3E4A8A] cursor-pointer font-medium"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </Td>
                  <Td
                    className="text-red-600 cursor-pointer font-medium"
                    onClick={() => handleDelete(app._id)}
                  >
                    Delete
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ApplicationDetails;

/* ================= UI HELPERS ================= */

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    {...props}
    className={`px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  >
    {children}
  </select>
);

const Th = ({ children }) => (
  <th className="p-3 border text-left font-semibold">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>
    {children}
  </td>
);
