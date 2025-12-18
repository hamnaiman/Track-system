import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {userName}
        </h2>
        <p className="text-gray-500 mt-1">
          Click any module to manage your trademark records
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Application Details */}
        <div
          onClick={() => navigate("/user/trademark/applications")}
          className="bg-white border rounded-xl p-6 cursor-pointer
                     hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Application Details
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View & track your trademark applications
          </p>
        </div>

        {/* Journal */}
        <div
          onClick={() => navigate("/user/journal/monthly")}
          className="bg-white border rounded-xl p-6 cursor-pointer
                     hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Trademark Journal
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Monthly journal & comparison tools
          </p>
        </div>

        {/* Reports */}
        <div
          onClick={() => navigate("/user/reports/basic-search")}
          className="bg-white border rounded-xl p-6 cursor-pointer
                     hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Reports
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Search, renewal & reminder reports
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
