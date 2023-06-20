import {
  Box,
  Button,
  Container,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../auth/context/useAuth";
import { useEffect, useState } from "react";
import { BackendResponse, User } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { UsersTable } from ".";

export const UsuariosPage = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.USERS}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setUsers([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/users/${id}`);
  };

  const handleOpenUsuarioRol = (id: number) => {
    navigate(`/usuario-rol/${id ? id : 0}`);
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
        `/${ApiEndpoints.HABILITAR_USERS}/${id}`,
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

      const userModificado = data.data as User;
      const newUsers = users.map((user) => {
        if (user.id === userModificado.id) {
          user.habilitado = userModificado.habilitado;
        }
        return user;
      });
      showMessage(data.message);
      setUsers(newUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "grey.100",
          height: "100vh",
          padding: "1rem",
        }}
      >
        <Container>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Usuarios
          </Typography>
          <Divider />

          {accesos?.some(
            (acceso) =>
              acceso.nombre === ModulosSistema.USUARIOS + TipoAcceso.INSERT
          ) ? (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleOpen(0)}
                sx={{ mb: 2 }}
              >
                Nuevo Usuario
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleOpenUsuarioRol(0)}
                sx={{ mb: 2, ml: 1 }}
              >
                Asignar Usuario Rol
              </Button>
            </Box>
          ) : null}

          {users ? (
            <UsersTable
              accesos={accesos}
              users={users}
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
    </>
  );
};
