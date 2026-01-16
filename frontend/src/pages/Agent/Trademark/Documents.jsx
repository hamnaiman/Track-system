import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Documents = () => {
  const [applications, setApplications] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH AGENT APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data?.data || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  /* ================= FETCH DOCUMENTS ================= */
  const fetchDocuments = async () => {
    if (!applicationNumber) {
      toast.warning("Please select an application first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/documents?applicationNumber=${applicationNumber}`
      );
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Application Documents
        </h2>
        <p className="text-sm text-gray-500">
          View documents uploaded against trademark applications
        </p>
      </div>

      {/* ===== SELECT APPLICATION ===== */}
      <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">
        <select
          value={applicationNumber}
          onChange={(e) => {
            setApplicationNumber(e.target.value);
            setDocuments([]); // reset old data
          }}
          className="w-full md:w-96 px-4 py-3 rounded-lg bg-gray-100 border
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select Application</option>
          {applications.map((app) => (
            <option key={app._id} value={app.applicationNumber}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="bg-[#3E4A8A] hover:bg-[#2f3970]
                     text-white px-8 py-3 rounded-lg font-semibold
                     disabled:opacity-60"
        >
          {loading ? "Loading..." : "View Documents"}
        </button>
      </div>

      {/* ===== DOCUMENTS TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 border-b text-left">#</th>
              <th className="p-4 border-b text-left">Remarks</th>
              <th className="p-4 border-b text-left">Visible to Client</th>
              <th className="p-4 border-b text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc, i) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b font-medium">{i + 1}</td>

                  <td className="p-4 border-b">
                    {doc.remarks || "—"}
                  </td>

                  <td className="p-4 border-b">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        doc.showToClient
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {doc.showToClient ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="p-4 border-b text-center">
                    <a
                      href={`http://localhost:5000/api/documents/download/${doc._id}`}
                      className="text-[#3E4A8A] font-semibold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Documents;
