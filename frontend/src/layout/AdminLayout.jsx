import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar role="admin" />

      <main className="flex-1 bg-white p-6 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
