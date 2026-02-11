import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // routing
import SignInPage from "./pages/auth/login/login";
import SignUpPage from "./pages/auth/signup";
import ForgotPasswordPage from './pages/auth/forgotPassword';
import AssetForm from "./pages/assetManagementForm";
import Deshboard from "./pages/deskboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Login /> */}

      {/* Routing syntax  */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/amf" element={<AssetForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
