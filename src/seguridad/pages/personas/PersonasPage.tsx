import { Box, Button, Container } from "@mui/material";
import { useAuth } from "../../../auth/context/useAuth";
import { useEffect, useState } from "react";
import { BackendResponse, Persona } from "../../../interfaces/interfaces";
import apiClient from "../../../services/api-client";
import {
  ApiEndpoints,
  ModulosSistema,
  TipoAcceso,
} from "../../../models/enums";
import { PersonasTable } from ".";
import { ModalImportarPersonas } from "./components/ModalImportarPersonas";
import { useNavigate } from "react-router-dom";
import useAutorizado from "../../../hooks/useAutorizado";
import { PageBox, PageTitle } from "../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const PersonasPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { accesos, user } = authState;
  const [show, setShow] = useState(false);
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
    getPersonas();
  }, []);

  const getPersonas = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setPersonas([...data.data]);
  };

  const handleOpen = (id: number) => {
    navigate(`/personas/${id}`);
  };

  const handleOpenCentroCosto = (id: number) => {
    navigate(`/${ApiEndpoints.PERSONAS_CENTROS_COSTO}/${id}`);
  };

  const handleOpenModal = () => {
    setShow(true);
  };

  const handleHabilitar = async (id: number) => {
    try {
      const datos = {
        user: user?.id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.HABILITAR_PERSONAS}/${id}`,
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

      const personaModificada = data.data as Persona;
      const newUsers = personas.map((persona) => {
        if (persona.persona_id === personaModificada.persona_id) {
          persona.habilitado = personaModificada.habilitado;
        }
        return persona;
      });
      showMessage(data.message);
      setPersonas(newUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleExportar = async (personaId: number, nombrePersona: string) => {
    try {
      const query = `ids[]=${encodeURIComponent(personaId)}`;
      const response = await apiClient.get<Blob>(
        `/${ApiEndpoints.EXPORTAR_PERSONAS_JSON}?${query}`,
        { responseType: "blob" }
      );
      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      const nombreArchivo = nombrePersona
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, "-") || `persona-${personaId}`;
      link.download = `${nombreArchivo}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      showMessage("No se pudieron exportar las personas");
    } finally {
    }
  };

  return (
    <PageBox>
      <Container maxWidth="xl">
        <PageTitle title="Personas" divider={true} />

        {allowInsert && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleOpen(0)}
              sx={{ mb: 2, mr: 2 }}
            >
              Nueva Persona
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleOpenModal()}
              sx={{ mb: 2 }}
            >
              Importar Personas
            </Button>
          </Box>
        )}

        {personas && (
          <PersonasTable
            allowUpdate={allowUpdate}
            personas={personas}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
            handleOpenCC={handleOpenCentroCosto}
            allowExport={allowInsert}
            handleExportar={handleExportar}
          />
        )}
      </Container>

      <ModalImportarPersonas
        open={show}
        onClose={handleCloseModal}
        onSuccess={() => { getPersonas(); handleCloseModal(); }}
      />
    </PageBox>
  );
};
