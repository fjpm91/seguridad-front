import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import apiClient from "../../../services/api-client";
import { useAuth } from "../../../auth/context/useAuth";
import { Aplicacion, BackendResponse } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { AplicacionTable } from "./components";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const AplicacionesPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;
  const { allowed: allowInsert } = useAutorizado(
    ModulosSistema.PERSONAS + TipoAcceso.INSERT,
    accesos
  );
  const { allowed: allowUpdate } = useAutorizado(
    ModulosSistema.PERSONAS + TipoAcceso.UPDATE,
    accesos
  );

  useEffect(() => {
    getAplicaciones();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
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

  const handleHabilitar = async (id: number) => {
    const appSeleccionada = aplicaciones.find(
      (app) => app.aplicacion_id === id
    );
    if (!appSeleccionada) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
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
      showMessage(JSON.stringify(error));
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Aplicaciones" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nueva Aplicacion
          </Button>
        )}

        {aplicaciones && (
          <AplicacionTable
            allowUpdate={allowUpdate}
            aplicaciones={aplicaciones}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
