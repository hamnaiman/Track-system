import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const UserOppositionDocuments = () => {
  const [oppositionNumber, setOppositionNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH DOCUMENTS ================= */
  const fetchDocuments = async () => {
    if (!oppositionNumber) {
      setError("Opposition number is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get("/opposition-documents", {
        params: { oppositionNumber }
      });

      // ✅ Only documents allowed for client
      const visibleDocs = res.data.filter(
        (doc) => doc.showToClient === true
      );

      setDocuments(visibleDocs);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadDoc = async (id, fileName) => {
    try {
      const res = await api.get(
        `/opposition-documents/download/${id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download document");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Opposition Documents
        </h1>
        <p className="text-sm text-gray-500">
          View documents shared by agent/admin
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Enter Opposition Number"
          value={oppositionNumber}
          onChange={(e) => setOppositionNumber(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full md:w-72"
        />

        <button
          onClick={fetchDocuments}
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
          Search
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600">
              <th className="p-3">File Name</th>
              <th className="p-3">Remarks</th>
              <th className="p-3">Uploaded On</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No documents available
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{doc.fileName}</td>
                  <td className="p-3">{doc.remarks}</td>
                  <td className="p-3">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        downloadDoc(doc._id, doc.fileName)
                      }
                      className="text-gray-700 hover:underline text-sm"
                    >
                      Download
                    </button>
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

export default UserOppositionDocuments;
