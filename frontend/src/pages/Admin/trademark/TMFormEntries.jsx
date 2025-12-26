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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    api.get("/applications").then(res => {
      setApplications(res.data.data || []);
    });

    api.get("/tm-forms").then(res => {
      setTMForms(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (form.applicationId) {
      api.get(`/tm-form-entries/${form.applicationId}`).then(res => {
        setEntries(res.data || []);
      });
    }
  }, [form.applicationId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.applicationId || !form.tmForm || !form.fillingDate) {
      toast.warning("All required fields must be filled");
      return;
    }

    try {
      if (editId) {
        await api.put(`/tm-form-entries/${editId}`, form);
        toast.success("TM Form Entry Updated");
      } else {
        await api.post("/tm-form-entries", form);
        toast.success("TM Form Entry Saved");
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

  const handleEdit = (entry) => {
    setForm({
      applicationId: entry.applicationId,
      tmForm: entry.tmForm,
      fillingDate: entry.fillingDate.slice(0, 10),
      remark: entry.remark
    });
    setEditId(entry._id);
  };

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this TM Form entry?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/tm-form-entries/${id}`);
                toast.success("Entry Deleted");

                const res = await api.get(
                  `/tm-form-entries/${form.applicationId}`
                );
                setEntries(res.data || []);

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
          TM Form Entries
        </h2>
        <p className="text-sm text-gray-500">
          Record and manage TM form filing details
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Select
            name="applicationId"
            value={form.applicationId}
            onChange={handleChange}
            required
          >
            <option value="">Select Application</option>
            {applications.map(app => (
              <option key={app._id} value={app._id}>
                {app.applicationNumber} — {app.trademark}
              </option>
            ))}
          </Select>

          <Select
            name="tmForm"
            value={form.tmForm}
            onChange={handleChange}
            required
          >
            <option value="">Select TM Form</option>
            {tmForms.map(f => (
              <option key={f._id} value={f._id}>
                {f.formNumber}
              </option>
            ))}
          </Select>

          <Input
            type="date"
            name="fillingDate"
            value={form.fillingDate}
            onChange={handleChange}
            required
          />

          <Input
            name="remark"
            placeholder="Remark (optional)"
            value={form.remark}
            onChange={handleChange}
          />

          <div className="md:col-span-2 text-right mt-4">
            <button className="bg-[#3E4A8A] hover:bg-[#2f3970]
                               text-white px-8 py-3 rounded-lg font-semibold">
              {editId ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Form</Th>
              <Th>Filing Date</Th>
              <Th>Remark</Th>
              <Th className="text-center">Edit</Th>
              <Th className="text-center">Delete</Th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No entries found
                </td>
              </tr>
            ) : (
              entries.map(e => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <Td>{e.tmForm?.formNumber}</Td>
                  <Td>{e.fillingDate?.slice(0, 10)}</Td>
                  <Td>{e.remark}</Td>

                  <Td className="text-center">
                    <button
                      onClick={() => handleEdit(e)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                  </Td>

                  <Td className="text-center">
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TMFormEntries;

/* ================= UI HELPERS ================= */
const Input = (props) => (
  <input
    {...props}
    className="px-4 py-3 rounded-lg bg-gray-100 border
               focus:outline-none focus:ring-2 focus:ring-blue-200"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="px-4 py-3 rounded-lg bg-gray-100 border
               focus:outline-none focus:ring-2 focus:ring-blue-200"
  >
    {children}
  </select>
);

const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left font-semibold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>
    {children}
  </td>
);
