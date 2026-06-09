// src/App.jsx — REVISED
// Changes made:
//  1. Wrapped everything in <AuthProvider> (from our new AuthContext)
//  2. Added /dashboard/admin route → EMRSAdminDashboard
//  3. Changed /dashboard/emrs route → SchoolEMRSWrapper (instead of raw EMRSForm)
//  4. Kept ALL your existing routes 100% intact
//  5. Your existing ProtectedRoute (Redux/JWT) still works for non-EMRS pages

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ── Existing auth pages ──────────────────────────────────────
import SignInPage from "./pages/auth/login/login";
import SignUpPage from "./pages/auth/signup";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import AdminSignInPage from "./pages/auth/admin/login";

// ── Existing layout & pages ──────────────────────────────────
import DashboardLayout from "./pages/layouts/DashboardLayout";
import NewApplication from "./pages/NewApplication";
import AlreadyApplied from "./pages/submitted-application/AlreadyApplied";
import AssetApplied from "./pages/AssetApplied";
import AssetForm from "./pages/assetManagementForm/index";
import HomePage from "./pages/home/homepage";

// ── Existing protected route (keep as-is for non-EMRS routes) ─
import ProtectedRoute from "./pages/routes/protected-routes";
import ReduxDevTools from "./components/ReduxDevTools";

// ── NEW: EMRS auth system ─────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import EMRSProtectedRoute from "./components/ProtectedRoute";
import SchoolEMRSWrapper from "./pages/EMRS/SchoolEMRSWrapper";
import EMRSAdminDashboard from "./pages/EMRS/EMRSAdminDashboard";

// ── NEW: EMRS login page ─────────────────────────────────────
// This is the NEW login/index.jsx we created.
// Your existing login/login.jsx (SignInPage) stays untouched.
import EMRSLoginPage from "./pages/auth/login/index";

function App() {
  return (
    // Wrap everything in AuthProvider so all components can access
    // the logged-in school/admin user via useAuth()
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>
          {/* ── HOME PAGE ──────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />

          {/* ── EXISTING AUTH PAGES (unchanged) ───────────── */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/admin/signin" element={<AdminSignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── NEW: EMRS Portal Login ─────────────────────
              Separate from your main /signin.
              Schools and admin visit /emrs/login to log in.
              URL: http://localhost:5173/emrs/login           */}
          <Route path="/emrs/login" element={<EMRSLoginPage />} />

          {/* ── NEW: EMRS Admin Dashboard ──────────────────
              Only accessible after logging in via /emrs/login
              with role = "admin"                             */}
          <Route
            path="/dashboard/admin"
            element={
              <EMRSProtectedRoute allowedRoles={["admin"]}>
                <EMRSAdminDashboard />
              </EMRSProtectedRoute>
            }
          />

          {/* ── EXISTING PROTECTED DASHBOARD ──────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="new" element={<NewApplication />} />

            {/* Already applied pages */}
            <Route path="applied" element={<AlreadyApplied />} />
            <Route path="applied/emrs" element={<AlreadyApplied />} />
            <Route path="applied/assets" element={<AssetApplied />} />

            {/* ── CHANGED: /dashboard/emrs now uses SchoolEMRSWrapper ──
                SchoolEMRSWrapper renders your existing EMRSForm BUT:
                  • Shows school name banner at top
                  • Pre-fills school identity fields from login
                  • Saves submissions keyed by school code
                Schools must first log in at /emrs/login              */}
            <Route
              path="emrs"
              element={
                <EMRSProtectedRoute allowedRoles={["school"]}>
                  <SchoolEMRSWrapper />
                </EMRSProtectedRoute>
              }
            />

            <Route path="assets" element={<AssetForm />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ReduxDevTools />
    </AuthProvider>
  );
}

export default App;