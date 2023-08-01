import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Modulo } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { ModuloTable } from "./components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ModulosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const { accesos, user } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    getModulos();
  }, []);

  const getModulos = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.MODULOS}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setModulos([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.MODULOS}/${id}`);
  };

  const handleHabilitar = async (id: number) => {
    const moduloSeleccionado = modulos.find(
      (modulo) => modulo.modulo_id === id
    );
    if (!moduloSeleccionado) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_MODULOS}/${id}`,
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

      const modulosModificado = data.data as Modulo;
      const newModulo = modulos.map((modulo) => {
        if (modulo.modulo_id === modulosModificado.modulo_id) {
          modulo.habilitado = modulosModificado.habilitado;
        }
        return modulo;
      });
      showMessage(data.message);
      setModulos(newModulo);
    } catch (error) {
      console.log(error);
    }
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
          Modulos
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) =>
            acceso.nombre === ModulosSistema.MODULOS + TipoAcceso.INSERT
        ) ? (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Modulo
          </Button>
        ) : null}

        {modulos ? (
          <ModuloTable
            accesos={accesos}
            modulos={modulos}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        ) : null}
      </Container>
    </Box>
  );
};
