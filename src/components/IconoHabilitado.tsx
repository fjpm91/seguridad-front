import { Close, Done } from "@mui/icons-material";

interface IconoProps {
  habilitado: number;
}

export const IconoHabilitado = ({ habilitado }: IconoProps) => {
  return habilitado === 1 ? <Close /> : <Done />;
};
