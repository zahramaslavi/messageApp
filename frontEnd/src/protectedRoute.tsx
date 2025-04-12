import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./contexts/authContext";

const ProtectedRoute = () => {
  const { authState } = useAuthContext();

  return !authState.checkingAuth && !authState.isAuthenticated  ?  <Navigate to={"/login"} /> : <Outlet />;
}

export default ProtectedRoute;