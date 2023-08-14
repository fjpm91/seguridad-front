import { Container, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Division } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { DivisionTable } from ".";
import { PageBox, PageTitle } from "../../../components";
import useAutorizado from "../../../hooks/useAutorizado";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const DivisionPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const { accesos } = authState;
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
    getDivisiones();
  }, []);

  const getDivisiones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.DIVISIONES}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    setDivisiones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.DIVISIONES}/${id}`);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Divisiones" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mt: 2, mb: 2 }}
          >
            Nueva Division
          </Button>
        )}

        {divisiones && (
          <DivisionTable
            allowUpdate={allowUpdate}
            divisiones={divisiones}
            handleOpen={handleOpen}
          />
        )}
      </Container>
    </PageBox>
  );
};
