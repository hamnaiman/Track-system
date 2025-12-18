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
      // backend authMiddleware user se client auto resolve karega
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Application Details
        </h2>
        <p className="text-sm text-gray-500">
          View all your trademark applications
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border rounded-lg shadow-sm flex-1 overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 font-semibold">
          My Applications
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-3 py-2 text-left">Application No</th>
                <th className="border px-3 py-2 text-left">Trademark</th>
                <th className="border px-3 py-2 text-left">Client</th>
                <th className="border px-3 py-2 text-left">Status</th>
                <th className="border px-3 py-2 text-left">Classes</th>
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
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/user/trademark/application/${app._id}`)
                    }
                  >
                    <td className="border px-3 py-2">
                      {app.applicationNumber}
                    </td>
                    <td className="border px-3 py-2">
                      {app.trademark}
                    </td>
                    <td className="border px-3 py-2">
                      {app.client?.customerName || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      <span className="px-2 py-1 text-xs rounded bg-gray-200">
                        {app.status?.description || "-"}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      {app.classes?.join(", ") || "-"}
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
