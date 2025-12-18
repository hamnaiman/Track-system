import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Add New User", path: "/admin/add-user" },
    { title: "Country Setup", path: "/admin/country" },
    { title: "City Setup", path: "/admin/city" },
    { title: "Business Type Setup", path: "/admin/business-type" },
    { title: "Class Setup", path: "/admin/class" },
    { title: "File Status Setup", path: "/admin/file-status" },
    { title: "TM Forms Setup", path: "/admin/tm-forms" },
    { title: "Agent Registration", path: "/admin/agent-registration" },
    { title: "Customer Registration", path: "/admin/customer-registration" },
    { title: "Customer List – TM", path: "/admin/customer-list" },
    { title: "Agent List – TM", path: "/admin/agent-list" },

    { title: "Application Details", path: "/admin/application-details" },
    { title: "TM Form Entries", path: "/admin/tm-form-entries" },
    { title: "Hearings", path: "/admin/hearings" },
    { title: "Journal Details", path: "/admin/journal-details" },
    { title: "Renewal Details", path: "/admin/renewal-details" },
    { title: "TM Documents", path: "/admin/tm-documents" },

    { title: "Basic Search Report", path: "/admin/basic-search" },
    { title: "TM Renewal Report", path: "/admin/tm-renewal-report" },
    { title: "TM Reminder Report", path: "/admin/tm-reminder-report" },
    { title: "TM Single Query", path: "/admin/tm-single-query" },

    { title: "Opposition Application", path: "/admin/opposition-application" },
    { title: "Opposition Documents", path: "/admin/opposition-documents" },
    { title: "Opposition Forms", path: "/admin/opposition-forms" },
    { title: "Opposition Report", path: "/admin/opposition-report" },
    { title: "Opposition Reminder", path: "/admin/opposition-reminder" },
    { title: "Opposition Query", path: "/admin/opposition-query" },

    { title: "Monthly Journal", path: "/admin/monthly-journal" },
    { title: "Compare Journal", path: "/admin/compare-journal" },
    { title: "Search Journal", path: "/admin/search-journal" },

    { title: "Change Password", path: "/admin/change-password" },
    { title: "Date Format Setup", path: "/admin/date-format" },
    { title: "Logo Setup", path: "/admin/logo-setup" },
  ];

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-5">
        Welcome To Admin Dashboard
      </h1>
      <p className="text-xl text-gray-600 mb-10">
        Click any module to manage your system records efficiently.
      </p>

      {/* ✅ PREMIUM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-9">

        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="
              group cursor-pointer
              bg-gradient-to-br from-gray-100 to-gray-200
              border border-gray-300
              rounded-2xl p-6
              text-center font-semibold text-gray-800
              shadow-md transition-all duration-300
              hover:from-gray-800 hover:to-gray-900
              hover:text-white hover:-translate-y-1 hover:shadow-xl
            "
          >
            <div className="text-lg mb-1">
              {card.title}
            </div>

            <div className="text-xs text-gray-500 group-hover:text-gray-300">
              Open Module
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminDashboard;
