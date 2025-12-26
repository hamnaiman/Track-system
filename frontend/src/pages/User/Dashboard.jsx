import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USER APPLICATIONS ================= */
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");

      // ✅ SAFE NORMALIZATION (MOST IMPORTANT FIX)
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DASHBOARD STATS ================= */
  const totalApps = applications.length;

  const publishedApps = applications.filter(
    (app) => app.status?.description === "Published"
  ).length;

  const pendingApps = totalApps - publishedApps;

  /* ================= GRAPH DATA (LIVE) ================= */
  const graphData = useMemo(() => {
    if (!applications.length) return [];

    const map = {};

    applications.forEach((app) => {
      if (!app.createdAt) return;

      const date = new Date(app.createdAt).toLocaleDateString();

      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map)
      .map((date) => ({ date, count: map[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [applications]);

  return (
    <div className="space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3E4A8A]">
          Welcome, {userName}
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your intellectual property portfolio
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/user/trademark/applications")}
          className="bg-white rounded-xl p-6 border hover:shadow-lg cursor-pointer transition"
        >
          <p className="text-sm text-gray-500">Total Applications</p>
          <h2 className="text-3xl font-bold text-[#3E4A8A] mt-2">
            {loading ? "…" : totalApps}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Published</p>
          <h2 className="text-3xl font-bold text-[#6FAE7B] mt-2">
            {loading ? "…" : publishedApps}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Pending / In Process</p>
          <h2 className="text-3xl font-bold text-gray-700 mt-2">
            {loading ? "…" : pendingApps}
          </h2>
        </div>

      </div>

      {/* ===== GRAPH + ACTIONS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== GRAPH ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-[#3E4A8A] mb-4">
            Applications Over Time
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : graphData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm border rounded-lg">
              No application data available yet
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3E4A8A"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="bg-white rounded-xl p-6 border space-y-4">
          <h3 className="text-lg font-semibold text-[#3E4A8A]">
            Quick Actions
          </h3>

          {[
            { label: "View Monthly Journal", path: "/user/journal/monthly-entries" },
            { label: "Compare with Journal", path: "/user/journal/compare" },
            { label: "Manual Journal Search", path: "/user/journal/search-manual" },
            { label: "Reports & Analytics", path: "/user/reports/basic-search" }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-[#F4F6F8] transition"
            >
              {item.label}
            </button>
          ))}

          <a
            href="/user-manual.pdf"
            download
            className="block text-center px-4 py-3 rounded-lg bg-[#3E4A8A] text-white hover:bg-[#2f3970] transition"
          >
            Download User Manual
          </a>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
