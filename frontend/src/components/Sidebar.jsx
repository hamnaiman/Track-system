import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded text-sm transition-colors";
const linkInactive =
  "text-gray-700 hover:bg-gray-100";
const linkActive =
  "bg-gray-700 text-white";

const Sidebar = ({ role }) => {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center px-4 font-semibold text-gray-800 border-b bg-gray-50">
        {role === "admin" ? "Admin Panel" : "User Panel"}
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            {/* DASHBOARD */}
            <nav className="px-2">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Dashboard
              </NavLink>
            </nav>

            {/* SETUPS */}
            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              Setups
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/admin/setups/add-user" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Add User</NavLink>
              <NavLink to="/admin/setups/country" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Country</NavLink>
              <NavLink to="/admin/setups/city" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>City</NavLink>
              <NavLink to="/admin/setups/class" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Class</NavLink>
              <NavLink to="/admin/setups/business-type" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Business Type</NavLink>
              <NavLink to="/admin/setups/file-status" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>File Status</NavLink>
              <NavLink to="/admin/setups/tm-forms" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>TM Forms</NavLink>
              <NavLink to="/admin/setups/agent-registration" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Agent Registration</NavLink>
              <NavLink to="/admin/setups/agent-list-tm" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Agent List TM</NavLink>
              <NavLink to="/admin/setups/customer-registration" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Customer Registration</NavLink>
            </nav>

            {/* TRADEMARK */}
            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              Trademark
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/admin/trademark/applications" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Application Details</NavLink>
              <NavLink to="/admin/trademark/hearings" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Hearings</NavLink>
              <NavLink to="/admin/trademark/journal-details" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Journal Details</NavLink>
              <NavLink to="/admin/trademark/renewal-details" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Renewal Details</NavLink>
              <NavLink to="/admin/trademark/tm-form-entries" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>TM Form Entries</NavLink>
            </nav>

            {/* REPORTS */}
            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              Reports
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/admin/reports/basic-search" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Basic Search</NavLink>
              <NavLink to="/admin/reports/reminder" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Reminder Report</NavLink>
              <NavLink to="/admin/reports/renewal" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Renewal Report</NavLink>
              <NavLink to="/admin/reports/single-query" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Single Query</NavLink>
            </nav>

            {/* JOURNAL */}
            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              TradeMark Journal
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/admin/journal/compare" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Compare Journal</NavLink>
              <NavLink to="/admin/journal/monthly" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Monthly Journal</NavLink>
              <NavLink to="/admin/journal/search-manual" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Search Manual</NavLink>
            </nav>

            {/* UTILITY */}
            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              Utility
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/admin/change-password" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Change Password</NavLink>
              <NavLink to="/admin/date-setup" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Date Setup</NavLink>
              <NavLink to="/admin/logo-setup" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Logo Setup</NavLink>
            </nav>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <div className="mt-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Trademark
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/user/dashboard" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Dashboard</NavLink>
              <NavLink to="/user/trademark/applications" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>My Applications</NavLink>
              <NavLink to="/user/trademark/journal-details" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Journal Details</NavLink>
              <NavLink to="/user/trademark/hearings" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Hearings</NavLink>
              <NavLink to="/user/trademark/renewal-details" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Renewals</NavLink>
            </nav>

            <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
              Utility
            </div>
            <nav className="mt-1 space-y-1 px-2">
              <NavLink to="/user/change-password" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkInactive}`}>Change Password</NavLink>
            </nav>
          </>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
