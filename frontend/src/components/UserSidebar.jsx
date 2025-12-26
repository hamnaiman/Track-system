import React from "react";
import { NavLink } from "react-router-dom";

/* ===== THEME (SAME AS ADMIN) ===== */
const linkBase =
  "relative block px-4 py-2 rounded text-sm transition-all";
const linkInactive =
  "text-gray-700 hover:bg-blue-50 hover:text-[#3E4A8A]";
const linkActive =
  "bg-blue-50 text-[#3E4A8A] font-semibold " +
  "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3E4A8A]";

/* ===== PERMISSION CHECK ===== */
const hasPermission = (perm) => {
  try {
    const permissions =
      JSON.parse(localStorage.getItem("permissions")) || [];
    return permissions.includes(perm);
  } catch {
    return false;
  }
};

const UserSidebar = ({ closeSidebar }) => {
  const canViewOpposition = hasPermission("view");

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="h-14 flex items-center px-4 font-semibold text-[#3E4A8A] border-b">
        IPMS – User Panel
      </div>

      {/* ===== SCROLL AREA ===== */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* ===== TRADEMARK ===== */}
        <Section title="Trademark">
          <Item to="/user/dashboard" onClick={closeSidebar}>
            Dashboard
          </Item>
          <Item to="/user/trademark/applications" onClick={closeSidebar}>
            My Applications
          </Item>
          <Item to="/user/trademark/journal-details" onClick={closeSidebar}>
            Journal Details
          </Item>
          <Item to="/user/journal/monthly-entries" onClick={closeSidebar}>
            Monthly Journal Entries
          </Item>
          <Item to="/user/journal/compare" onClick={closeSidebar}>
            Compare with Journal
          </Item>
          <Item to="/user/journal/search-manual" onClick={closeSidebar}>
            Manual Journal Search
          </Item>
          <Item to="/user/trademark/hearings" onClick={closeSidebar}>
            Hearings
          </Item>
          <Item to="/user/trademark/renewal-details" onClick={closeSidebar}>
            Renewal Details
          </Item>
          <Item to="/user/trademark/tm-forms" onClick={closeSidebar}>
            TM Forms
          </Item>
          <Item to="/user/trademark/documents" onClick={closeSidebar}>
            TM Documents
          </Item>
        </Section>

        {/* ===== OPPOSITION ===== */}
        {canViewOpposition && (
          <Section title="Opposition">
            <Item to="/user/opposition/documents" onClick={closeSidebar}>
              Opposition Documents
            </Item>
            <Item to="/user/opposition/form-entries" onClick={closeSidebar}>
              Opposition Form Entries
            </Item>
          </Section>
        )}

        {/* ===== REPORTS ===== */}
        <Section title="Reports">
          <Item to="/user/reports/basic-search" onClick={closeSidebar}>
            Basic Search
          </Item>
          <Item to="/user/reports/renewal" onClick={closeSidebar}>
            Renewal Report
          </Item>
          <Item to="/user/reports/reminder" onClick={closeSidebar}>
            Reminder Report
          </Item>
          <Item to="/user/reports/single-query" onClick={closeSidebar}>
            Single Query
          </Item>
        </Section>

        {/* ===== UTILITY ===== */}
        <Section title="Utility">
          <Item to="/user/change-password" onClick={closeSidebar}>
            Change Password
          </Item>
        </Section>

      </div>

      {/* ===== FOOTER ===== */}
      <div className="p-4 border-t">
        <a
          href="/user-manual.pdf"
          download
          className="block text-center bg-[#3E4A8A] text-white text-sm py-2 rounded hover:bg-[#2f3970] transition"
        >
          Download User Manual
        </a>
      </div>

    </aside>
  );
};

/* ===== REUSABLE COMPONENTS (SAME AS ADMIN) ===== */

const Section = ({ title, children }) => (
  <>
    <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">
      {title}
    </div>
    <nav className="mt-1 space-y-1 px-2">{children}</nav>
  </>
);

const Item = ({ to, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `${linkBase} ${isActive ? linkActive : linkInactive}`
    }
  >
    {children}
  </NavLink>
);

export default UserSidebar;
