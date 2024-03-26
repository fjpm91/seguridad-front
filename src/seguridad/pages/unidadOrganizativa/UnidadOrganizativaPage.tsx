import { Container, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import {
  BackendResponse,
  UnidadOrganizativa,
} from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { PageBox, PageTitle } from "../../../components";
import useAutorizado from "../../../hooks/useAutorizado";
import { UnidadOrganizativaTable } from ".";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UnidadOrganizativaPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [unidadesOrganizativas, setUnidadesOrganizativas] = useState<
    UnidadOrganizativa[]
  >([]);
  const { accesos } = authState;
  const navigate = useNavigate();
  const { allowed: allowInsert } = useAutorizado(
    ModulosSistema.UNIDADES_ORGANIZATIVAS + TipoAcceso.INSERT,
    accesos
  );
  const { allowed: allowUpdate } = useAutorizado(
    ModulosSistema.UNIDADES_ORGANIZATIVAS + TipoAcceso.UPDATE,
    accesos
  );

  useEffect(() => {
    getUnidadesOrganizativas();
  }, []);

  const getUnidadesOrganizativas = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    setUnidadesOrganizativas([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}/${id}`);
  };

  // const handleHabilitar = async (id: number) => {
  //   const unidadSeleccionada = unidadesOrganizativas.find(
  //     (unidad) => unidad.id === id
  //   );
  //   if (!unidadSeleccionada) return;

  //   try {
  //     const datos = {
  //       user: user?.id,
  //       codigo_app: import.meta.env.VITE_CODIGO_APP,
  //     };
  //     const { data } = await apiClient.put<BackendResponse>(
  //       `/${ApiEndpoints.HABILITAR_ROLES}/${id}`,
  //       { ...datos }
  //     );

  //     if (!data) {
  //       showMessage(Messages.NO_SE_PUDO_COMPLETAR);
  //       return;
  //     }

  //     if (!data.success) {
  //       showMessage(data.message);
  //       return;
  //     }

  //     const unidadModificada = data.data as UnidadNegocio;
  //     const newAplicaciones = unidadesOrganizativas.map((unidad) => {
  //       if (unidad.id === unidadModificada.id) {
  //         unidad.habilitado = unidadModificada.habilitado;
  //       }
  //       return unidad;
  //     });
  //     showMessage(data.message);
  //     setUnidadesOrganizativas(newAplicaciones);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Unidades Organizativas" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mt: 2, mb: 2 }}
          >
            Nueva Unidad Organizativa
          </Button>
        )}

        {unidadesOrganizativas && (
          <UnidadOrganizativaTable
            allowUpdate={allowUpdate}
            unidades={unidadesOrganizativas}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
