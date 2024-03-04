import { AppAuthState } from ".";
import {
  Aplicacion,
  Cargo,
  Modulo,
  Persona,
  Rol,
  RolAcceso,
  User,
} from "../../interfaces/interfaces";

type AuthAction =
  | {
      type: "[AUTH] login";
      payload: {
        accesos: RolAcceso[];
        aplicacion: Aplicacion;
        cargo: Cargo;
        logged: boolean;
        modulos: Modulo[];
        open: boolean;
        persona: Persona;
        rol: Rol;
        token: string;
        user: User;
      };
    }
  | { type: "[AUTH] logout" }
  | {
      type: "[AUTH] toggle";
      payload: {
        open: boolean;
      };
    };

export const authReducer = (state: AppAuthState, action: AuthAction) => {
  switch (action.type) {
    case "[AUTH] login":
      return {
        ...state, // Todo lo que contenia el state anteriormente
        accesos: action.payload.accesos,
        aplicacion: action.payload.aplicacion,
        modulos: action.payload.modulos,
        open: false,
        persona: action.payload.persona,
        rol: action.payload.rol,
        token: action.payload.token,
        user: action.payload.user,
        logged: true,
        cargo: action.payload.cargo,
      };

    case "[AUTH] logout":
      return {
        ...state, // Todo lo que contenia el state anteriormente
        accesos: [],
        aplicacion: null,
        modulos: [],
        open: false,
        persona: null,
        rol: null,
        user: null,
        cargo: null,
        token: "",
        logged: false,
      };

    case "[AUTH] toggle":
      return {
        ...state,
        open: action.payload.open,
      };

    default:
      return state;
  }
};
