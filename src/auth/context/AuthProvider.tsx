import { useReducer } from "react";
import { AppAuthState, AuthContext } from "./AuthContext";
import { authReducer } from "../../auth";
import {
  Aplicacion,
  Cargo,
  Modulo,
  Persona,
  Rol,
  RolAcceso,
  User,
} from "../../interfaces/interfaces";
import { StorageKeys } from "../../models/enums";

// Forma del State -> auth context
// const initialState: AppAuthState = {
//   accesos: null,
//   aplicacion: null,
//   modulos: [],
//   rol: null,
//   token: "",
//   user: null,
//   persona: null,
// };

interface Props {
  children: JSX.Element | JSX.Element[];
}

// Funcion que inicializa el state
const init = () => {
  const accesos = JSON.parse(localStorage.getItem(StorageKeys.ACCESOS) || "[]");
  const aplicacion = JSON.parse(
    localStorage.getItem(StorageKeys.APLICACION) || "{}"
  );
  const modulos = JSON.parse(localStorage.getItem(StorageKeys.MODULOS) || "[]");
  const persona = JSON.parse(localStorage.getItem(StorageKeys.PERSONA) || "{}");
  const rol = JSON.parse(localStorage.getItem(StorageKeys.ROL) || "{}");
  const cargo = JSON.parse(localStorage.getItem(StorageKeys.CARGO) || "{}");
  const user = JSON.parse(localStorage.getItem(StorageKeys.USER) || "{}");
  const storageToken = localStorage.getItem(StorageKeys.USER_TOKEN);
  const logged = JSON.parse(
    localStorage.getItem(StorageKeys.LOGGED) || "false"
  );
  const token = storageToken ? storageToken : "";
  const open = false;

  return {
    accesos,
    aplicacion,
    modulos,
    persona,
    open,
    rol,
    user,
    token,
    logged,
    cargo,
  };
};

export const AuthProvider = ({ children }: Props) => {
  const [authState, dispatch] = useReducer(
    authReducer,
    {} as AppAuthState,
    init
  );

  // type AuthContextProps -> auth context
  const login = (
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
  ) => {
    dispatch({
      type: "[AUTH] login",
      payload: {
        accesos,
        aplicacion,
        cargo,
        logged,
        modulos,
        open,
        persona,
        rol,
        token,
        user,
      },
    });
  };

  const toggle = (open: boolean) => {
    dispatch({
      type: "[AUTH] toggle",
      payload: {
        open,
      },
    });
  };

  // type AuthContextProps -> auth context
  const logout = () => {
    dispatch({ type: "[AUTH] logout" });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, toggle }}>
      {children}
    </AuthContext.Provider>
  );
};
