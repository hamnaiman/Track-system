import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  /* ================= KPI DATA (API READY) ================= */
  const kpis = [
    { label: "Total Users", value: 128 },
    { label: "Total Applications", value: 342 },
    { label: "Pending Cases", value: 74 },
    { label: "Hearings Scheduled", value: 19 }
  ];

  /* ================= BAR CHART ================= */
  const applicationStats = [
    { name: "Published", value: 180 },
    { name: "Pending", value: 120 },
    { name: "Opposition", value: 42 }
  ];

  /* ================= PIE CHART ================= */
  const caseDistribution = [
    { name: "Trademark", value: 65 },
    { name: "Opposition", value: 20 },
    { name: "Renewal", value: 15 }
  ];

  const pieColors = ["#3E4A8A", "#6FAE7B", "#94A3B8"];

  /* ================= MODULE GROUPS ================= */
  const moduleGroups = [
    {
      title: "System Setup",
      items: [
        { name: "Add User", path: "/admin/add-user" },
        { name: "Country", path: "/admin/country" },
        { name: "City", path: "/admin/city" },
        { name: "Business Type", path: "/admin/business-type" },
        { name: "Class Setup", path: "/admin/class" }
      ]
    },
    {
      title: "Trademark Operations",
      items: [
        { name: "Applications", path: "/admin/application-details" },
        { name: "Hearings", path: "/admin/hearings" },
        { name: "Journal", path: "/admin/journal-details" },
        { name: "Renewals", path: "/admin/renewal-details" }
      ]
    },
    {
      title: "Reports & Analysis",
      items: [
        { name: "Basic Search", path: "/admin/basic-search" },
        { name: "Renewal Report", path: "/admin/tm-renewal-report" },
        { name: "Reminder Report", path: "/admin/tm-reminder-report" },
        { name: "Single Query", path: "/admin/tm-single-query" }
      ]
    }
  ];

  return (
    <div className="space-y-10">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold text-[#3E4A8A]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          IPMS system overview & operational insights
        </p>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl p-6 border shadow-sm"
          >
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <h2 className="text-3xl font-bold text-[#3E4A8A] mt-2">
              {kpi.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
          <h3 className="font-semibold text-[#3E4A8A] mb-4">
            Application Status Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3E4A8A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold text-[#3E4A8A] mb-4">
            Case Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseDistribution}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {caseDistribution.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ===== MODULE ACCESS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moduleGroups.map((group) => (
          <div
            key={group.title}
            className="bg-white p-6 rounded-xl border"
          >
            <h3 className="font-semibold text-[#3E4A8A] mb-4">
              {group.title}
            </h3>

            <div className="space-y-2">
              {group.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full text-left px-4 py-2 border rounded-lg hover:bg-[#F4F6F8] transition"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;
