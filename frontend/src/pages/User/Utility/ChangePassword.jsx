import React, { useState } from "react";
import api from "../../../api/api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    setLoading(true);
    try {
      // ✅ BACKEND-COMPATIBLE PAYLOAD
      const res = await api.post("/auth/change-password", {
        oldPassword: currentPassword,   // backend expects this
        newPassword,
        confirmPassword
      });

      setSuccess(res.data.message || "Password updated successfully");

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Change Password
          </h1>
          <p className="text-sm text-gray-500">
            Update your account password
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters, 1 uppercase, 1 number, 1 special character
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2 rounded text-sm hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default ChangePassword;
