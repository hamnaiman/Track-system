import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const JournalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH USER APPLICATIONS ================= */
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
      setError("Failed to load applications");
    }
  };

  /* ================= FETCH JOURNAL ================= */
  const loadJournal = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setJournal(null);
    setError("");

    try {
      const res = await api.get(`/journals/${appId}`);
      setJournal(res.data.data);
    } catch (err) {
      setError("No journal record found for this application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Journal Details
        </h2>
        <p className="text-sm text-gray-500">
          View journal publication record of your trademark applications
        </p>
      </div>

      {/* Application Selector */}
      <div className="bg-white border rounded p-4 mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2"
          value={selectedApp}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            loadJournal(value);
          }}
        >
          <option value="">-- Select Application --</option>

          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} - {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-500">Loading journal record...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* Journal Data */}
      {!loading && journal && (
        <div className="bg-white border rounded shadow-sm">

          {/* Application Info */}
          <div className="border-b px-4 py-3 bg-gray-50">
            <p className="text-sm">
              <strong>Application No:</strong>{" "}
              {journal.application?.applicationNumber}
            </p>
            <p className="text-sm">
              <strong>Trademark:</strong>{" "}
              {journal.application?.trademark}
            </p>
          </div>

          {/* Journal Table */}
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Journal No</th>
                  <th className="border px-3 py-2">Page No</th>
                  <th className="border px-3 py-2">Journal Date</th>
                  <th className="border px-3 py-2">Published Date</th>
                  <th className="border px-3 py-2">Remark</th>
                </tr>
              </thead>

              <tbody>
                {journal.entries.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No journal entries available
                    </td>
                  </tr>
                )}

                {journal.entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="border px-3 py-2">{entry.jNo}</td>
                    <td className="border px-3 py-2">{entry.pageNo}</td>
                    <td className="border px-3 py-2">
                      {new Date(entry.journalDate).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(entry.publishedDate).toLocaleDateString()}
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

export default JournalDetails;
