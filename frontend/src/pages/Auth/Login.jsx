import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // ✅ FIXED STATE
  const [customerCode, setCustomerCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // ✅ ✅ UPDATED HANDLE SUBMIT WITH OTP SUPPORT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        customerCode,
        userId,
        password,
      });

      // ✅ OTP REQUIRED FLOW
      if (res.data.otpRequired) {
        localStorage.setItem("otpUserId", res.data.userId);
        navigate("/send-otp");
        return;
      }

      // ✅ NORMAL LOGIN FLOW
      const token = res.data.token;
      const role = res.data.user?.role?.toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "agent") navigate("/agent/dashboard");
      else alert("Unknown role received!");

    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        {/* Customer Code */}
        <label className="text-gray-700 text-sm mb-1 block">
          Customer Code
        </label>
        <input
          type="text"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          placeholder="Enter Customer Code"
          className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 mb-4"
          required
        />

        {/* User ID */}
        <label className="text-gray-700 text-sm mb-1 block">
          User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 mb-4"
          required
        />

        {/* Password */}
        <label className="text-gray-700 text-sm mb-1 block">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 mb-2"
          required
        />

        <div className="text-right mb-6">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
