import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded text-sm transition-colors";

const linkInactive =
  "text-gray-700 hover:bg-gray-100";

const linkActive =
  "bg-gray-700 text-white";

const UserSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center px-4 font-semibold text-gray-800 border-b bg-gray-50">
        User Panel
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* TRADEMARK */}
        <div className="mt-3 px-4 text-xs font-semibold text-gray-500 uppercase">
          Trademark
        </div>
        <nav className="mt-1 space-y-1 px-2">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Dashboard
          </NavLink>

          {/* ✅ FIXED APPLICATIONS ROUTE */}
          <NavLink
            to="/user/trademark/applications"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            My Applications
          </NavLink>

          <NavLink
            to="/user/trademark/journal-details"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Journal Details
          </NavLink>

          <NavLink
            to="/user/trademark/hearings"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Hearings
          </NavLink>

          <NavLink
            to="/user/trademark/renewal-details"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Renewal Details
          </NavLink>
        </nav>

        {/* REPORTS */}
        <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
          Reports
        </div>
        <nav className="mt-1 space-y-1 px-2">
          <NavLink
            to="/user/reports/basic-search"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Basic Search
          </NavLink>

          <NavLink
            to="/user/reports/renewal"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Renewal Report
          </NavLink>

          <NavLink
            to="/user/reports/reminder"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Reminder Report
          </NavLink>

          <NavLink
            to="/user/reports/single-query"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Single Query
          </NavLink>
        </nav>

        {/* OPPOSITION */}
        <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
          Opposition
        </div>
        <nav className="mt-1 space-y-1 px-2">
          <NavLink
            to="/user/opposition/details"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Opposition Details
          </NavLink>

          <NavLink
            to="/user/opposition/documents"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Documents
          </NavLink>

          <NavLink
            to="/user/opposition/forms"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Forms
          </NavLink>
        </nav>

        {/* UTILITY */}
        <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
          Utility
        </div>
        <nav className="mt-1 space-y-1 px-2">
          <NavLink
            to="/user/change-password"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Change Password
          </NavLink>
        </nav>
      </div>

      {/* USER MANUAL */}
      <div className="p-4 border-t">
        <a
          href="/user-manual.pdf"
          download
          className="block text-center bg-gray-700 text-white text-sm py-2 rounded hover:bg-gray-800 transition"
        >
          Download User Manual
        </a>
      </div>
    </aside>
  );
};

export default UserSidebar;
