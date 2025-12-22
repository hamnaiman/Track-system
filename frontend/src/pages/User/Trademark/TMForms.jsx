import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const TMForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD TM FORMS ================= */
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tm-forms");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setForms(data);
    } catch (err) {
      console.error("Failed to load TM Forms", err);
      setError("Failed to load TM Forms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          TM Forms
        </h2>
        <p className="text-sm text-gray-500">
          View available Trademark Forms and their priority
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded shadow-sm overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">
                Form Number
              </th>
              <th className="border px-3 py-2 text-left">
                Description
              </th>
              <th className="border px-3 py-2 text-center">
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  Loading TM Forms...
                </td>
              </tr>
            )}

            {!loading && forms.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No TM Forms available
                </td>
              </tr>
            )}

            {forms.map((form) => (
              <tr key={form._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {form.formNumber}
                </td>
                <td className="border px-3 py-2">
                  {form.description}
                </td>
                <td className="border px-3 py-2 text-center">
                  {form.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TMForms;
