import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const FileStatusSetup = () => {
  const [description, setDescription] = useState("");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH ALL FILE STATUSES
  const fetchFileStatuses = async () => {
    try {
      const res = await api.get("/file-statuses");
      setFileStatuses(res.data || []);
    } catch (err) {
      toast.error("Failed to load file statuses");
    }
  };

  useEffect(() => {
    fetchFileStatuses();
  }, []);

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.warning("Status description is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/file-statuses/${editId}`, { description });
        toast.success("File Status Updated Successfully");
      } else {
        await api.post("/file-statuses", { description });
        toast.success("File Status Added Successfully");
      }

      setDescription("");
      setEditId(null);
      fetchFileStatuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT
  const handleEdit = (status) => {
    setDescription(status.description);
    setEditId(status._id);
  };

  // ✅ ✅ ✅ PROFESSIONAL DELETE WITH CONFIRM TOAST
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this File Status?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/file-statuses/${id}`);
                  toast.success("File Status Deleted Successfully");
                  fetchFileStatuses();
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
      <h2 className="text-2xl font-semibold mb-4">File Status Setup</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Status Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border rounded w-96"
        />

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
              setDescription("");
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border w-16">S.No</th>
            <th className="p-2 border">Status Description</th>
            <th className="p-2 border w-20">Edit</th>
            <th className="p-2 border w-24">Delete</th>
          </tr>
        </thead>

        <tbody>
          {fileStatuses.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No File Status Found
              </td>
            </tr>
          ) : (
            fileStatuses.map((item, index) => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border text-left pl-4">
                  {item.description}
                </td>

                <td
                  onClick={() => handleEdit(item)}
                  className="p-2 border text-blue-600 cursor-pointer hover:underline"
                >
                  Edit
                </td>

                <td
                  onClick={() => handleDelete(item._id)}
                  className="p-2 border text-red-600 cursor-pointer hover:underline"
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

export default FileStatusSetup;
