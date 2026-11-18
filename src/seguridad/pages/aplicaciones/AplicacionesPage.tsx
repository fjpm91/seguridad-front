import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../../../services/api-client";
import { useAuth } from "../../../auth/context/useAuth";
import { Aplicacion, BackendResponse } from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { AplicacionTable } from "./components";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const AplicacionesPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [aplicacionParaCredencial, setAplicacionParaCredencial] =
    useState<Aplicacion | null>(null);
  const [credential, setCredential] = useState("");
  const [generandoCredencial, setGenerandoCredencial] = useState(false);
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
    getAplicaciones();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setAplicaciones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/aplicaciones/${id}`);
  };

  const handleHabilitar = async (id: number) => {
    const appSeleccionada = aplicaciones.find(
      (app) => app.aplicacion_id === id
    );
    if (!appSeleccionada) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/aplicaciones/habilitar/${appSeleccionada?.aplicacion_id}`,
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

      const appModificada = data.data as Aplicacion;
      const newAplicaciones = aplicaciones.map((app) => {
        if (app.aplicacion_id === appModificada.aplicacion_id) {
          app.habilitado = appModificada.habilitado;
        }
        return app;
      });
      showMessage(data.message);
      setAplicaciones(newAplicaciones);
    } catch (error) {
      console.log(error);
      showMessage(JSON.stringify(error));
    }
  };

  const handleGenerarCredencial = (id: number) => {
    const aplicacion = aplicaciones.find(
      (app) => app.aplicacion_id === id
    );
    if (aplicacion) setAplicacionParaCredencial(aplicacion);
  };

  const generarCredencial = async () => {
    if (!aplicacionParaCredencial) return;

    try {
      setGenerandoCredencial(true);
      const { data } = await apiClient.post<{ data: { credential: string } }>(
        `/aplicaciones/${aplicacionParaCredencial.aplicacion_id}/generar-credencial`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            Accept: "application/json",
          },
        }
      );

      if (!data?.data?.credential) {
        showMessage("La respuesta no contiene una credencial válida");
        return;
      }

      setCredential(data.data.credential);
      setAplicacionParaCredencial(null);
    } catch (error: any) {
      showMessage(
        error?.response?.data?.message || "No se pudo generar la credencial"
      );
    } finally {
      setGenerandoCredencial(false);
    }
  };

  const copiarCredencial = async () => {
    await navigator.clipboard.writeText(credential);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Aplicaciones" />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nueva Aplicacion
          </Button>
        )}

        {aplicaciones && (
          <AplicacionTable
            allowUpdate={allowUpdate}
            aplicaciones={aplicaciones}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleGenerarCredencial={handleGenerarCredencial}
          />
        )}
      </Container>

      <Dialog
        open={Boolean(aplicacionParaCredencial)}
        onClose={() => !generandoCredencial && setAplicacionParaCredencial(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Generar credencial</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas generar una nueva credencial para la aplicación{" "}
            <strong>{aplicacionParaCredencial?.nombre}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            La credencial actual dejará de ser válida.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAplicacionParaCredencial(null)}
            disabled={generandoCredencial}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => void generarCredencial()}
            disabled={generandoCredencial}
          >
            {generandoCredencial && <CircularProgress size={18} sx={{ mr: 1 }} />}
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(credential)} onClose={() => setCredential("")} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6 }}>
          Credencial generada
          <IconButton
            aria-label="Cerrar"
            onClick={() => setCredential("")}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField value={credential} fullWidth InputProps={{ readOnly: true }} />
            <Typography variant="body2" color="text.secondary">
              Esta credencial solo se mostrará una vez.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={() => void copiarCredencial()}
          >
            Copiar
          </Button>
        </DialogActions>
      </Dialog>
    </PageBox>
  );
};
