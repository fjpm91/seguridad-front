import { Box, Container, Typography, Divider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Division } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { DivisionTable } from ".";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const DivisionPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const { accesos } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    getDivisiones();
  }, []);

  const getDivisiones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.DIVISIONES}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    setDivisiones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.DIVISIONES}/${id}`);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: { xs: "calc(100vh - 56x)", sm: "calc(100vh - 64px)" },
        padding: "1rem",
      }}
    >
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Divisiones
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) =>
            acceso.nombre === ModulosSistema.DIVISIONES + TipoAcceso.INSERT
        ) ? (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mt: 2, mb: 2 }}
          >
            Nueva Division
          </Button>
        ) : null}

        {divisiones ? (
          <DivisionTable
            accesos={accesos}
            divisiones={divisiones}
            // handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        ) : null}
      </Container>
    </Box>
  );
};
