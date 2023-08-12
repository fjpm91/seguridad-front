import { Box, Button, Container, Divider, Typography } from "@mui/material";
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

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UsuariosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
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

  const handleOpenUsuarioRolBase = () => {
    navigate(`/usuario-rol-base`);
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
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "grey.100",
          minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          pt: { xs: "64px", md: "72px" },
          px: { md: 2 },
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

              <Button
                variant="outlined"
                onClick={() => handleOpenUsuarioRolBase()}
                sx={{ mb: 2, ml: 1 }}
              >
                Asignar Rol Base
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
      </Box>
    </>
  );
};
