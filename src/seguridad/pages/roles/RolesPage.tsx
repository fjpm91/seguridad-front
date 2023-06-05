import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Snackbar, Typography } from "@mui/material";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Rol } from "../../../interfaces/interfaces";
import apiClient from "../../../services/api-client";
import { ApiEndpoints, ModulosSistema, TipoAcceso } from "../../../models/enums";
import { RolTable } from "./components";

export const RolesPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState<Rol[]>([]);
  const { accesos, user } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROLES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setRoles([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.ROLES}/${id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleHabilitar = async (id: number) => {
    const rolSeleccionado = roles.find(
      (rol) => rol.rol_id === id
    );
    if (!rolSeleccionado) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_ROLES}/${id}`,
        {...datos}
      );

      if (!data) {
        showMessage("No se pudo completar la operación");
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      const rolModificado = data.data as Rol;
      const newAplicaciones = roles.map((rol) => {
        if (rol.rol_id === rolModificado.rol_id) {
          rol.habilitado = rolModificado.habilitado;
        }
        return rol;
      });
      showMessage(data.message);
      setRoles(newAplicaciones);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: "grey.50", height: "100vh", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Roles
        </Typography>

        
        {accesos?.some(
            (acceso) =>
              acceso.nombre === ModulosSistema.ROLES + TipoAcceso.INSERT
          ) ? (
            <Button
              variant="contained"
              onClick={() => handleOpen(0)}
              sx={{ mb: 2 }}
            >
              Nuevo Rol
            </Button>
          ) : null}

          {roles ? (
            <RolTable
              accesos={accesos}
              roles={roles}
              handleHabilitar={handleHabilitar}
              handleOpen={handleOpen}
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
