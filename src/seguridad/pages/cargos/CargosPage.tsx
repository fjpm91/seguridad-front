import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import apiClient from "../../../services/api-client";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Cargo } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";
import { CargoTable } from ".";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const CargosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const navigate = useNavigate();
  const { accesos } = authState;
  const { allowed: allowInsert } = useAutorizado(
    ModulosSistema.CARGOS + TipoAcceso.INSERT,
    accesos
  );
  const { allowed: allowUpdate } = useAutorizado(
    ModulosSistema.CARGOS + TipoAcceso.UPDATE,
    accesos
  );

  useEffect(() => {
    getAplicaciones();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CARGOS}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setCargos([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.CARGOS}/${id}`);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Cargos" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Cargo
          </Button>
        )}

        {cargos && (
          <CargoTable
            allowUpdate={allowUpdate}
            cargos={cargos}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
