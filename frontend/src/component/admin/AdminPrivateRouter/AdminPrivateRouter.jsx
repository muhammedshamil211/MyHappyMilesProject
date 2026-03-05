import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";

export default function AdminPrivateRouter({ children }) {

  const { setLogin } = useContext(LoginContext);
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      setLogin(true);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
