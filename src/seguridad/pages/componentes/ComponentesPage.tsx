import { Button, Container } from "@mui/material";
import { useAuth } from "../../../auth/context/useAuth";
import { useEffect, useState } from "react";
import { BackendResponse, Componente } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { ComponentsTable } from ".";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ComponentesPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [componentes, setComponentes] = useState<Componente[]>([]);
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
    getComponentes();
  }, []);

  const getComponentes = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.COMPONENTES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setComponentes([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/componentes/${id}`);
  };

  const handleAsignar = (id: number) => {
    navigate(`/rol-asignacion/${id}`);
  };

  const handleHabilitar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_COMPONENTES}/${id}`,
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
      const newComponentes = componentes.map((componente) => {
        if (componente.componente_id === componenteModificado.componente_id) {
          componente.habilitado = componenteModificado.habilitado;
        }
        return componente;
      });
      showMessage(data.message);
      setComponentes(newComponentes);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Componentes" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Componente
          </Button>
        )}

        {componentes && (
          <ComponentsTable
            allowUpdate={allowUpdate}
            componentes={componentes}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleAsignar={handleAsignar}
          />
        )}
      </Container>
    </PageBox>
  );
};
