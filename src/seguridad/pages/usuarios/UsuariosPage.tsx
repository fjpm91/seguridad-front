import { Box, Button, Container } from "@mui/material";
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
import { PageBox, PageTitle } from "../../../components";
import useAutorizado from "../../../hooks/useAutorizado";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UsuariosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
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
    navigate(`/${ApiEndpoints.USERS}/${id}`);
  };

  const handleOpenUsuarioRol = (id: number) => {
    navigate(`/${ApiEndpoints.USUARIO_ROL}/${id ? id : 0}`);
  };

  const handleOpenUsuarioRolBase = () => {
    navigate("/" + ApiEndpoints.USUARIO_ROL_BASE);
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
    <PageBox>
      <Container maxWidth="xl">
        <PageTitle title="Usuarios" divider={true} />

        <Box>
          {allowInsert && (
            <Button
              variant="contained"
              onClick={() => handleOpen(0)}
              sx={{ mb: 2 }}
            >
              Nuevo Usuario
            </Button>
          )}

          {allowUpdate && (
            <>
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
            </>
          )}
        </Box>

        {users ? (
          <UsersTable
            allowUpdate={allowUpdate}
            users={users}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        ) : null}
      </Container>
    </PageBox>
  );
};
