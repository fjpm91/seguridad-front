import { Box, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import { PageBox, PageTitle } from "../../../components";
import useAutorizado from "../../../hooks/useAutorizado";
import { BackendResponse, CentroCosto } from "../../../interfaces/interfaces";
import {
  ModulosSistema,
  TipoAcceso,
  ApiEndpoints,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { CentrosCostoTable } from ".";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const CentrosCostoPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const { accesos } = authState;
  const navigate = useNavigate();
  const { allowed: allowInsert } = useAutorizado(
    ModulosSistema.CENTROS_COSTO + TipoAcceso.INSERT,
    accesos
  );
  const { allowed: allowUpdate } = useAutorizado(
    ModulosSistema.CENTROS_COSTO + TipoAcceso.UPDATE,
    accesos
  );

  useEffect(() => {
    getCentrosCosto();
  }, []);

  const getCentrosCosto = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CENTROS_COSTO}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setCentrosCosto([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.CENTROS_COSTO}/${id}`);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container maxWidth="xl">
        <PageTitle title="Centros de Costo" />

        {allowInsert && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleOpen(0)}
              sx={{ mb: 2, mr: 2 }}
            >
              Nuevo Centro Costo
            </Button>
          </Box>
        )}

        {centrosCosto && (
          <CentrosCostoTable
            allowUpdate={allowUpdate}
            centros={centrosCosto}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
