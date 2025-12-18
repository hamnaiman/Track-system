import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CountrySetup = () => {
  const [name, setName] = useState("");
  const [countries, setCountries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all countries
  const fetchCountries = async () => {
    try {
      const res = await api.get("/countries");
      setCountries(res.data || []);
    } catch (err) {
      toast.error("Failed to load countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // CREATE / UPDATE COUNTRY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Country name is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/countries/${editId}`, { name });
        toast.success("Country updated successfully");
      } else {
        await api.post("/countries", { name });
        toast.success("Country added successfully");
      }

      setName("");
      setEditId(null);
      fetchCountries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // EDIT COUNTRY
  const handleEdit = (country) => {
    setName(country.name);
    setEditId(country._id);
  };

  // DELETE COUNTRY (Professional Toast Confirmation)
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this Country?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/countries/${id}`);
                  toast.success("Country deleted successfully");
                  fetchCountries();
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
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Country Setup</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Country Name"
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

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Country Name</th>
              <th className="p-2 border">Edit</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>

          <tbody>
            {countries.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No Countries Found
                </td>
              </tr>
            ) : (
              countries.map((item, index) => (
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

export default CountrySetup;
