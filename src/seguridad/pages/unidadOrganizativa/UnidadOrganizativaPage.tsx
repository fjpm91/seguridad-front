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
  const [filtroDivisiones, setFiltroDivisiones] = useState<string[]>([]);

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
    const divisiones = (data.data as UnidadOrganizativa[])
      .map((unidad) => unidad.division_nombre ?? "")
      .filter((x) => x !== null && x !== "");
    setFiltroDivisiones([...new Set(divisiones)]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}/${id}`);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Unidades Organizativas" divider={true} />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2 }}
          >
            Nueva Unidad Organizativa
          </Button>
        )}

        {unidadesOrganizativas && (
          <UnidadOrganizativaTable
            allowUpdate={allowUpdate}
            filtroDivisiones={filtroDivisiones}
            unidades={unidadesOrganizativas}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
