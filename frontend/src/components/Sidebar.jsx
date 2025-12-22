import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "relative block px-4 py-2 rounded text-sm transition-all";
const linkInactive =
  "text-gray-700 hover:bg-blue-50 hover:text-[#3E4A8A]";
const linkActive =
  "bg-blue-50 text-[#3E4A8A] font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3E4A8A]";

const Sidebar = ({ role }) => {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="h-14 flex items-center px-4 font-semibold text-[#3E4A8A] border-b bg-white">
        {role === "admin" ? "IPMS – Admin Panel" : "IPMS – User Panel"}
      </div>

      {/* ===== SCROLL AREA ===== */}
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
            <Section title="Setups">
              <Item to="/admin/setups/add-user">Add User</Item>
              <Item to="/admin/setups/country">Country</Item>
              <Item to="/admin/setups/city">City</Item>
              <Item to="/admin/setups/class">Class</Item>
              <Item to="/admin/setups/business-type">Business Type</Item>
              <Item to="/admin/setups/file-status">File Status</Item>
              <Item to="/admin/setups/tm-forms">TM Forms</Item>
              <Item to="/admin/setups/agent-registration">Agent Registration</Item>
              <Item to="/admin/setups/agent-list-tm">Agent List TM</Item>
              <Item to="/admin/setups/customer-registration">Customer Registration</Item>
              <Item to="/admin/setups/customer-list-tm">Customer List TM</Item>
            </Section>

            {/* TRADEMARK */}
            <Section title="Trademark">
              <Item to="/admin/trademark/applications">Application Details</Item>
              <Item to="/admin/trademark/hearings">Hearings</Item>
              <Item to="/admin/trademark/journal-details">Journal Details</Item>
              <Item to="/admin/trademark/renewal-details">Renewal Details</Item>
              <Item to="/admin/trademark/tm-form-entries">TM Form Entries</Item>
              <Item to="/admin/trademark/documents">TM Documents</Item>
            </Section>

            {/* OPPOSITION */}
            <Section title="Opposition">
              <Item to="/admin/opposition/documents">Opposition Documents</Item>
              <Item to="/admin/opposition/form-entries">Opposition Form Entries</Item>
              <Item to="/admin/opposition/report">Opposition Report</Item>
              <Item to="/admin/opposition/reminder-report">Opposition Reminder Report</Item>
              <Item to="/admin/opposition/single-query">Opposition Single Query</Item>
            </Section>

            {/* REPORTS */}
            <Section title="Reports">
              <Item to="/admin/reports/basic-search">Basic Search</Item>
              <Item to="/admin/reports/reminder">Reminder Report</Item>
              <Item to="/admin/reports/renewal">Renewal Report</Item>
              <Item to="/admin/reports/single-query">Single Query</Item>
            </Section>

            {/* UTILITY */}
            <Section title="Utility">
              <Item to="/admin/change-password">Change Password</Item>
              <Item to="/admin/date-setup">Date Setup</Item>
              <Item to="/admin/logo-setup">Logo Setup</Item>
            </Section>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <Section title="Trademark">
              <Item to="/user/dashboard">Dashboard</Item>
              <Item to="/user/trademark/applications">My Applications</Item>
              <Item to="/user/trademark/journal-details">Journal Details</Item>
              <Item to="/user/trademark/hearings">Hearings</Item>
              <Item to="/user/trademark/renewal-details">Renewals</Item>
              <Item to="/user/trademark/tm-forms">TM Forms</Item>
            </Section>

            <Section title="Utility">
              <Item to="/user/change-password">Change Password</Item>
            </Section>
          </>
        )}
      </div>
    </aside>
  );
};

/* ===== REUSABLE COMPONENTS ===== */

const Section = ({ title, children }) => (
  <>
    <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
      {title}
    </div>
    <nav className="mt-1 space-y-1 px-2">{children}</nav>
  </>
);

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${isActive ? linkActive : linkInactive}`
    }
  >
    {children}
  </NavLink>
);

export default Sidebar;
