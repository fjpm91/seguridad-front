import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../../auth/context/useAuth";
import apiClient from "../../../../services/api-client";
import {
  Aplicacion,
  BackendResponse,
  Rol,
} from "../../../../interfaces/interfaces";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { ApiEndpoints, Messages } from "../../../../models/enums";

export const RolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, register, setValue, handleSubmit } = useForm();
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { user } = authState;

  useEffect(() => {
    getAplicaciones();
    getRolById();
  }, []);

  const getRolById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Rol>(`/${ApiEndpoints.ROLES}/${id}`);

    if (!data) return;
    setValue("rol_id", data.rol_id);
    setValue("nombre", data.nombre);
    setValue("habilitado", data.habilitado === 1 ? true : false);
    setValue("codigo_app", data.aplicacion.codigo);
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

  const store = async (formData: any) => {
    const aplicacionSeleccionada = aplicaciones.find(
      (ap) => ap.codigo === formData.codigo_app
    );
    const datos = {
      ...formData,
      aplicacion_id: aplicacionSeleccionada?.aplicacion_id,
      user: user?.id,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROLES}`,
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
        navigate("/roles");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const aplicacionSeleccionada = aplicaciones.find(
      (ap) => ap.codigo === formData.codigo_app
    );
    const datos = {
      ...formData,
      aplicacion_id: aplicacionSeleccionada?.aplicacion_id,
      user: user?.id,
    };
    console.log("🚀 ~ file: RolForm.tsx:120 ~ update ~ datos:", datos);
    // return;
    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.ROLES}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/roles");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/roles");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
  };

  const submitForm = (event: any) => {
    // console.log("🚀 ~ file: RolForm.tsx:139 ~ submitForm ~ event:", event);
    // return;

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
                Formulario de Roles
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("rol_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre", { required: true })}
                required
                label="Nombre"
                helperText="El Nombre del Rol es obligatorio"
                defaultValue="Nombre Rol"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Aplicacion */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <Controller
                name="codigo_app"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? aplicaciones.find(
                              (option) => value === option.codigo
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.codigo}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.codigo_nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) =>
                        onChange(newValue ? newValue.codigo : null)
                      }
                      options={aplicaciones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar aplicación"
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
