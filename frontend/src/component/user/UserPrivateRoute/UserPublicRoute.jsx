import { Navigate, useLocation } from "react-router-dom";

export default function UserPublicRoute({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Prevent admin from accessing public user routes
  if (user && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Allow everyone else (guests, normal users)
  return children;
}
