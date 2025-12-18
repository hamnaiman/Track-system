import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const DateSetup = () => {
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [loading, setLoading] = useState(false);

  // ✅ FETCH CURRENT DATE FORMAT
  const fetchDateFormat = async () => {
    try {
      const res = await api.get("/settings/date-format");
      setDateFormat(res.data.dateFormat);
    } catch (err) {
      toast.error("Failed to load date format");
    }
  };

  useEffect(() => {
    fetchDateFormat();
  }, []);

  // ✅ UPDATE DATE FORMAT
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put("/settings/date-format", {
        dateFormat,
      });

      toast.success(res.data.message || "Date format updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Date Format Setup
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Date Format
          </label>

          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="dd/MM/yyyy">dd/MM/yyyy</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-2 rounded w-full"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default DateSetup;
