import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= GUARDS ================= */
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import AgentRoutes from "./routes/AgentRoutes";

/* ================= AUTH ================= */
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* ================= LAYOUTS ================= */
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import AgentLayout from "./layout/AgentLayout";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/Admin/Dashboard";

/* ===== ADMIN → SETUPS ===== */
import AddUser from "./pages/Admin/setups/AddUser";
import AgentListTM from "./pages/Admin/setups/AgentListTM";
import AgentRegistration from "./pages/Admin/setups/AgentRegistration";
import BusinessTypeSetup from "./pages/Admin/setups/BusinessTypeSetup";
import CitySetup from "./pages/Admin/setups/CitySetup";
import ClassSetup from "./pages/Admin/setups/ClassSetup";
import CountrySetup from "./pages/Admin/setups/CountrySetup";
import CustomerRegistration from "./pages/Admin/setups/CustomerRegistration";
import FileStatusSetup from "./pages/Admin/setups/FileStatusSetup";
import TMFormsSetup from "./pages/Admin/setups/TMFormsSetup";
import CustomerListTM from "./pages/Admin/setups/CustomerListTM";

/* ===== ADMIN → TRADEMARK ===== */
import ApplicationDetails from "./pages/Admin/trademark/ApplicationDetails";
import Hearing from "./pages/Admin/trademark/Hearing";
import JournalDetails from "./pages/Admin/trademark/JournalDetails";
import RenewalDetails from "./pages/Admin/trademark/RenewalDetails";
import TMFormEntries from "./pages/Admin/trademark/TMFormEntries";
import TMDocuments from "./pages/Admin/trademark/TMDocuments";

/* ===== ADMIN → REPORTS ===== */
import BasicSearchReport from "./pages/Admin/trademark/BasicSearchReport";
import TMSingleQuery from "./pages/Admin/trademark/TMSingleQuery";
import TMReminderReport from "./pages/Admin/trademark/TMReminderReport";
import TMRenewalReport from "./pages/Admin/trademark/TMRenewalReport";

/* ===== ADMIN → OPPOSITION ===== */
import OppositionDocuments from "./pages/Admin/opposition/OppositionDocuments";
import OppositionFormEntries from "./pages/Admin/opposition/OppositionFormEntries";
import OppositionReport from "./pages/Admin/opposition/OppositionReport";
import OppositionReminderReport from "./pages/Admin/opposition/OppositionReminderReport";
import OppositionSingleQuery from "./pages/Admin/opposition/OppositionSingleQuery";

/* ===== ADMIN → JOURNAL ===== */
import CompareJournal from "./pages/Admin/TradeMarkJournal/CompareJournal";
import MonthlyJournal from "./pages/Admin/TradeMarkJournal/MonthlyJournal";
import SearchManualJournal from "./pages/Admin/TradeMarkJournal/SearchManualJournal";

/* ===== ADMIN → UTILITY ===== */
import ChangePassword from "./pages/Admin/Utility/ChangePassword";
import DateSetup from "./pages/Admin/Utility/DateSetup";
import LogoSetup from "./pages/Admin/Utility/LogoSetup";

/* ================= USER ================= */
import UserDashboard from "./pages/User/Dashboard";
import UserChangePassword from "./pages/User/Utility/ChangePassword";

/* USER → TRADEMARK */
import UserApplicationDetails from "./pages/User/Trademark/ApplicationDetails";
import UserHearings from "./pages/User/Trademark/Hearings";
import UserJournalDetails from "./pages/User/Trademark/JournalDetails";
import UserRenewalDetails from "./pages/User/Trademark/RenewalDetails";
import TMForms from "./pages/User/Trademark/TMForms";
import UserTMDocuments from "./pages/User/Trademark/TMDocuments";

/* USER → JOURNAL */
import MonthlyEntries from "./pages/User/Journal/MonthlyEntries";
import UserCompareJournal from "./pages/User/Journal/CompareJournal";
import ManualSearch from "./pages/User/Journal/ManualSearch";

/* USER → OPPOSITION */
import UserOppositionDocuments from "./pages/User/Opposition/Documents";
import UserOppositionReport from "./pages/User/Opposition/Reports";

/* USER → REPORTS */
import UserBasicSearch from "./pages/User/Reports/BasicSearch";
import UserReminderReport from "./pages/User/Reports/ReminderReport";
import UserRenewalReport from "./pages/User/Reports/RenewalReport";
import UserSingleQuery from "./pages/User/Reports/SingleQuery";

/* ================= AGENT ================= */
import AgentDashboard from "./pages/Agent/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* SETUPS */}
            <Route path="setups/add-user" element={<AddUser />} />
            <Route path="setups/agent-list-tm" element={<AgentListTM />} />
            <Route path="setups/agent-registration" element={<AgentRegistration />} />
            <Route path="setups/business-type" element={<BusinessTypeSetup />} />
            <Route path="setups/city" element={<CitySetup />} />
            <Route path="setups/class" element={<ClassSetup />} />
            <Route path="setups/country" element={<CountrySetup />} />
            <Route path="setups/customer-registration" element={<CustomerRegistration />} />
            <Route path="setups/file-status" element={<FileStatusSetup />} />
            <Route path="setups/tm-forms" element={<TMFormsSetup />} />
            <Route path="setups/customer-list-tm" element={<CustomerListTM />} />

            {/* TRADEMARK */}
            <Route path="trademark/applications" element={<ApplicationDetails />} />
            <Route path="trademark/hearings" element={<Hearing />} />
            <Route path="trademark/journal-details" element={<JournalDetails />} />
            <Route path="trademark/renewal-details" element={<RenewalDetails />} />
            <Route path="trademark/tm-form-entries" element={<TMFormEntries />} />
            <Route path="trademark/documents" element={<TMDocuments />} />

            {/* REPORTS */}
            <Route path="reports/basic-search" element={<BasicSearchReport />} />
            <Route path="reports/reminder" element={<TMReminderReport />} />
            <Route path="reports/renewal" element={<TMRenewalReport />} />
            <Route path="reports/single-query" element={<TMSingleQuery />} />

            {/* OPPOSITION */}
            <Route path="opposition/documents" element={<OppositionDocuments />} />
            <Route path="opposition/form-entries" element={<OppositionFormEntries />} />
            <Route path="opposition/report" element={<OppositionReport />} />
            <Route path="opposition/reminder-report" element={<OppositionReminderReport />} />
            <Route path="opposition/single-query" element={<OppositionSingleQuery />} />

            {/* JOURNAL */}
            <Route path="journal/compare" element={<CompareJournal />} />
            <Route path="journal/monthly" element={<MonthlyJournal />} />
            <Route path="journal/search-manual" element={<SearchManualJournal />} />

            {/* UTILITY */}
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="date-setup" element={<DateSetup />} />
            <Route path="logo-setup" element={<LogoSetup />} />
          </Route>
        </Route>

        {/* ================= USER ================= */}
        <Route path="/user" element={<UserRoutes />}>
          <Route element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />

            {/* TRADEMARK */}
            <Route path="trademark/applications" element={<UserApplicationDetails />} />
            <Route path="trademark/hearings" element={<UserHearings />} />
            <Route path="trademark/journal-details" element={<UserJournalDetails />} />
            <Route path="trademark/renewal-details" element={<UserRenewalDetails />} />
            <Route path="trademark/tm-forms" element={<TMForms />} />
            <Route path="trademark/documents" element={<UserTMDocuments />} />

            {/* JOURNAL */}
            <Route path="journal/monthly-entries" element={<MonthlyEntries />} />
            <Route path="journal/compare" element={<UserCompareJournal />} />
            <Route path="journal/search-manual" element={<ManualSearch />} />

            {/* OPPOSITION */}
            <Route path="opposition/documents" element={<UserOppositionDocuments />} />
            <Route path="opposition/report" element={<UserOppositionReport />} />

            {/* REPORTS */}
            <Route path="reports/basic-search" element={<UserBasicSearch />} />
            <Route path="reports/reminder" element={<UserReminderReport />} />
            <Route path="reports/renewal" element={<UserRenewalReport />} />
            <Route path="reports/single-query" element={<UserSingleQuery />} />

            {/* UTILITY */}
            <Route path="change-password" element={<UserChangePassword />} />
          </Route>
        </Route>

        {/* ================= AGENT ================= */}
        <Route path="/agent" element={<AgentRoutes />}>
          <Route element={<AgentLayout />}>
            <Route path="dashboard" element={<AgentDashboard />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
