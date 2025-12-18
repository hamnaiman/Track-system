import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const role = localStorage.getItem("role");

  if (role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoutes;
