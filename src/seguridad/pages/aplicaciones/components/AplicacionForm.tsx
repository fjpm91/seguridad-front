import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";
import { Aplicacion, BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const AplicacionForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getAplicacionById();
  }, []);

  const getAplicacionById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Aplicacion>(
      `/${ApiEndpoints.APLICACIONES}/${id}`
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
        `/${ApiEndpoints.APLICACIONES}`,
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
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? 1 : 0,
    };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;
    datos.habilitado ? (datos.habilitado = 1) : (datos.habilitado = 0);

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.APLICACIONES}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const cancel = () => navigate(`/${ApiEndpoints.APLICACIONES}`);

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
    <FormBoxContainer>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{
          backgroundColor: "white",
          p: 2, // 4 * 8
          borderRadius: 2, // 4 * 4
        }}
      >
        {/* Formulario */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Titulo Formulario */}
          <Grid item xs={12}>
            <PageTitle title="Formulario de Aplicaciones" variant="h5" />
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
              {...register("codigo", {
                required: true,
                minLength: { value: 3, message: "error message" },
              })}
              required
              label="Codigo"
              defaultValue="--"
              error={
                errors.codigo?.type === "required" ||
                errors.codigo?.type === "minLength"
                  ? true
                  : false
              }
              onFocus={() =>
                getValues("codigo") === "--" ? setValue("codigo", "") : null
              }
              onBlur={() =>
                getValues("codigo") === "" ? setValue("codigo", "--") : null
              }
              sx={{ width: "100%" }}
            />
            {(errors.codigo?.type === "required" ||
              errors.codigo?.type === "minLength") && (
              <ErrorText text="El Código de la Aplicación debe ser mayor o igual a 3 caracteres" />
            )}
          </Grid>

          {/* Version */}
          <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
            <TextField
              {...register("version", {
                required: true,
                minLength: { value: 5, message: "error message" },
              })}
              required
              label="Version"
              defaultValue="0.0.1"
              error={
                errors.version?.type === "required" ||
                errors.version?.type === "minLength"
                  ? true
                  : false
              }
              onFocus={() =>
                getValues("version") === "--" ? setValue("version", "") : null
              }
              onBlur={() =>
                getValues("version") === "" ? setValue("version", "--") : null
              }
              sx={{ width: "100%" }}
            />
            {(errors.version?.type === "required" ||
              errors.version?.type === "minLength") && (
              <ErrorText text="La Versión de la Aplicación es obligatoria" />
            )}
          </Grid>

          {/* Habilitado */}
          <Grid item xs={12} sm={4} md={3} sx={{ pr: "16px" }}>
            <Controller
              name="habilitado"
              control={control}
              render={({ field }) => (
                <>
                  <FormLabel component="legend">Estado</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value || false}
                        />
                      }
                      label="Habilitado"
                    />
                  </FormGroup>
                </>
              )}
            />
          </Grid>

          {/* Nombre */}
          <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("nombre", {
                required: true,
                minLength: { value: 4, message: "error message" },
              })}
              required
              label="Nombre"
              defaultValue="---"
              error={
                errors.nombre?.type === "required" ||
                errors.nombre?.type === "minLength"
                  ? true
                  : false
              }
              onFocus={() =>
                getValues("nombre") === "---" ? setValue("nombre", "") : null
              }
              onBlur={() =>
                getValues("nombre") === "" ? setValue("nombre", "---") : null
              }
              sx={{ width: "100%" }}
            />
            {errors.codigo?.type === "required" && (
              <ErrorText text="El nombre de la aplicacion es obligatorio" />
            )}
            {errors.codigo?.type === "minLength" && (
              <ErrorText text="El nombre de la aplicacion debe ser mayor a 3 caracteres" />
            )}
          </Grid>

          {/* Titulo */}
          <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("titulo", {
                required: true,
                minLength: { value: 4, message: "error message" },
              })}
              required
              label="Titulo"
              defaultValue="---"
              error={
                errors.titulo?.type === "required" ||
                errors.titulo?.type === "minLength"
                  ? true
                  : false
              }
              onFocus={() =>
                getValues("titulo") === "---" ? setValue("titulo", "") : null
              }
              onBlur={() =>
                getValues("titulo") === "" ? setValue("titulo", "---") : null
              }
              sx={{ width: "100%" }}
            />
            {errors.titulo?.type === "required" && (
              <ErrorText text="El Titulo de la Aplicación es obligatorio" />
            )}
            {errors.titulo?.type === "minLength" && (
              <ErrorText text="El titulo de la aplicacion debe ser mayor a 3 caracteres" />
            )}
          </Grid>

          {/* Url */}
          <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("url")}
              label="Url"
              defaultValue="--"
              onFocus={() =>
                getValues("url") === "--" ? setValue("url", "") : null
              }
              onBlur={() =>
                getValues("url") === "" ? setValue("url", "--") : null
              }
              sx={{ width: "100%" }}
            />
          </Grid>

          {/* Descripcion */}
          <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("descripcion")}
              label="Descripcion"
              defaultValue="--"
              onFocus={() =>
                getValues("descripcion") === "--"
                  ? setValue("descripcion", "")
                  : null
              }
              onBlur={() =>
                getValues("descripcion") === ""
                  ? setValue("descripcion", "--")
                  : null
              }
              sx={{ width: "100%" }}
            />
          </Grid>

          {/* Area */}
          <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("area")}
              label="Area"
              defaultValue="--"
              onFocus={() =>
                getValues("area") === "--" ? setValue("area", "") : null
              }
              onBlur={() =>
                getValues("area") === "" ? setValue("area", "--") : null
              }
              sx={{ width: "100%" }}
            />
          </Grid>

          {/* Base de datos */}
          <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("base_datos")}
              label="Base de Datos"
              defaultValue="--"
              onFocus={() =>
                getValues("base_datos") === "--"
                  ? setValue("base_datos", "")
                  : null
              }
              onBlur={() =>
                getValues("base_datos") === ""
                  ? setValue("base_datos", "--")
                  : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Icono */}
          <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("icono")}
              label="Icono"
              defaultValue="--"
              onFocus={() =>
                getValues("icono") === "--" ? setValue("icono", "") : null
              }
              onBlur={() =>
                getValues("icono") === "" ? setValue("icono", "--") : null
              }
              sx={{ width: "100%" }}
            />
          </Grid>

          {/* Ip servidor */}
          <Grid item xs={12} sm={6} sx={{ pr: "16px" }}>
            <TextField
              {...register("ip_servidor")}
              label="Ip servidor"
              defaultValue="--"
              onFocus={() =>
                getValues("ip_servidor") === "--"
                  ? setValue("ip_servidor", "")
                  : null
              }
              onBlur={() =>
                getValues("ip_servidor") === ""
                  ? setValue("ip_servidor", "--")
                  : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>
        </Grid>

        {/* Botones */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              size="medium"
              variant="contained"
              sx={{ width: { xs: "100%", sm: "initial" } }}
              type="submit"
            >
              Guardar
            </Button>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Button
              size="medium"
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "initial" } }}
              onClick={cancel}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormBoxContainer>
  );
};
