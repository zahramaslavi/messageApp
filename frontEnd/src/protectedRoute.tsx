import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./contexts/authContext";

const ProtectedRoute = () => {
  const { state } = useAuthContext();

  return !state.checkingAuth && !state.isAuthenticated  ?  <Navigate to={"/login"} /> : <Outlet />;
}

export default ProtectedRoute;