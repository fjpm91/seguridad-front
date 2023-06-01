import { Aplicacion } from "../interfaces/interfaces";
import useArrayData from "./useArrayData";

export const useAplicaciones = (url: string) => useArrayData<Aplicacion>(url);
