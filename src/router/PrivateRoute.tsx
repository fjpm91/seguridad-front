import { useContext } from "react";
import { AuthContext } from "../auth";
import { Navigate } from "react-router-dom";

interface Props {
  children: any;
}

export const PrivateRoute = ({ children }: Props) => {
  const { authState } = useContext(AuthContext);
  const { logged } = authState;

  return logged ? children : <Navigate to="/login" />;
};
