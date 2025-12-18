import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  let menuItems = [];

  if (role === "admin") {
    menuItems = [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Countries", path: "/admin/country" },
      { name: "Cities", path: "/admin/city" },
      { name: "Users", path: "/admin/add-user" },
      { name: "Applications", path: "/admin/application-details" },
      { name: "Hearings", path: "/admin/hearings" },
      { name: "Reports", path: "/admin/basic-search" }
    ];
  }

  if (role === "user") {
    menuItems = [
      { name: "Dashboard", path: "/user/dashboard" },
      { name: "Journal", path: "/user/journal" },
      { name: "Reports", path: "/user/reports" },
      { name: "Opposition", path: "/user/opposition" },
      { name: "Change Password", path: "/user/change-password" }
    ];
  }

  return (
    <aside className="w-64 h-screen bg-gray-200 border-r overflow-y-auto">
      <div className="p-4 font-bold text-lg bg-gray-300">
        {role === "admin" ? "Admin Panel" : "User Panel"}
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium ${
                isActive
                  ? "bg-gray-500 text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        {/* USER MANUAL */}
        {role === "user" && (
          <a
            href="/user-manual.pdf"
            download
            className="block mt-4 px-3 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm"
          >
            📥 Download User Manual
          </a>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
