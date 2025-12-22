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
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
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

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          TM Documents
        </h2>
        <p className="text-sm text-gray-500">
          View and download trademark related documents
        </p>
      </div>

      {/* APPLICATION SELECT */}
      <div className="bg-white border rounded p-4 mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2"
          value={selectedApp}
          onChange={(e) => {
            setSelectedApp(e.target.value);
            loadDocuments(e.target.value);
          }}
        >
          <option value="">-- Select Application --</option>
          {applications.map((app) => (
            <option key={app._id} value={app.applicationNumber}>
              {app.applicationNumber} – {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">
          Loading documents...
        </div>
      )}

      {/* DOCUMENT TABLE */}
      {!loading && documents.length > 0 && (
        <div className="bg-white border rounded shadow-sm overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">
                  File Name
                </th>
                <th className="border px-3 py-2 text-left">
                  Remarks
                </th>
                <th className="border px-3 py-2 text-left">
                  Uploaded Date
                </th>
                <th className="border px-3 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {doc.fileName}
                  </td>
                  <td className="border px-3 py-2">
                    {doc.remarks}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        downloadDocument(doc._id, doc.fileName)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY */}
      {!loading && selectedApp && documents.length === 0 && (
        <div className="text-gray-500 text-center py-6">
          No documents available for this application
        </div>
      )}

    </div>
  );
};

export default TMDocuments;
