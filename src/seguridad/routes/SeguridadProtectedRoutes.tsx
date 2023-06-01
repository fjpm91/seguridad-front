import { useContext } from "react";
import { AuthContext } from "../../auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface Props {
  url: string;
}

export const SeguridadProtectedRoutes = ({ url }: Props) => {
  const { authState } = useContext(AuthContext);
  const { accesos } = authState;
  const location = useLocation();

  return accesos?.find((acceso) => acceso.nombre === url) ? (
    <Outlet />
  ) : authState.user ? (
    <Navigate to="/inicio" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
