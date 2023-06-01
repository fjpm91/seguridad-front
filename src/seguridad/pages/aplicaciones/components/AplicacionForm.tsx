import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import apiClient from "../../../../services/api-client";
import { Aplicacion, BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints } from "../../../../models/enums";
import { useAuth } from "../../../../auth/context/useAuth";

export const AplicacionForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { control, register, setValue, handleSubmit } = useForm();
  const navigate = useNavigate();
  const {user} = authState;

  useEffect(() => {
    getAplicacionById();
  }, []);

  const getAplicacionById = async () => {
    if (!id || id === '0') return;

    const { data } = await apiClient.get<Aplicacion>(
      `/${ApiEndpoints.CRUD_APLICACIONES}/${id}`
    );

    if (!data) return;
    setValue("aplicacion_id", data.aplicacion_id);
    setValue("codigo", data.codigo);
    setValue("version", data.version);
    setValue("habilitado", data.habilitado === 1 ? true : false);
    setValue("nombre", data.nombre);
    setValue("titulo", data.titulo);
    data.area ? setValue("area", data.area) : null;
    data.url ? setValue("url", data.url) : null;
    data.descripcion ? setValue("descripcion", data.descripcion) : null;
    data.base_datos ? setValue("base_datos", data.base_datos) : null;
    data.icono ? setValue("icono", data.icono) : null;
    data.ip_servidor ? setValue("ip_servidor", data.ip_servidor) : null;
  };

  const store = async (formData: any) => {
    const datos = { ...formData };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;
    if (datos.ip_servidor === "...") datos.ip_servidor = null;

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.CRUD_APLICACIONES}`,
        { ...datos, user: user?.id}
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
      setTimeout(() => {
        navigate("/aplicaciones");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const update = async (formData: any) => {
    const datos = { ...formData };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.CRUD_APLICACIONES}/${id}`,
        datos
      );
      if (!data) {
        showMessage("No se pudo completar la operación");
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/aplicaciones");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const cancel = () => navigate("/aplicaciones");

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const submitForm = (event: any) => {
    if (id === "0") {
      store(event);
    } else {
      update(event);
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
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
                Formulario de Aplicaciones
              </Typography>
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("aplicacion_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Codigo */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <TextField
                {...register("codigo", { required: true })}
                required
                label="Codigo"
                helperText="El Código de la Aplicación es obligatorio"
                defaultValue="APP"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Version */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <TextField
                {...register("version", { required: true })}
                required
                label="Version"
                helperText="La Versión de la Aplicación es obligatoria"
                defaultValue="0.0.1"
                sx={{ width: "100%" }}
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

            {/* Nombre */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre", { required: true })}
                required
                label="Nombre"
                helperText="El Nombre de la Aplicación es obligatorio"
                defaultValue="Sistema"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Titulo */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("titulo", { required: true })}
                required
                label="Titulo"
                helperText="El Título de la Aplicación es obligatorio"
                defaultValue="Titulo"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Url */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("url")}
                label="Url"
                defaultValue="..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Descripcion */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("descripcion")}
                label="Descripcion"
                defaultValue="..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Area */}
            <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("area")}
                label="Area"
                defaultValue="..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Base de datos */}
            <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("base_datos")}
                label="Base de Datos"
                defaultValue="..."
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Icono */}
            <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("icono")}
                label="Icono"
                defaultValue="..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Ip servidor */}
            <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("ip_servidor")}
                label="Ip servidor"
                defaultValue="..."
                sx={{ width: "100%", pr: "16px" }}
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
        message={message}
      ></Snackbar>
    </Box>
  );
};
