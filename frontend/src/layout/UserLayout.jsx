import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

const UserLayout = () => {
  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 bg-white border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome, <span className="text-gray-900">{userName}</span>
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-hidden bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
