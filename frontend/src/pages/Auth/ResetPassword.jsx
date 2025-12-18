import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const ResetPassword = () => {
  const { token } = useParams(); // URL se token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password below.
        </p>

        {success && (
          <div className="mb-4 text-green-600 bg-green-50 p-3 rounded text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-gray-700 text-sm mb-1 block">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-400 mb-4"
          />

          <label className="text-gray-700 text-sm mb-1 block">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-gray-400 mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
