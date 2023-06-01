import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Snackbar, Typography } from "@mui/material";
import apiClient from "../../../services/api-client";
import { useAuth } from "../../../auth/context/useAuth";
import { Aplicacion, BackendResponse } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { AplicacionTable } from "./components";

export const AplicacionesPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;

  useEffect(() => {
    getAplicaciones();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CRUD_APLICACIONES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setAplicaciones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/aplicaciones/${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleHabilitar = async (id: number) => {
    const appSeleccionada = aplicaciones.find(
      (app) => app.aplicacion_id === id
    );
    if (!appSeleccionada) return;

    try {
      const datos = {
        user: user?.id,
        codigo: appSeleccionada?.codigo,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/aplicaciones/habilitar/${appSeleccionada?.aplicacion_id}`,
        datos
      );

      if (!data) {
        showMessage("No se pudo completar la operación");
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      const appModificada = data.data as Aplicacion;
      const newAplicaciones = aplicaciones.map((app) => {
        if (app.aplicacion_id === appModificada.aplicacion_id) {
          app.habilitado = appModificada.habilitado;
        }
        return app;
      });
      showMessage(data.message);
      setAplicaciones(newAplicaciones);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "grey.100",
          height: "100vh",
          padding: "1rem",
        }}
      >
        <Container>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, mb: 2 }}>
            Aplicaciones
          </Typography>

          {accesos?.some(
            (acceso) =>
              acceso.nombre === ModulosSistema.APLICACIONES + TipoAcceso.INSERT
          ) ? (
            <Button
              variant="contained"
              onClick={() => handleOpen(0)}
              sx={{ mb: 2 }}
            >
              Nueva Aplicacion
            </Button>
          ) : null}

          {aplicaciones ? (
            <AplicacionTable
              accesos={accesos}
              aplicaciones={aplicaciones}
              handleHabilitar={handleHabilitar}
              handleOpen={handleOpen}
            />
          ) : null}
        </Container>

        <Snackbar
          open={open}
          autoHideDuration={1500}
          onClose={() => handleClose()}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          message={message}
        ></Snackbar>
      </Box>
    </>
  );
};
