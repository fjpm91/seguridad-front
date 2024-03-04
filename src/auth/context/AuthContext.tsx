import { createContext } from "react";
import {
  Aplicacion,
  Cargo,
  Modulo,
  Persona,
  Rol,
  RolAcceso,
  User,
} from "../../interfaces/interfaces";

export interface AppAuthState {
  accesos: RolAcceso[] | null;
  aplicacion?: Aplicacion | null;
  cargo: Cargo | null;
  logged: boolean;
  modulos?: Modulo[] | null;
  open: boolean;
  persona: Persona | null;
  rol?: Rol | null;
  token: string;
  user: User | null;
}

// Props del context
export type AuthContextProps = {
  authState: AppAuthState;
  login: (
    accesos: RolAcceso[],
    aplicacion: Aplicacion,
    modulos: Modulo[],
    open: boolean,
    persona: Persona,
    rol: Rol,
    token: string,
    user: User,
    logged: boolean,
    cargo: Cargo
  ) => void;
  logout: () => void;
  toggle: (open: boolean) => void;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);
