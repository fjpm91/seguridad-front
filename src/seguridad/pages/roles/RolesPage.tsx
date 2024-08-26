import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Rol } from "../../../interfaces/interfaces";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { RolTable } from "./components";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const RolesPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [filtroAplicaciones, setFiltroAplicaciones] = useState<string[]>([]);
  const { accesos, user } = authState;
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
    const apps = (data.data as Rol[]).map((p) => p.aplicacion.codigo);
    if (apps) setFiltroAplicaciones([...new Set(apps)]);
    setRoles([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.ROLES}/${id}`);
  };

  const handleNavegarPermisos = (id: number) => {
    navigate(`/accesos/${id}`);
  };

  const handleHabilitar = async (id: number) => {
    const rolSeleccionado = roles.find((rol) => rol.rol_id === id);
    if (!rolSeleccionado) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_ROLES}/${id}`,
        { ...datos }
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
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <PageBox>
      <Container>
        <PageTitle title="Roles" divider={true} />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2 }}
          >
            Nuevo Rol
          </Button>
        )}

        {roles && (
          <RolTable
            allowUpdate={allowUpdate}
            filtroAplicaciones={filtroAplicaciones}
            roles={roles}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleNavegarPermisos={handleNavegarPermisos}
          />
        )}
      </Container>
    </PageBox>
  );
};
