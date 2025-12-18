import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const navigate = useNavigate();

  // 🔐 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r shadow-md p-4 flex flex-col justify-between">
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Admin Panel
          </h2>

          <nav className="space-y-3 text-sm">

            {/* DASHBOARD */}
            <p className="font-semibold text-gray-600 mb-2">DASHBOARD</p>
            <MenuLink to="dashboard" label="Dashboard" />

            {/* SETUPS */}
            <div>
              <p className="font-semibold text-gray-600 mb-2">SETUPS</p>
              <MenuLink to="add-user" label="Add New User" />
              <MenuLink to="country" label="Country Setup" />
              <MenuLink to="city" label="City Setup" />
              <MenuLink to="business-type" label="Business Type Setup" />
              <MenuLink to="class" label="Class Setup" />
              <MenuLink to="file-status" label="File Status Setup" />
              <MenuLink to="tm-forms" label="TM Forms Setup" />
              <MenuLink to="agent-registration" label="Agent Registration" />
              <MenuLink to="customer-registration" label="Customer Registration" />
              <MenuLink to="customer-list" label="Customer List – TM" />
              <MenuLink to="agent-list" label="Agent List – TM" />
            </div>

            {/* TRADEMARK */}
            <div className="pt-4">
              <p className="font-semibold text-gray-600 mb-2">TRADEMARK</p>
              <MenuLink to="application-details" label="Application Details" />
              <MenuLink to="tm-form-entries" label="TM Form Entries" />
              <MenuLink to="hearings" label="Hearings" />
              <MenuLink to="journal-details" label="Journal Details" />
              <MenuLink to="renewal-details" label="Renewal Details" />
              <MenuLink to="tm-documents" label="TM Documents" />
              <MenuLink to="basic-search" label="Basic Search Report" />
              <MenuLink to="tm-renewal-report" label="TM Renewal Report" />
              <MenuLink to="tm-reminder-report" label="TM Reminder Report" />
              <MenuLink to="tm-single-query" label="TM Single Query" />
            </div>

            {/* OPPOSITION */}
            <div className="pt-4">
              <p className="font-semibold text-gray-600 mb-2">OPPOSITION</p>
              <MenuLink to="opposition-application" label="Application Details" />
              <MenuLink to="opposition-documents" label="Opposition Documents" />
              <MenuLink to="opposition-forms" label="Opposition Form Entries" />
              <MenuLink to="opposition-report" label="Opposition Report" />
              <MenuLink to="opposition-reminder" label="Opposition Reminder Report" />
              <MenuLink to="opposition-query" label="Opposition Single Query" />
            </div>

            {/* TRADEMARK JOURNAL */}
            <div className="pt-4">
              <p className="font-semibold text-gray-600 mb-2">TRADEMARK JOURNAL</p>
              <MenuLink to="monthly-journal" label="Monthly Journal Entries" />
              <MenuLink to="compare-journal" label="Compare Trademark with Journal" />
              <MenuLink to="search-journal" label="Search Manual Trademark in Journal" />
            </div>

            {/* UTILITY */}
            <div className="pt-4">
              <p className="font-semibold text-gray-600 mb-2">UTILITY</p>
              <MenuLink to="change-password" label="Change Password" />
              <MenuLink to="date-format" label="Date Format Setup" />
              <MenuLink to="logo-setup" label="Logo Setup" />
            </div>

          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-gray-700 text-white py-2 rounded font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

const MenuLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-3 py-2 rounded ${
        isActive ? "bg-gray-700 text-white" : "text-gray-700 hover:bg-gray-200"
      }`
    }
  >
    {label}
  </NavLink>
);

export default AdminLayout;
