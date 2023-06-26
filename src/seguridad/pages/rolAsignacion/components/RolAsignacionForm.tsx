import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  Aplicacion,
  BackendResponse,
  Componente,
  Rol,
  RolAsignacion,
} from "../../../../interfaces/interfaces";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";

export const RolAsignacionForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { control, register, setValue, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getComponentes();
    getAplicaciones();
    getRolAsignacionById();
  }, []);

  const getComponentes = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.COMPONENTES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setComponentes([...data.data]);
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES_CON_ROLES}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setAplicaciones([...data.data]);
  };

  const setRolesByApp = async (aplicacion: Aplicacion | null) => {
    if (!aplicacion) return;
    setRoles([...aplicacion.roles]);
    console.log("setRolesByApp");
  };

  const getRolAsignacionById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROL_ASIGNACION}/${id}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    const rolAsignacion = data.data as RolAsignacion;
    setValue("aplicacion_id", rolAsignacion.aplicacion_id);
    setValue("componente_id", rolAsignacion.componente_id);
    setValue("nombre", rolAsignacion.nombre);
    setValue("visible", rolAsignacion.visible === 1 ? true : false);
    setValue("editable", rolAsignacion.editable === 1 ? true : false);
    setValue("habilitado", rolAsignacion.habilitado === 1 ? true : false);

    const appActual = aplicaciones.find(
      (app) => app.aplicacion_id === rolAsignacion.aplicacion_id
    );
    if (appActual) {
      setRolesByApp(appActual);
      setValue("rol_id", rolAsignacion.rol_id);
    }
  };

  const store = async (formData: any) => {
    const componenteBuscado = componentes.find(
      (componente) => componente.componente_id === formData.componente_id
    );
    const datos = {
      ...formData,
      nombre: componenteBuscado?.nombre,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROL_ASIGNACION}`,
        datos
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
      console.log(error);
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
        `/${ApiEndpoints.ROL_ASIGNACION}/${id}`,
        datos
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
      console.log(error);
    }
  };

  const cancel = () => navigate("/rol-asignacion");

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

  const showMessage = (text: string = Messages.OPERACION_CORRECTA) => {
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
                Formulario de Rol Asignación
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("componente_id")}
                label="Id"
                defaultValue="Id"
                disabled
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Componentes */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
              <Controller
                name="componente_id"
                // rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? componentes.find(
                              (option) => value === option.componente_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.componente_id : null);
                      }}
                      options={componentes}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Componente *"
                          helperText="El Componente es obligatorio"
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

            {/* Aplicaciones */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
              <Controller
                name="aplicacion_id"
                // rules={{ required: true }}
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
                      getOptionLabel={(option) => option.nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.aplicacion_id : null);
                        setRolesByApp(newValue ? newValue : null);
                      }}
                      options={aplicaciones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Aplicacion *"
                          helperText="La Aplicacion es obligatoria"
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

            {/* Roles */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
              <Controller
                name="rol_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? roles.find((option) => value === option.rol_id) ??
                            null
                          : null
                      }
                      getOptionLabel={(option) => option.nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre}
                        </Box>
                      )}
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.rol_id : null);
                      }}
                      options={roles}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Rol *"
                          helperText="El Rol es obligatorio"
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

            {/* Visible */}
            <Grid item xs={12} sm={3} md={2} sx={{ pr: "16px" }}>
              <Controller
                name="visible"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value || false}
                      />
                    }
                    label="Visible"
                  />
                )}
              />
            </Grid>

            {/* Editable */}
            <Grid item xs={12} sm={3} md={2} sx={{ pr: "16px" }}>
              <Controller
                name="editable"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value || false}
                      />
                    }
                    label="Editable"
                  />
                )}
              />
            </Grid>

            {/* Habilitado */}
            <Grid item xs={12} sm={3} md={2} sx={{ pr: "16px" }}>
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
                    label="Habilitado"
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
