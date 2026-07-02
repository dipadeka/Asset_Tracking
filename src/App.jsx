// src/App.jsx — REVISED FOR CLEAN WORKFLOW
// Workflow:
// - Homepage (/)
//   ├─→ EMRS Portal: /emrs/login → EMRS Dashboard → EMRSForm
//   └─→ Asset Portal: /asset/login → Asset Dashboard → AssetForm

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ── Home ──────────────────────────────────────────────────────
import HomePage from "./pages/home/homepage";

// ── EMRS Portal ───────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import EMRSLoginPage from "./pages/auth/login/index";
import EMRSProtectedRoute from "./components/ProtectedRoute";
import EMRSDashboard from "./pages/layouts/EMRSDashboardLayout";
import SchoolEMRSWrapper from "./pages/EMRS/SchoolEMRSWrapper";
import EMRSAdminDashboard from "./pages/EMRS/EMRSAdminDashboard";
import EMRSApplied from "./pages/submitted-application/EMRSApplied";
import MonthlyActivity from "./pages/EMRS/MonthlyActivity"; // NEW — Attendance + Operational Cost

// ── Asset Portal ──────────────────────────────────────────────
import AssetLoginPage from "./pages/auth/login/login";
import AssetProtectedRoute from "./pages/routes/protected-routes";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import AssetForm from "./pages/assetManagementForm/index";
import NewApplication from "./pages/NewApplication";
import AssetApplied from "./pages/AssetApplied";

import ReduxDevTools from "./components/ReduxDevTools";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          {/* ════════════════════════════════════════════════════════════
              ── HOME PAGE ──
          ════════════════════════════════════════════════════════════ */}
          <Route path="/" element={<HomePage />} />

          {/* ════════════════════════════════════════════════════════════
              ── EMRS PORTAL (/emrs/*)
              Separate login system for schools/EMRS admin
              Shows ONLY EMRS forms and submissions
          ════════════════════════════════════════════════════════════ */}
          <Route path="/emrs/login" element={<EMRSLoginPage />} />
          
          <Route
            path="/emrs"
            element={
              <EMRSProtectedRoute allowedRoles={["school", "admin"]}>
                <EMRSDashboard />
              </EMRSProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SchoolEMRSWrapper />} />
            <Route path="submitted" element={<EMRSApplied />} />
            <Route path="monthly-activity" element={<MonthlyActivity />} /> {/* NEW */}
          </Route>
          
          <Route
            path="/emrs/admin"
            element={
              <EMRSProtectedRoute allowedRoles={["admin"]}>
                <EMRSAdminDashboard />
              </EMRSProtectedRoute>
            }
          />

          {/* ════════════════════════════════════════════════════════════
              ── ASSET PORTAL (/asset/*)
              Separate login system for asset managers
              Shows ONLY Asset forms and submissions (NO EMRS)
          ════════════════════════════════════════════════════════════ */}
          <Route path="/asset/login" element={<AssetLoginPage />} />
          
          <Route
            path="/asset/dashboard"
            element={
              <AssetProtectedRoute>
                <DashboardLayout />
              </AssetProtectedRoute>
            }
          >
            <Route path="new" element={<NewApplication />} />
            <Route path="applied" element={<Navigate to="/asset/dashboard/applied/assets" replace />} />
            <Route path="applied/assets" element={<AssetApplied />} />
            <Route path="form" element={<AssetForm />} />
          </Route>

          {/* ════════════════════════════════════════════════════════════
              ── LEGACY ROUTES (kept for backwards compatibility)
          ════════════════════════════════════════════════════════════ */}
          <Route path="/signin" element={<Navigate to="/asset/login" replace />} />
          <Route path="/admin/signin" element={<Navigate to="/emrs/login" replace />} />

          {/* ════════════════════════════════════════════════════════════
              ── CATCH ALL ──
          ════════════════════════════════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ReduxDevTools />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;