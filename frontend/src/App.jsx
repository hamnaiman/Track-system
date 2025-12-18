import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== Guards ===== */
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import AgentRoutes from "./routes/AgentRoutes";

/* ===== Auth ===== */
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* ===== Admin ===== */
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";

/* ===== User Layout ===== */
import UserLayout from "./layout/UserLayout";

/* ===== User Pages ===== */
import UserDashboard from "./pages/User/Dashboard";
import ChangePassword from "./pages/User/Utility/ChangePassword";

/* ===== User → Trademark ===== */
import UserApplicationDetails from "./pages/User/Trademark/ApplicationDetails";
import UserHearings from "./pages/User/Trademark/Hearings";
import UserJournalDetails from "./pages/User/Trademark/JournalDetails";
import UserRenewalDetails from "./pages/User/Trademark/RenewalDetails";

/* ===== Agent ===== */
import AgentDashboard from "./pages/Agent/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN ================= */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* ================= USER ================= */}
        <Route element={<UserRoutes />}>
          <Route path="/user" element={<UserLayout />}>

            {/* Dashboard */}
            <Route path="dashboard" element={<UserDashboard />} />

            {/* TRADEMARK */}
            <Route
              path="trademark/applications"
              element={<UserApplicationDetails />}
            />
            <Route
              path="trademark/hearings"
              element={<UserHearings />}
            />
            <Route
              path="trademark/journal-details"
              element={<UserJournalDetails />}
            />
            <Route
              path="trademark/renewal-details"
              element={<UserRenewalDetails />}
            />

            {/* UTILITY */}
            <Route
              path="change-password"
              element={<ChangePassword />}
            />

          </Route>
        </Route>

        {/* ================= AGENT ================= */}
        <Route element={<AgentRoutes />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;
