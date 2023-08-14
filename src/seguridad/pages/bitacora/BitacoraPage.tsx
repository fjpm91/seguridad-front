import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Bitacora } from "../../../interfaces/interfaces";
import { ApiEndpoints } from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { Box, Container, Snackbar } from "@mui/material";
import { BitacoraTable } from ".";
import { PageBox, PageTitle } from "../../../components";

export const BitacoraPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([]);
  const { accesos } = authState;

  useEffect(() => {
    getBitacoras();
  }, []);

  const getBitacoras = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.BITACORA}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setBitacoras([...data.data]);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Registro de Actividades" />

        {bitacoras && (
          <Box mt={2}>
            <BitacoraTable accesos={accesos} bitacoras={bitacoras} />
          </Box>
        )}
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={message}
      ></Snackbar>
    </PageBox>
  );
};
