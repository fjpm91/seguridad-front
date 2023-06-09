import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../../services/api-client";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../../../../auth/context/useAuth";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import {
  Aplicacion,
  BackendResponse,
  Modulo,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";

const regMultipleSpaces = /  +/g;
const regYspaces = /\sy\s/gi;

export const ModuloForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { user } = authState;

  useEffect(() => {
    getAplicaciones();
    getModulos();
    getModuloById();
  }, []);

  const getModuloById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Modulo>(
      `/${ApiEndpoints.MODULOS}/${id}`
    );

    if (!data) return;
    setValue("modulo_id", data.modulo_id);
    setValue("nombre", data.nombre);
    setValue("url", data.url);
    setValue("habilitado", data.habilitado === 1 ? true : false);
    setValue("aplicacion_id", data.aplicacion_id);
    setValue("titulo", data.titulo);
    if (data.modulo_padre) setValue("modulo_padre", data.modulo_padre);
    if (data.icono) setValue("icono", data.icono);
  };

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

    const mods: Modulo[] = (data.data as Modulo[]).map((modulo) => {
      return {
        ...modulo,
        aplicacion_nombre: `${modulo.aplicacion.codigo} - ${modulo.titulo}`,
      };
    });

    setModulos([...mods.filter((mod) => mod.menu)]);
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    const apps: Aplicacion[] = (data.data as Aplicacion[]).map((aplicacion) => {
      return {
        ...aplicacion,
        codigo_nombre: `${aplicacion.codigo} - ${aplicacion.nombre}`,
      };
    });
    setAplicaciones([...apps]);
  };

  const submitForm = (event: any) => {
    if (!event.aplicacion_id) {
      showMessage("Debes seleccionar una Aplicación");
      return;
    }
    if (!event.menu && !event.modulo_padre) {
      showMessage(
        "Debes seleccionar un Módulo Padre para Módulos que no son Menú"
      );
      return;
    }
    if (event.menu && event.modulo_padre) {
      showMessage("Menú no puede tener un Módulo Padre");
      return;
    }
    if (id === "0") {
      store(event);
    } else {
      update(event);
    }
  };

  const store = async (formData: any) => {
    const replaceValue = formData.menu ? "-" : "_";

    const nombreModuloHijo = (formData.nombre as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      .replace(regYspaces, "_")
      .replace(" ", "_");
    const urlModuloHijo = (formData.url as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      // .replace(regMultipleSlash, " ")
      .replace(regYspaces, "-")
      .replace(" ", replaceValue);

    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      nombre: nombreModuloHijo,
      habilitado: formData.habilitado ? formData.habilitado : 0,
      menu: formData.menu ? formData.menu : 0,
      url: urlModuloHijo,
    };
    console.log("🚀 ~ file: ModuloForm.tsx:110 ~ store ~ datos:", datos);
    // return;

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.MODULOS}`,
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

      showMessage(data.message);
      setTimeout(() => {
        navigate("/modulos");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: ModuloForm.tsx:128 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const replaceValue = formData.menu ? "-" : "_";

    const nombreModuloHijo = (formData.nombre as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      .replace(regYspaces, "_")
      .replace(" ", "_");
    const urlModuloHijo = (formData.url as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      .replace(regYspaces, "-")
      .replace(" ", replaceValue);

    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      nombre: nombreModuloHijo,
      habilitado: formData.habilitado ? formData.habilitado : 0,
      menu: formData.menu ? formData.menu : 0,
      url: urlModuloHijo,
    };
    console.log("🚀 ~ file: ModuloForm.tsx:197 ~ update ~ datos:", datos);
    // return;

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.MODULOS}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/modulos");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/modulos");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
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
                Formulario de Modulos
              </Typography>
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("modulo_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Titulo */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("titulo", { required: true })}
                required
                label="Titulo"
                helperText="El Titulo del Modulo es obligatorio"
                defaultValue="Titulo Modulo"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre", { required: true })}
                required
                label="Nombre"
                helperText="El Nombre del Modulo es obligatorio"
                defaultValue="Nombre Modulo"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* URL */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <TextField
                {...register("url", { required: true })}
                required
                label="URL"
                helperText="La URL del Modulo es obligatoria"
                defaultValue="/..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Aplicacion */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <Controller
                name="aplicacion_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? aplicaciones.find(
                              (option) => value === option.aplicacion_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.codigo_nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.codigo_nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.aplicacion_id : null);
                      }}
                      options={aplicaciones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Aplicación *"
                          helperText="La Aplicación es obligatoria"
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>

            {/* Icono */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <TextField
                {...register("icono")}
                label="Icono"
                defaultValue="..."
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Modulo Padre */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <Controller
                name="modulo_padre"
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? modulos.find(
                              (option) => value === option.modulo_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.aplicacion_nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.aplicacion_nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) =>
                        onChange(newValue ? newValue.modulo_id : null)
                      }
                      options={modulos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Modulo Padre"
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  );
                }}
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

            {/* Menu */}
            <Grid item xs={12} sm={4} md={3} sx={{ pr: "16px" }}>
              <Controller
                name="menu"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value || false}
                      />
                    }
                    label="menu"
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
