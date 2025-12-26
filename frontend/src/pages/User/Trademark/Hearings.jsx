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
      const res = await api.get("/applications");
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setApplications(apps);
    } catch (err) {
      console.error(err);
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
    } catch {
      setError("No hearing record found for this application");
      setHearingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Hearings
        </h2>
        <p className="text-sm text-gray-500">
          View date-wise hearing records of your trademark applications
        </p>
      </div>

      {/* ===== APPLICATION SELECT CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="text-gray-500 text-sm">
          Loading hearing details...
        </div>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== HEARING DATA ===== */}
      {!loading && hearingData && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          {/* APPLICATION INFO */}
          <div className="px-4 py-3 border-b bg-gray-50 text-sm">
            <p>
              <span className="font-medium text-gray-700">
                Application No:
              </span>{" "}
              {hearingData.application?.applicationNumber}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                Trademark:
              </span>{" "}
              {hearingData.application?.trademark}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">

              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2 text-left whitespace-nowrap">
                    Hearing Date
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Before
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Comments / Arguments
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Advocate Appeared
                  </th>
                </tr>
              </thead>

              <tbody>
                {hearingData.hearings?.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500"
                    >
                      No hearing records found
                    </td>
                  </tr>
                )}

                {hearingData.hearings?.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border px-4 py-2 whitespace-nowrap">
                      {new Date(row.hearingDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {row.before}
                    </td>
                    <td className="border px-4 py-2">
                      {row.commentsArguments || "-"}
                    </td>
                    <td className="border px-4 py-2">
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
