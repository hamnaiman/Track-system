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

  // FETCH TM FORMS
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

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE / UPDATE
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

  // EDIT
  const handleEdit = (item) => {
    setForm({
      formNumber: item.formNumber,
      description: item.description,
      priority: item.priority,
    });
    setEditId(item._id);
  };

  // DELETE WITH CONFIRM
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this TM Form?
          </p>

          <div className="flex justify-end gap-3">
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
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes, Delete
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
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Forms Setup
        </h2>
        <p className="text-sm text-gray-500">
          Manage trademark forms and their priorities
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="formNumber"
            value={form.formNumber}
            onChange={handleChange}
            placeholder="Form Number"
            className="px-4 py-3 rounded-lg bg-gray-100 border
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="px-4 py-3 rounded-lg bg-gray-100 border
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <input
            type="number"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            placeholder="Priority"
            min="1"
            className="px-4 py-3 rounded-lg bg-gray-100 border
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div className="sm:col-span-2 lg:col-span-3 flex gap-3 mt-2">
            <button
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-6 py-3 rounded-lg font-semibold
                         transition disabled:opacity-60"
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
                className="bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-4">
          TM Forms List
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th>#</Th>
                <Th>Form No</Th>
                <Th>Description</Th>
                <Th className="text-center">Priority</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </tr>
            </thead>

            <tbody>
              {tmForms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No Forms Found
                  </td>
                </tr>
              ) : (
                tmForms.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <Td>{index + 1}</Td>
                    <Td>{item.formNumber}</Td>
                    <Td>{item.description}</Td>
                    <Td className="text-center">{item.priority}</Td>

                    <Td
                      onClick={() => handleEdit(item)}
                      className="text-[#3E4A8A] cursor-pointer font-medium"
                    >
                      Edit
                    </Td>

                    <Td
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 cursor-pointer font-medium"
                    >
                      Delete
                    </Td>
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

export default TMFormsSetup;

/* ===== UI HELPERS ===== */

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
