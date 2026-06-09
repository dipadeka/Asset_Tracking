import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  const { user: emrsUser } = useAuth();

  if (!token && !emrsUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}