import React, { useEffect, useState } from "react";
import api from "../../../api/api";

import { toast } from "react-toastify";

const CitySetup = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Countries
  const fetchCountries = async () => {
    try {
      const res = await api.get("/countries");
      setCountries(res.data || []);
    } catch {
      toast.error("Failed to load countries");
    }
  };

  // ✅ Fetch Cities (based on country)
  const fetchCities = async (cid) => {
    try {
      const res = await api.get(`/cities?countryId=${cid}`);
      setCities(res.data || []);
    } catch {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countryId) fetchCities(countryId);
  }, [countryId]);

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!countryId || !name.trim()) {
      toast.warning("Country & City name required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/cities/${editId}`, { name });
        toast.success("City Updated Successfully");
      } else {
        await api.post("/cities", { countryId, name });
        toast.success("City Added Successfully");
      }

      setName("");
      setEditId(null);
      fetchCities(countryId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (city) => {
    setName(city.name);
    setEditId(city._id);
  };

  // ✅ Delete with Toast Confirm
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Delete this City permanently?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/cities/${id}`);
                  toast.success("City Deleted Successfully");
                  fetchCities(countryId);
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes
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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">City Setup</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          className="p-3 border rounded w-72"
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="City Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded w-64"
        />

        <button
          disabled={loading}
          className="bg-gray-800 text-white px-6 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : editId ? "Update" : "Save"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
            className="bg-gray-400 text-white px-6 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">City Name</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {cities.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No Cities Found
              </td>
            </tr>
          ) : (
            cities.map((city, index) => (
              <tr key={city._id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2 text-left pl-4">{city.name}</td>

                <td
                  onClick={() => handleEdit(city)}
                  className="border p-2 text-blue-600 cursor-pointer"
                >
                  Edit
                </td>

                <td
                  onClick={() => handleDelete(city._id)}
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

export default CitySetup;
