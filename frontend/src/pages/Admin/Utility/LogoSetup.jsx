import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const LogoSetup = () => {
  const [file, setFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  // FETCH CURRENT LOGO
  const fetchLogo = async () => {
    try {
      const res = await api.get("/logo");
      if (res.data.logo?.logoUrl) {
        setLogoUrl(`http://localhost:5000/${res.data.logo.logoUrl}`);
      }
    } catch {
      toast.error("Failed to load logo");
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  // SUBMIT LOGO
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Logo updated successfully");
      setFile(null);
      fetchLogo();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white border rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Logo Setup
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload your organization logo used across the system
          </p>
        </div>

        {/* LOGO PREVIEW */}
        {logoUrl && (
          <div className="flex justify-center mb-6">
            <div className="border rounded-xl bg-gray-50 p-4">
              <img
                src={logoUrl}
                alt="Company Logo"
                className="max-h-24 max-w-xs object-contain"
              />
            </div>
          </div>
        )}

        {/* UPLOAD FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Upload New Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-3 rounded-lg border bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <p className="text-xs text-gray-500 mt-2">
              Recommended size: <b>210 × 110 px</b> (PNG / JPG)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition"
          >
            Update Logo
          </button>

        </form>
      </div>
    </div>
  );
};

export default LogoSetup;
