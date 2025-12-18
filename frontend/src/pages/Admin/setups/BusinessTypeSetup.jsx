import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const BusinessTypeSetup = () => {
  const [name, setName] = useState("");
  const [businessTypes, setBusinessTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch All Business Types
  const fetchBusinessTypes = async () => {
    try {
      const res = await api.get("/business-types");
      setBusinessTypes(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch business types");
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  // ✅ Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Business type name is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/business-types/${editId}`, { name });
        toast.success("Business Type Updated Successfully");
      } else {
        await api.post("/business-types", { name });
        toast.success("Business Type Added Successfully");
      }

      setName("");
      setEditId(null);
      fetchBusinessTypes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Handler
  const handleEdit = (type) => {
    setName(type.name);
    setEditId(type._id);
  };

  // ✅ ✅ ✅ PROFESSIONAL DELETE WITH TOAST CONFIRMATION
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this Business Type?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/business-types/${id}`);
                  toast.success("Business Type Deleted Successfully");
                  fetchBusinessTypes();
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
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Business Type Setup</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Business Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded w-80"
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
              setName("");
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Business Type Name</th>
              <th className="p-2 border">Edit</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>

          <tbody>
            {businessTypes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No Business Types Found
                </td>
              </tr>
            ) : (
              businessTypes.map((item, index) => (
                <tr key={item._id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border text-left pl-4">{item.name}</td>

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
    </div>
  );
};

export default BusinessTypeSetup;
