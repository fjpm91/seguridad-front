import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Bitacora } from "../../../interfaces/interfaces";
import { ApiEndpoints } from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { Box, Container, Divider, Snackbar, Typography } from "@mui/material";
import { BitacoraTable } from ".";

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
    <Box sx={{ backgroundColor: "grey.100", height: "100%", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Registro de Actividades
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {bitacoras ? (
          <BitacoraTable accesos={accesos} bitacoras={bitacoras} />
        ) : null}
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={message}
      ></Snackbar>
    </Box>
  );
};
