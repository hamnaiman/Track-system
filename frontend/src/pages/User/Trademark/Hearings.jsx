import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const Hearings = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [hearingData, setHearingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // ✅ USER ENDPOINT
      const res = await api.get("/applications");

      // ✅ SAFE NORMALIZATION
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setApplications(apps);
    } catch (err) {
      console.error("Failed to load applications", err);
      setApplications([]);
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD HEARINGS ================= */
  const loadHearings = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setHearingData(null);
    setError("");

    try {
      const res = await api.get(`/hearings/${appId}`);
      setHearingData(res.data?.data || null);
    } catch (err) {
      console.error("No hearing found");
      setError("No hearing record found for this application");
      setHearingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hearings</h2>
        <p className="text-sm text-gray-500">
          View date-wise hearing records of your trademark applications
        </p>
      </div>

      {/* APPLICATION SELECT */}
      <div className="bg-white border rounded p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2"
          value={selectedApp}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            loadHearings(value);
          }}
        >
          <option value="">-- Select Application --</option>

          {applications.length === 0 && (
            <option disabled>No applications found</option>
          )}

          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} - {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">Loading hearings...</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-500 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* HEARING DATA */}
      {!loading && hearingData && (
        <div className="bg-white border rounded shadow-sm">

          {/* APPLICATION INFO */}
          <div className="border-b px-4 py-3 bg-gray-50">
            <p className="text-sm">
              <strong>Application No:</strong>{" "}
              {hearingData.application?.applicationNumber}
            </p>
            <p className="text-sm">
              <strong>Trademark:</strong>{" "}
              {hearingData.application?.trademark}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Hearing Date</th>
                  <th className="border px-3 py-2">Before</th>
                  <th className="border px-3 py-2">Comments / Arguments</th>
                  <th className="border px-3 py-2">Advocate Appeared</th>
                </tr>
              </thead>
              <tbody>
                {hearingData.hearings?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No hearing records found
                    </td>
                  </tr>
                )}

                {hearingData.hearings?.map((row) => (
                  <tr key={row._id}>
                    <td className="border px-3 py-2">
                      {new Date(row.hearingDate).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">{row.before}</td>
                    <td className="border px-3 py-2">
                      {row.commentsArguments || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {row.advocateAppeared || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

export default Hearings;
