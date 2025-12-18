// src/layout/AgentLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AgentLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar type="agent" />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
