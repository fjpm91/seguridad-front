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
import { Button, Container } from "@mui/material";
import { ModuloTable } from "./components";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ModulosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [filtroAplicaciones, setFiltroAplicaciones] = useState<string[]>([]);
  const { accesos, user } = authState;
  const navigate = useNavigate();
  const { allowed: allowInsert } = useAutorizado(
    ModulosSistema.PERSONAS + TipoAcceso.INSERT,
    accesos
  );
  const { allowed: allowUpdate } = useAutorizado(
    ModulosSistema.PERSONAS + TipoAcceso.UPDATE,
    accesos
  );

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
    const apps = (data.data as Modulo[]).map((p) => p.aplicacion.codigo);
    if (apps) setFiltroAplicaciones([...new Set(apps)]);
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
    <PageBox>
      <Container>
        <PageTitle title="Modulos" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Modulo
          </Button>
        )}

        {modulos && (
          <ModuloTable
            filtroAplicaciones={filtroAplicaciones}
            allowUpdate={allowUpdate}
            modulos={modulos}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
