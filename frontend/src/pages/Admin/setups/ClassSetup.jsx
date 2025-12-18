import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const ClassSetup = () => {
  const [form, setForm] = useState({
    classNumber: "",
    description: "",
  });

  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load Classes
  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data || []);
    } catch (err) {
      toast.error("Unable to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ✅ Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CREATE or UPDATE CLASS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classNumber || !form.description.trim()) {
      toast.warning("Class number & description are required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // UPDATE
        await api.put(`/classes/${editingId}`, form);
        toast.success("Class Updated Successfully");
      } else {
        // CREATE
        await api.post("/classes", form);
        toast.success("Class Added Successfully");
      }

      setForm({ classNumber: "", description: "" });
      setEditingId(null);
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT
  const handleEdit = (cls) => {
    setForm({
      classNumber: cls.classNumber,
      description: cls.description,
    });
    setEditingId(cls._id);
  };

  // ✅ ✅ ✅ PROFESSIONAL DELETE WITH TOAST CONFIRMATION
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this Class?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/classes/${id}`);
                  toast.success("Class Deleted Successfully");
                  fetchClasses();
                } catch (err) {
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
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Class Setup</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
        <input
          type="number"
          name="classNumber"
          value={form.classNumber}
          onChange={handleChange}
          placeholder="Class Number"
          className="p-3 border rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 border rounded h-32"
          required
        />

        <div className="flex gap-4 mt-2">
          <button
            disabled={loading}
            className="bg-gray-800 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Processing..." : editingId ? "Update" : "Save"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ classNumber: "", description: "" });
              }}
              className="px-6 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-2 w-16">S.No</th>
            <th className="border p-2 w-24">Class</th>
            <th className="border p-2">Description</th>
            <th className="border p-2 w-16">Edit</th>
            <th className="border p-2 w-20">Delete</th>
          </tr>
        </thead>

        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No Classes Found
              </td>
            </tr>
          ) : (
            classes.map((cls, index) => (
              <tr key={cls._id} className="border">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{cls.classNumber}</td>
                <td className="border p-2">{cls.description}</td>

                <td
                  className="border p-2 text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleEdit(cls)}
                >
                  Edit
                </td>

                <td
                  className="border p-2 text-red-600 cursor-pointer hover:underline"
                  onClick={() => handleDelete(cls._id)}
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

export default ClassSetup;
