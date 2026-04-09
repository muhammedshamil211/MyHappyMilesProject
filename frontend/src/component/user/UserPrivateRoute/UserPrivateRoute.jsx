import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";

export default function UserPrivateRoute({ children }) {

  const { setLogin } = useContext(LoginContext);
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      setLogin(true);
    }
  }, [user, setLogin]);

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Prevent admin from accessing user routes directly as specified in the rules
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
