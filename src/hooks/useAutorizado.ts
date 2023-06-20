import { RolAcceso } from "../interfaces/interfaces";

const useAutorizado = (nombreModulo: string, accesos?: RolAcceso[] | null) => {
  if (!accesos || accesos?.length === 0) return { allowed: false };
  const allowed = accesos?.some((acceso) => acceso.nombre === nombreModulo);
  return { allowed };
};

export default useAutorizado;
