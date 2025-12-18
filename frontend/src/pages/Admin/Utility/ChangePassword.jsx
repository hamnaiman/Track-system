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
    <div className="bg-white p-10 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OLD PASSWORD */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Enter New Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Retype New Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white w-full py-3 rounded hover:bg-gray-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
