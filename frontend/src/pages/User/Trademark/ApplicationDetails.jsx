import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data?.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED ROUTE
  const openDetails = (id) => {
    navigate(`/user/trademark/application/view/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Application Details
        </h2>
        <p className="text-sm text-gray-500">
          You can view and print your trademark applications
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">Application No</th>
              <th className="border px-3 py-2">Trademark</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Classes</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            )}

            {!loading &&
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-blue-50">
                  <td className="border px-3 py-2">
                    {app.applicationNumber}
                  </td>
                  <td className="border px-3 py-2">
                    {app.trademark}
                  </td>
                  <td className="border px-3 py-2">
                    {app.status?.description || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {app.classes?.join(", ") || "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => openDetails(app._id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationDetails;
