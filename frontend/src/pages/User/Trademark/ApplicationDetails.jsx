import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";

const ApplicationDetails = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Application Details
        </h2>
        <p className="text-sm text-gray-500">
          View all your trademark applications
        </p>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm">

        {/* Card Header */}
        <div className="px-4 py-3 border-b bg-gray-50 font-medium text-gray-700">
          My Applications
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">

            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="border px-4 py-2 text-left whitespace-nowrap">
                  Application No
                </th>
                <th className="border px-4 py-2 text-left">
                  Trademark
                </th>
                <th className="border px-4 py-2 text-left">
                  Client
                </th>
                <th className="border px-4 py-2 text-left">
                  Status
                </th>
                <th className="border px-4 py-2 text-left">
                  Classes
                </th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              )}

              {!loading && applications.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}

              {!loading &&
                applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() =>
                      navigate(`/user/trademark/application/${app._id}`)
                    }
                  >
                    <td className="border px-4 py-2 font-medium text-[#3E4A8A]">
                      {app.applicationNumber}
                    </td>

                    <td className="border px-4 py-2">
                      {app.trademark}
                    </td>

                    <td className="border px-4 py-2">
                      {app.client?.customerName || "-"}
                    </td>

                    <td className="border px-4 py-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-[#3E4A8A]">
                        {app.status?.description || "-"}
                      </span>
                    </td>

                    <td className="border px-4 py-2">
                      {Array.isArray(app.classes)
                        ? app.classes.join(", ")
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ApplicationDetails;
