import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store/hooks";
import type { RuoloUtente } from "@/interfaces/auth";

interface ProtectedRouteProps {
  ruoliConsentiti?: RuoloUtente[];
}

function ProtectedRoute({ ruoliConsentiti }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, utente } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !utente) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (ruoliConsentiti && !ruoliConsentiti.includes(utente.ruolo)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
