import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* ===== ADMIN SIDEBAR ===== */}
      <Sidebar role="admin" />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
