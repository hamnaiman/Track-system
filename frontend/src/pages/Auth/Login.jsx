import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [customerCode, setCustomerCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        customerCode,
        userId,
        password,
      });

      if (res.data.otpRequired) {
        localStorage.setItem("otpUserId", res.data.userId);
        navigate("/send-otp");
        return;
      }

      const token = res.data.token;
      const role = res.data.user?.role?.toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "agent") navigate("/agent/dashboard");
      else alert("Unknown role received!");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">

        {/* LOGO + TITLE */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="IPMS Logo"
            className="h-12 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            IPMS Login
          </h2>
          <p className="text-sm text-gray-500">
            Intellectual Property Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CUSTOMER CODE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Customer Code
            </label>
            <input
              type="text"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
              placeholder="e.g. IPMS-001"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* USER ID */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* FORGOT */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#3E4A8A] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
