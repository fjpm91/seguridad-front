import { useContext } from "react";
import { AuthContext } from "../auth";

interface Props {
  children: any;
}

export const PublicRoute = ({ children }: Props) => {
  const { authState } = useContext(AuthContext);
  const { logged } = authState;

  return !logged ? children : null;
};
