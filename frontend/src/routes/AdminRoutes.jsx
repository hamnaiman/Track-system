// src/routes/AdminRoutes.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const role = localStorage.getItem("role"); // ya AuthContext use kar sakte hain

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
