import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✔ Strong password rule (same as backend)
  const strongPass =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password & confirm password do not match");
      return;
    }

    if (!strongPass.test(newPassword)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, number & special character"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message || "Password updated");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your account security
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* OLD PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters, include uppercase, number & symbol
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition
                       disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChangePassword;
