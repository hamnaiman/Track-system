import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const TMFormsSetup = () => {
  const [form, setForm] = useState({
    formNumber: "",
    description: "",
    priority: "",
  });

  const [tmForms, setTMForms] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Forms
  const fetchForms = async () => {
    try {
      const res = await api.get("/tm-forms");
      setTMForms(res.data || []);
    } catch {
      toast.error("Failed to load TM Forms");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // ✅ Input Handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.formNumber || !form.description || !form.priority) {
      toast.warning("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/tm-forms/${editId}`, form);
        toast.success("TM Form Updated Successfully");
      } else {
        await api.post("/tm-forms", form);
        toast.success("TM Form Added Successfully");
      }

      setForm({ formNumber: "", description: "", priority: "" });
      setEditId(null);
      fetchForms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setForm({
      formNumber: item.formNumber,
      description: item.description,
      priority: item.priority,
    });
    setEditId(item._id);
  };

  // ✅ Delete with Toast Confirm
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this TM Form?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/tm-forms/${id}`);
                  toast.success("TM Form Deleted Successfully");
                  fetchForms();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">TM Forms Setup</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">

        <input
          type="text"
          name="formNumber"
          value={form.formNumber}
          onChange={handleChange}
          placeholder="Form Number"
          className="p-3 border rounded"
          required
        />

        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 border rounded"
          required
        />

        <input
          type="number"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          placeholder="Priority"
          min="1"
          className="p-3 border rounded"
          required
        />

        <div className="col-span-3 flex gap-4">
          <button
            disabled={loading}
            className="bg-gray-800 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Processing..." : editId ? "Update" : "Save"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ formNumber: "", description: "", priority: "" });
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Form No</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {tmForms.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No Forms Found
              </td>
            </tr>
          ) : (
            tmForms.map((item, index) => (
              <tr key={item._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.formNumber}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-center">{item.priority}</td>

                <td
                  onClick={() => handleEdit(item)}
                  className="border p-2 text-blue-600 cursor-pointer"
                >
                  Edit
                </td>

                <td
                  onClick={() => handleDelete(item._id)}
                  className="border p-2 text-red-600 cursor-pointer"
                >
                  Delete
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TMFormsSetup;
