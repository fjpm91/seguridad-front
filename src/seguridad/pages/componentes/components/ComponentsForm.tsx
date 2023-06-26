import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { BackendResponse, Componente } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

export const ComponentsForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { control, register, setValue, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getComponentById();
  }, []);

  const getComponentById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.COMPONENTES}/${id}`
    );

    if (!data) return;
    const componenteData = data.data as Componente;
    setValue("componente_id", componenteData.componente_id);
    setValue("nombre", componenteData.nombre);
    setValue("habilitado", componenteData.habilitado === 1 ? true : false);
  };

  const store = async (formData: any) => {
    const datos = { ...formData };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}`,
        {
          ...datos,
          user: user?.id,
          codigo_app: import.meta.env.VITE_CODIGO_APP,
        }
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }
      if (!data.success) {
        showMessage(data.message);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/componentes");
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/componentes");
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/componentes");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
  };

  const submitForm = (event: any) => {
    if (id === "0") {
      store(event);
    } else {
      update(event);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <Container sx={{ p: 0 }}>
        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{
            backgroundColor: "white",
            p: 4, // 4 * 8
            borderRadius: 2, // 4 * 4
          }}
        >
          {/* Formulario */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Titulo Formulario */}
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="div"
                sx={{ flexGrow: 1, mb: 2 }}
              >
                Formulario de Componentes
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("componente_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre")}
                label="Nombre"
                defaultValue="xxx"
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Habilitado */}
            <Grid item xs={12} sm={4} md={3} sx={{ pr: "16px" }}>
              <Controller
                name="habilitado"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value || false}
                      />
                    }
                    label="habilitado"
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Grid container spacing={2}>
            <Grid item>
              <Button size="medium" variant="contained" type="submit">
                Guardar
              </Button>
            </Grid>

            <Grid item>
              <Button size="medium" variant="outlined" onClick={cancel}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={toastMessage}
      ></Snackbar>
    </Box>
  );
};
