import {
  Box,
  Button,
  Container,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
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

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const PersonasPage = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { accesos, user } = authState;
  const [show, setShow] = useState(false);

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
    console.log("🚀 ~ file: PersonasPage.tsx:53 ~ handleOpen ~ id:", id);
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

  return (
    <Box sx={{ backgroundColor: "grey.100", height: "100%", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Personas
        </Typography>
        <Divider />

        {accesos?.some(
          (acceso) =>
            acceso.nombre === ModulosSistema.USUARIOS + TipoAcceso.INSERT
        ) ? (
          <>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleOpen(0)}
                sx={{ mb: 2 }}
              >
                Importar Personas
              </Button>
            </Box>
          </>
        ) : null}

        {personas ? (
          <PersonasTable
            accesos={accesos}
            personas={personas}
            handleHabilitar={handleHabilitar}
            handleOpen={handleOpen}
          />
        ) : null}
      </Container>

      <Modal
        disableEnforceFocus
        open={show}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalImportarPersonas />
      </Modal>
    </Box>
  );
};
