import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const UserRenewalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [renewal, setRenewal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load applications");
    }
  };

  /* ================= LOAD RENEWALS ================= */
  const loadRenewals = async (applicationId) => {
    if (!applicationId) return;

    setLoading(true);
    setRenewal(null);

    try {
      const res = await api.get(`/renewals/${applicationId}`);
      setRenewal(res.data);
    } catch (err) {
      console.error("No renewal data found");
      setRenewal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* PAGE HEADER */}
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
            setSelectedApp(e.target.value);
            loadRenewals(e.target.value);
          }}
        >
          <option value="">-- Select Application --</option>
          {applications.map(app => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">Loading renewal details...</div>
      )}

      {/* RENEWAL DATA */}
      {!loading && renewal && (
        <div className="bg-white border rounded shadow-sm">

          {/* APPLICATION INFO */}
          <div className="border-b px-4 py-3 bg-gray-50">
            <p className="text-sm">
              <strong>Application No:</strong>{" "}
              {renewal.application?.applicationNumber || "-"}
            </p>
            <p className="text-sm">
              <strong>Trademark:</strong>{" "}
              {renewal.application?.trademark || "-"}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Renewed Upto</th>
                  <th className="border px-3 py-2 text-left">Remark</th>
                  <th className="border px-3 py-2 text-left">Entry Date</th>
                </tr>
              </thead>

              <tbody>
                {(!renewal.entries || renewal.entries.length === 0) && (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No renewal records found
                    </td>
                  </tr>
                )}

                {renewal.entries?.map(entry => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {new Date(entry.renewedUpto).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">
                      {entry.remark || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(entry.createdAt).toLocaleDateString()}
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

export default UserRenewalDetails;
