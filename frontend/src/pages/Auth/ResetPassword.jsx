import { useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || "Reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border">

        {/* HEADER STRIP */}
        <div className="bg-gradient-to-r from-[#3E4A8A] to-[#2f3970] px-8 py-6 text-center">
          <img src="/logo.png" alt="IPMS Logo" className="h-10 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-white">
            Forgot Password
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Intellectual Property Management System
          </p>
        </div>

        {/* BODY */}
        <div className="p-8">

          {success && (
            <div className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white py-3 rounded-lg font-semibold transition
                         disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* BACK */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-[#3E4A8A] hover:underline">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
