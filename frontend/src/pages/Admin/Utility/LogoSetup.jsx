import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const LogoSetup = () => {
  const [file, setFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  // ✅ FETCH CURRENT LOGO
  const fetchLogo = async () => {
    try {
      const res = await api.get("/logo");
      if (res.data.logo?.logoUrl) {
        setLogoUrl(
          `http://localhost:5000/${res.data.logo.logoUrl}`
        );
      }
    } catch {
      toast.error("Failed to load logo");
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  // ✅ SUBMIT LOGO
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a logo file");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await api.post("/logo/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(res.data.message || "Logo uploaded successfully");
      setFile(null);
      fetchLogo();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Logo Setup
      </h2>

      {/* ✅ CURRENT LOGO PREVIEW */}
      {logoUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={logoUrl}
            alt="Company Logo"
            className="border p-2 rounded bg-gray-50"
          />
        </div>
      )}

      {/* ✅ UPLOAD FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <label className="font-medium">
          Upload Logo (210 × 110 px)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button className="bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
          Update Logo
        </button>
      </form>
    </div>
  );
};

export default LogoSetup;
