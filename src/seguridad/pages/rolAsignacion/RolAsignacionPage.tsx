import {
  Box,
  Container,
  Typography,
  Divider,
  Button,
  Snackbar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import {
  Componente,
  BackendResponse,
  RolAsignacion,
  Aplicacion,
} from "../../../interfaces/interfaces";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import apiClient from "../../../services/api-client";
import { RolAsignacionTable } from ".";

export const RolAsignacionPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [aplicacionSeleccionada, setAplicacionSeleccionada] =
    useState<string>("0");
  const [rolAsignaciones, setRolAsignaciones] = useState<RolAsignacion[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;

  useEffect(() => {
    getAplicaciones();
    getRolAsignacion();
  }, []);

  const getRolAsignacion = async (aplicacion_id?: string) => {
    const fullRoute =
      aplicacion_id && aplicacion_id !== "0"
        ? `/${ApiEndpoints.ROL_ASIGNACION}?aplicacion-id=${aplicacion_id}`
        : `/${ApiEndpoints.ROL_ASIGNACION}`;
    const { data } = await apiClient.get<BackendResponse>(fullRoute);

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setRolAsignaciones([...data.data]);
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES_CON_ROLES}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setAplicaciones([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/rol-asignacion/${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleHabilitar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_ROL_ASIGNACION}/${id}`,
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

      const componenteModificado = data.data as Componente;
      const newComponentes = rolAsignaciones.map((componente) => {
        if (componente.componente_id === componenteModificado.componente_id) {
          componente.habilitado = componenteModificado.habilitado;
        }
        return componente;
      });
      showMessage(data.message);
      setRolAsignaciones(newComponentes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROL_ASIGNACION}/${id}`,
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

      showMessage(data.message);
      getRolAsignacion();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAplicacionSeleccionada(event.target.value);
    getRolAsignacion(event.target.value);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        minHeight: "calc(100vh - 64px)",
        padding: "1rem",
      }}
    >
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Rol Asignacion
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) =>
            acceso.nombre === ModulosSistema.COMPONENTES + TipoAcceso.INSERT
        ) ? (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2, mt: 2 }}
          >
            Nuevo Rol Asignacion
          </Button>
        ) : null}

        {/* Aplicación */}
        {/* <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3} sx={{ pr: "16px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Aplicación</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={aplicacionSeleccionada}
                label="Aplicación"
                onChange={handleChange}
              >
                <MenuItem value={0} key={0}>
                  Seleccionar
                </MenuItem>
                {aplicaciones.map((aplicacion) => (
                  <MenuItem
                    value={aplicacion.aplicacion_id}
                    key={aplicacion.aplicacion_id}
                  >
                    {aplicacion.codigo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid> */}

        {rolAsignaciones ? (
          <RolAsignacionTable
            accesos={accesos}
            rolAsignaciones={rolAsignaciones}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleEliminar={handleEliminar}
          />
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
