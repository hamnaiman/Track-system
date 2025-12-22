import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded text-sm transition-colors";
const linkInactive =
  "text-white/80 hover:bg-white/10";
const linkActive =
  "bg-white text-[#3E4A8A] font-semibold";

const UserSidebar = ({ closeSidebar }) => {
  return (
    <aside className="w-64 bg-[#3E4A8A] h-full flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="h-14 flex items-center px-4 font-semibold text-white border-b border-white/10">
        IPMS – User Panel
      </div>

      {/* ===== SCROLL AREA ===== */}
      <div className="flex-1 overflow-y-auto py-3">

        {/* ===== TRADEMARK ===== */}
        <div className="mt-3 px-4 text-xs font-semibold text-white/60 uppercase">
          Trademark
        </div>

        <nav className="mt-2 space-y-1 px-2">

          {[
            { to: "/user/dashboard", label: "Dashboard" },
            { to: "/user/trademark/applications", label: "My Applications" },
            { to: "/user/trademark/journal-details", label: "Journal Details" },
            { to: "/user/journal/monthly-entries", label: "Monthly Journal Entries" },
            { to: "/user/journal/compare", label: "Compare with Journal" },
            { to: "/user/journal/search-manual", label: "Manual Journal Search" },
            { to: "/user/trademark/hearings", label: "Hearings" },
            { to: "/user/trademark/renewal-details", label: "Renewal Details" },
            { to: "/user/trademark/tm-forms", label: "TM Forms" },
            { to: "/user/trademark/documents", label: "TM Documents" }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* ===== REPORTS ===== */}
        <div className="mt-6 px-4 text-xs font-semibold text-white/60 uppercase">
          Reports
        </div>

        <nav className="mt-2 space-y-1 px-2">

          {[
            { to: "/user/reports/basic-search", label: "Basic Search" },
            { to: "/user/reports/renewal", label: "Renewal Report" },
            { to: "/user/reports/reminder", label: "Reminder Report" },
            { to: "/user/reports/single-query", label: "Single Query" }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* ===== UTILITY ===== */}
        <div className="mt-6 px-4 text-xs font-semibold text-white/60 uppercase">
          Utility
        </div>

        <nav className="mt-2 space-y-1 px-2">
          <NavLink
            to="/user/change-password"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Change Password
          </NavLink>
        </nav>

      </div>

      {/* ===== FOOTER ===== */}
      <div className="p-4 border-t border-white/10">
        <a
          href="/user-manual.pdf"
          download
          className="block text-center bg-[#6FAE7B] text-white text-sm py-2 rounded hover:bg-[#5e9e6c] transition"
        >
          Download User Manual
        </a>
      </div>

    </aside>
  );
};

export default UserSidebar;
