import { Container, Button } from "@mui/material";
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
import { PageBox, PageTitle } from "../../../components";
import useAutorizado from "../../../hooks/useAutorizado";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UnidadNegocioPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [unidadesNegocio, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
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
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Unidades de Negocio" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mt: 2, mb: 2 }}
          >
            Nueva Unidad de Negocio
          </Button>
        )}

        {unidadesNegocio && (
          <UnidadNegocioTable
            allowUpdate={allowUpdate}
            unidades={unidadesNegocio}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
