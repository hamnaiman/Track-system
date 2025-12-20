import React, { useEffect, useState } from "react";
import api from "../../../api/api"
import { toast } from "react-toastify";

export default function TMDocuments() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showToClient, setShowToClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH GRID ----------------
  const fetchDocuments = async () => {
    if (!applicationNumber) return;
    try {
      const res = await api.get(
        `/documents?applicationNumber=${applicationNumber}`
      );
      setDocuments(res.data || []);
    } catch {
      toast.error("Failed to load documents");
    }
  };

  // ---------------- UPLOAD (UPDATE BUTTON) ----------------
  const handleUpload = async () => {
    if (!applicationNumber || !file || !remarks) {
      return toast.error("All fields are required");
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("applicationNumber", applicationNumber);
    formData.append("remarks", remarks);
    formData.append("showToClient", showToClient);

    try {
      setLoading(true);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Document added to grid");
      setFile(null);
      setRemarks("");
      setShowToClient(false);
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DOWNLOAD ----------------
  const handleDownload = async (doc) => {
    const res = await api.get(`/documents/download/${doc._id}`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    await api.delete(`/documents/${id}`);
    toast.success("Document deleted");
    fetchDocuments();
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 bg-white text-gray-800">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">
        TM Documents
      </h2>

      {/* SEARCH */}
      <div className="mb-4 flex gap-3">
        <input
          className="border px-3 py-2 w-64 bg-gray-50"
          placeholder="Application Number"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
        />
        <button
          onClick={fetchDocuments}
          className="px-4 py-2 bg-gray-700 text-white"
        >
          View
        </button>
      </div>

      {/* UPLOAD FORM */}
      <div className="border p-4 mb-6 bg-gray-50 space-y-3">
        <div>
          <label className="block text-sm mb-1">
            Image / Document (Max 2MB)
          </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm mb-1">Remarks</label>
          <input
            className="border px-3 py-2 w-full"
            placeholder="Very clear description of document"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showToClient}
            onChange={(e) => setShowToClient(e.target.checked)}
          />
          Show to Client
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-5 py-2 bg-gray-800 text-white"
        >
          {loading ? "Uploading..." : "Update"}
        </button>
      </div>

      {/* GRID */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">S.No</th>
            <th className="border px-2 py-2">Document</th>
            <th className="border px-2 py-2">Show To Client</th>
            <th className="border px-2 py-2">Remarks</th>
            <th className="border px-2 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No documents found
              </td>
            </tr>
          )}

          {documents.map((d, i) => (
            <tr key={d._id} className="border-t">
              <td className="border px-2 py-2">{i + 1}</td>
              <td className="border px-2 py-2">
                <button
                  className="text-blue-600 underline"
                  onClick={() => handleDownload(d)}
                >
                  Download
                </button>
              </td>
              <td className="border px-2 py-2">
                {d.showToClient ? "True" : "False"}
              </td>
              <td className="border px-2 py-2">{d.remarks}</td>
              <td className="border px-2 py-2">
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
