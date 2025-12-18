import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const Hearings = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [hearingData, setHearingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user applications
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  // Load hearings for selected application
  const loadHearings = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setHearingData(null);

    try {
      const res = await api.get(`/hearings/${appId}`);
      setHearingData(res.data);
    } catch (err) {
      console.error("No hearing found");
      setHearingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Hearings
        </h2>
        <p className="text-sm text-gray-500">
          View date wise hearing records of your trademark applications
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
            loadHearings(e.target.value);
          }}
        >
          <option value="">-- Select Application --</option>
          {applications.map(app => (
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

      {/* HEARING DATA */}
      {!loading && hearingData && (
        <div className="bg-white border rounded shadow-sm">

          {/* APPLICATION INFO */}
          <div className="border-b px-4 py-3 bg-gray-50">
            <p className="text-sm">
              <strong>Application No:</strong>{" "}
              {hearingData.application.applicationNumber}
            </p>
            <p className="text-sm">
              <strong>Trademark:</strong>{" "}
              {hearingData.application.trademark}
            </p>
          </div>

          {/* HEARINGS TABLE */}
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Hearing Date</th>
                  <th className="border px-3 py-2 text-left">Before</th>
                  <th className="border px-3 py-2 text-left">Comments / Arguments</th>
                  <th className="border px-3 py-2 text-left">Advocate Appeared</th>
                </tr>
              </thead>
              <tbody>

                {hearingData.hearings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No hearing records found
                    </td>
                  </tr>
                )}

                {hearingData.hearings.map(row => (
                  <tr key={row._id} className="hover:bg-gray-50">
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
