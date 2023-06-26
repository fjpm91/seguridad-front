import {
  Box,
  Container,
  Typography,
  Divider,
  Button,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import {
  Componente,
  BackendResponse,
  RolAsignacion,
} from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { RolAsignacionTable } from ".";

export const RolAsignacionPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rolAsignaciones, setRolAsignaciones] = useState<RolAsignacion[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;

  useEffect(() => {
    getRolAsignacion();
  }, []);

  const getRolAsignacion = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROL_ASIGNACION}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setRolAsignaciones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/rol-asignacion/${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleHabilitar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_ROL_ASIGNACION}/${id}`,
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

      const componenteModificado = data.data as Componente;
      const newComponentes = rolAsignaciones.map((componente) => {
        if (componente.componente_id === componenteModificado.componente_id) {
          componente.habilitado = componenteModificado.habilitado;
        }
        return componente;
      });
      showMessage(data.message);
      setRolAsignaciones(newComponentes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROL_ASIGNACION}/${id}`,
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

      showMessage(data.message);
      getRolAsignacion();
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        minHeight: "calc(100vh - 64px)",
        padding: "1rem",
      }}
    >
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Rol Asignacion
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) =>
            acceso.nombre === ModulosSistema.COMPONENTES + TipoAcceso.INSERT
        ) ? (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Rol Asignacion
          </Button>
        ) : null}

        {rolAsignaciones ? (
          <RolAsignacionTable
            accesos={accesos}
            rolAsignaciones={rolAsignaciones}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleEliminar={handleEliminar}
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
  );
};
