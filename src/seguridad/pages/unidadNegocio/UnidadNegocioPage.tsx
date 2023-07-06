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
import { BackendResponse, UnidadNegocio } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { UnidadNegocioTable } from ".";

export const UnidadNegocioPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [unidadesNegocio, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const { accesos, user } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    getUnidadesNegocio();
  }, []);

  const getUnidadesNegocio = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDAD_NEGOCIO}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    setUnidadesNegocio([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.UNIDAD_NEGOCIO}/${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleHabilitar = async (id: number) => {
    const unidadSeleccionada = unidadesNegocio.find(
      (unidad) => unidad.unidad_negocio_id === id
    );
    if (!unidadSeleccionada) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_ROLES}/${id}`,
        { ...datos }
      );

      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      const unidadModificada = data.data as UnidadNegocio;
      const newAplicaciones = unidadesNegocio.map((unidad) => {
        if (unidad.unidad_negocio_id === unidadModificada.unidad_negocio_id) {
          unidad.habilitado = unidadModificada.habilitado;
        }
        return unidad;
      });
      showMessage(data.message);
      setUnidadesNegocio(newAplicaciones);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: "grey.50", height: "100vh", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Unidades de Negocio
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) => acceso.nombre === ModulosSistema.ROLES + TipoAcceso.INSERT
        ) ? (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mt: 2, mb: 2 }}
          >
            Nueva Unidad de Negocio
          </Button>
        ) : null}

        {unidadesNegocio ? (
          <UnidadNegocioTable
            accesos={accesos}
            unidades={unidadesNegocio}
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
  );
};
