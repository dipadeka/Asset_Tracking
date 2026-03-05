import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignInPage from "./pages/auth/login/login";
import SignUpPage from "./pages/auth/signup";
import ForgotPasswordPage from "./pages/auth/forgotPassword";

import DashboardLayout from "./pages/DashboardLayout";
import NewApplication from "./pages/NewApplication";
import AlreadyApplied from "./pages/submitted-application/AlreadyApplied";
import EMRSForm from "./pages/EMRSForm";

function App() {


  return (
    <>
      {/* <Login /> */}

      {/* Routing syntax  */}
      <BrowserRouter>
        <Routes>

          {/* AUTH PAGES */}
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/*  DASHBOARD WITH SIDEBAR + TOPBAR */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route path="new" element={<NewApplication />} />
            <Route path="applied" element={<AlreadyApplied />} />
            <Route path="EMRS" element={<EMRSForm />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
