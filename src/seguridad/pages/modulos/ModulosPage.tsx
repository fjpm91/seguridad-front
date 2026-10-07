import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { BackendResponse, Modulo } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  Messages,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { Button, Container } from "@mui/material";
import { ModalImportarModulos, ModuloTable } from "./components";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ModulosPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [filtroAplicaciones, setFiltroAplicaciones] = useState<string[]>([]);
  const [openImportar, setOpenImportar] = useState(false);
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
    getModulos();
  }, []);

  const getModulos = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.MODULOS}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setModulos([...data.data]);
    const apps = (data.data as Modulo[]).map((p) => p.aplicacion.codigo);
    if (apps) setFiltroAplicaciones([...new Set(apps)]);
  };

  const handleOpen = (id: number) => {
    navigate(`/${ApiEndpoints.MODULOS}/${id}`);
  };

  const handleExportar = async (modulo: Modulo) => {
    try {
      const response = await apiClient.get<Blob>(
        `/${ApiEndpoints.MODULOS_TRANSFERENCIA_EXPORTAR}/${modulo.modulo_id}`,
        { responseType: "blob" }
      );
      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getFilename(response.headers["content-disposition"], modulo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      showMessage("No se pudo exportar la configuración del módulo");
    }
  };

  const getFilename = (contentDisposition: string | undefined, modulo: Modulo) => {
    const filenameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8''|\\")?([^;\\"]+)/i);
    return filenameMatch?.[1] || `modulo-${modulo.modulo_id}.json`;
  };

  const handleHabilitar = async (id: number) => {
    const moduloSeleccionado = modulos.find(
      (modulo) => modulo.modulo_id === id
    );
    if (!moduloSeleccionado) return;

    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_MODULOS}/${id}`,
        { ...datos }
      );

      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      const modulosModificado = data.data as Modulo;
      const newModulo = modulos.map((modulo) => {
        if (modulo.modulo_id === modulosModificado.modulo_id) {
          modulo.habilitado = modulosModificado.habilitado;
        }
        return modulo;
      });
      showMessage(data.message);
      setModulos(newModulo);
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
        <PageTitle title="Modulos" divider={true} />

        {allowInsert && (
          <Button
            variant="contained"
            onClick={() => handleOpen(0)}
            sx={{ mb: 2 }}
          >
            Nuevo Modulo
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={() => setOpenImportar(true)}
          sx={{ mb: 2, ml: { sm: 2 } }}
        >
          Importar módulos
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/modulos/exportar")}
          sx={{ mb: 2, ml: { sm: 2 } }}
        >
          Exportar módulos
        </Button>

        {modulos && (
          <ModuloTable
            filtroAplicaciones={filtroAplicaciones}
            allowUpdate={allowUpdate}
            modulos={modulos}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleExportar={handleExportar}
          />
        )}
      </Container>
      <ModalImportarModulos
        open={openImportar}
        userId={user?.id}
        onClose={() => setOpenImportar(false)}
        onSuccess={async (message) => {
          setOpenImportar(false);
          showMessage(message);
          await getModulos();
        }}
      />
    </PageBox>
  );
};
