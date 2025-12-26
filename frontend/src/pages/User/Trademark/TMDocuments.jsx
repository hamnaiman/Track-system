import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const TMDocuments = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");

      // ✅ CORRECT NORMALIZATION (THIS FIXES YOUR BUG)
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setApplications(apps);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD DOCUMENTS ================= */
  const loadDocuments = async (applicationNumber) => {
    if (!applicationNumber) return;

    setLoading(true);
    setError("");
    setDocuments([]);

    try {
      const res = await api.get("/tm-documents", {
        params: { applicationNumber }
      });

      setDocuments(res.data || []);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadDocument = async (id, fileName) => {
    try {
      const res = await api.get(`/tm-documents/download/${id}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          TM Documents
        </h2>
        <p className="text-sm text-gray-500">
          View and download trademark related documents
        </p>
      </div>

      {/* ===== APPLICATION SELECT ===== */}
      <div className="bg-white border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3E4A8A]"
          value={selectedApp}
          onChange={(e) => {
            setSelectedApp(e.target.value);
            loadDocuments(e.target.value);
          }}
        >
          <option value="">-- Select Application --</option>

          {applications.length === 0 && (
            <option disabled>No applications found</option>
          )}

          {applications.map((app) => (
            <option key={app._id} value={app.applicationNumber}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="text-gray-500 text-sm">
          Loading documents...
        </div>
      )}

      {/* ===== DOCUMENT TABLE ===== */}
      {!loading && documents.length > 0 && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          <div className="px-4 py-3 border-b bg-gray-50 font-medium text-gray-700">
            Documents List
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2 text-left">
                    File Name
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Remarks
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Uploaded Date
                  </th>
                  <th className="border px-4 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2">
                      {doc.fileName}
                    </td>
                    <td className="border px-4 py-2">
                      {doc.remarks || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          downloadDocument(doc._id, doc.fileName)
                        }
                        className="text-[#3E4A8A] font-medium hover:underline"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && selectedApp && documents.length === 0 && (
        <div className="text-gray-500 text-center py-6 text-sm">
          No documents available for this application
        </div>
      )}

    </div>
  );
};

export default TMDocuments;
