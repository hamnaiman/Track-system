import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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

      /* ================= OTP FLOW (AGENT LOGIN) ================= */
      if (res.data.otpRequired) {
        localStorage.setItem("otpUserId", res.data.userId);
        toast.info("OTP sent to your registered contact");
        navigate("/send-otp");
        return;
      }

      const { user, token } = res.data;

      /* ================= SAVE AUTH DATA ================= */
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role?.toLowerCase());
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("authUser", JSON.stringify(user));

      toast.success(`Welcome ${user.fullName}`);

      /* ================= ROLE BASED ROUTING ================= */
      const role = user.role?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "agent") navigate("/agent/dashboard");
      else toast.error("Unknown role!");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Trade Developers & Protectors Logo"
            className="h-12 mx-auto mb-3"
          />

          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Trade Developers & Protectors
          </h2>

          <p className="text-sm text-gray-500">
            Intellectual Property & Trademark Management System
          </p>
        </div>

        {/* ===== FORM ===== */}
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
              placeholder="e.g. PEX-ADMIN"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border
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
              placeholder="Enter your User ID"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border
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
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* FORGOT PASSWORD */}
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
