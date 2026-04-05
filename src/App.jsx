import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignInPage from "./pages/auth/login/login";
import SignUpPage from "./pages/auth/signup";
import ForgotPasswordPage from "./pages/auth/forgotPassword";

import AdminSignInPage from "./pages/auth/admin/login";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import NewApplication from "./pages/NewApplication";
import AlreadyApplied from "./pages/submitted-application/AlreadyApplied";
import EMRSForm from "./pages/EMRS/EMRSForm";
import AssetForm from "./pages/assetManagementForm/index";   
import HomePage from "./pages/home/homepage";                   

import ProtectedRoute from "./pages/routes/protected-routes";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>

          {/* ── HOME PAGE ── */}
          <Route path="/" element={<HomePage />} />            

          {/* ── AUTH PAGES ── */}
          <Route path="/signin"           element={<SignInPage />} />
          <Route path="/admin/signin"     element={<AdminSignInPage />} />
          <Route path="/signup"           element={<SignUpPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />

          {/* ── PROTECTED DASHBOARD ── */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="new"    element={<NewApplication />} />
            <Route path="applied" element={<AlreadyApplied />} />
            <Route path="EMRS"   element={<EMRSForm />} />
            <Route path="assets" element={<AssetForm />} />   
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
