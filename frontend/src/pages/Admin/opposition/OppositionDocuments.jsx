import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionDocuments = () => {
  const [oppositionNumber, setOppositionNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [trademark, setTrademark] = useState("");
  const [documents, setDocuments] = useState([]);

  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showToClient, setShowToClient] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH GRID ================= */
  const fetchDocuments = async () => {
    if (!oppositionNumber.trim()) {
      toast.warning("Opposition / Rectification number is required");
      return;
    }

    try {
      const res = await api.get(
        `/opposition-documents?oppositionNumber=${oppositionNumber}`
      );
      setDocuments(res.data || []);
    } catch {
      toast.error("Failed to load opposition documents");
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!oppositionNumber || !file || !remarks) {
      return toast.error("Opposition number, file and remarks are required");
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("oppositionNumber", oppositionNumber);
    formData.append("applicationNumber", applicationNumber);
    formData.append("trademark", trademark);
    formData.append("remarks", remarks);
    formData.append("showToClient", showToClient);

    try {
      setLoading(true);
      await api.post("/opposition-documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully");
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

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (doc) => {
    const res = await api.get(
      `/opposition-documents/download/${doc._id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    await api.delete(`/opposition-documents/${id}`);
    toast.success("Document deleted");
    fetchDocuments();
  };

  return (
    <div className="min-h-[70vh] px-4 py-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white border rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Opposition Documents
          </h2>
          <p className="text-sm text-gray-500">
            Upload & manage opposition / rectification related documents
          </p>
        </div>

        {/* SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            className="border rounded-lg px-3 py-2 bg-gray-50"
            placeholder="Opposition / Rectification No."
            value={oppositionNumber}
            onChange={(e) => setOppositionNumber(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2 bg-gray-50"
            placeholder="Application Number"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2 bg-gray-50"
            placeholder="Trademark"
            value={trademark}
            onChange={(e) => setTrademark(e.target.value)}
          />
        </div>

        <button
          onClick={fetchDocuments}
          className="mb-6 bg-[#3E4A8A] text-white px-6 py-2 rounded-lg hover:bg-[#2f3970]"
        >
          View Documents
        </button>

        {/* UPLOAD CARD */}
        <div className="border rounded-xl bg-gray-50 p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-700">Upload Document</h3>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Clear description / remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
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
            className="bg-gray-800 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* DOCUMENT TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Document</th>
                <th className="border px-3 py-2">Show To Client</th>
                <th className="border px-3 py-2">Remarks</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No documents found
                  </td>
                </tr>
              )}

              {documents.map((d, i) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{i + 1}</td>
                  <td className="border px-3 py-2">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => handleDownload(d)}
                    >
                      Download
                    </button>
                  </td>
                  <td className="border px-3 py-2">
                    {d.showToClient ? "Yes" : "No"}
                  </td>
                  <td className="border px-3 py-2">{d.remarks}</td>
                  <td className="border px-3 py-2">
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

      </div>
    </div>
  );
};

export default OppositionDocuments;
