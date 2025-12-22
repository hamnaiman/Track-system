import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const RenewalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [renewalData, setRenewalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");

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

  /* ================= LOAD RENEWAL DATA ================= */
  const loadRenewals = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setRenewalData(null);
    setError("");

    try {
      const res = await api.get(`/renewals/${appId}`);
      setRenewalData(res.data || { entries: [] });
    } catch (err) {
      console.error("No renewal data found");
      setError("No renewal record found for this application");
      setRenewalData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Renewal Details
        </h2>
        <p className="text-sm text-gray-500">
          View renewal history of your trademark applications
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
            loadRenewals(value);
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
        <div className="text-gray-500">
          Loading renewal records...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* RENEWAL DATA */}
      {!loading && renewalData && (
        <div className="bg-white border rounded shadow-sm">

          {/* APPLICATION INFO */}
          <div className="border-b px-4 py-3 bg-gray-50">
            <p className="text-sm">
              <strong>Application No:</strong>{" "}
              {renewalData.application?.applicationNumber || "-"}
            </p>
            <p className="text-sm">
              <strong>Trademark:</strong>{" "}
              {renewalData.application?.trademark || "-"}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Renewed Upto</th>
                  <th className="border px-3 py-2">Remark</th>
                </tr>
              </thead>

              <tbody>
                {renewalData.entries?.length === 0 && (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center py-6 text-gray-500"
                    >
                      No renewal history found
                    </td>
                  </tr>
                )}

                {renewalData.entries?.map((entry) => (
                  <tr key={entry._id}>
                    <td className="border px-3 py-2">
                      {new Date(entry.renewedUpto).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">
                      {entry.remark || "-"}
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

export default RenewalDetails;
