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
  Grid,
  Typography,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";
import { FormBoxContainer, PageTitle } from "../../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const RolAsignacionForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = authState;
  const appWatched = watch("aplicacion_id");

  useEffect(() => {
    getComponentes();
    getAplicaciones();
    getRolAsignacionById();
  }, []);

  useEffect(() => {
    if (!appWatched || aplicaciones.length === 0) return;
    getRoles(appWatched);
  }, [appWatched, aplicaciones]);

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

  const getRoles = async (aplicacionId: number) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROLES}`,
      {
        params: {
          aplicacionId,
        },
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

    setRoles([...data.data]);
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
    setValue("rol_id", rolAsignacion.rol_id);
    setValue("nombre", rolAsignacion.nombre);
    setValue("visible", rolAsignacion.visible === 1 ? true : false);
    setValue("editable", rolAsignacion.editable === 1 ? true : false);
    setValue("habilitado", rolAsignacion.habilitado === 1 ? true : false);
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
        <Grid container sx={{ mb: 4 }}>
          <Grid item container xs={12} lg={6}>
            {/* Titulo Formulario */}
            <Grid item xs={12}>
              <PageTitle title="Formulario de Rol Asignación" variant="h5" />
            </Grid>

            {/* Id */}
            <Grid item xs={12} lg={3} sx={{ p: 1 }}>
              <TextField
                {...register("componente_id")}
                label="Id"
                defaultValue="Id"
                disabled
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Componentes */}
            <Grid item xs={12} lg={9} sx={{ p: 1 }}>
              <Controller
                name="componente_id"
                rules={{ required: true }}
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
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.componente_id : null);
                      }}
                      options={componentes}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Componente *"
                          error={
                            errors.componente_id?.type === "required"
                              ? true
                              : false
                          }
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
              {(errors.componente_id?.type === "required" ||
                errors.componente_id?.type === "minLength") && (
                <Typography
                  paddingLeft={2}
                  paddingTop={1}
                  fontSize={12.5}
                  color={"#F36892"}
                >
                  El componente es obligatorio
                </Typography>
              )}
            </Grid>

            {/* Aplicacion */}
            <Grid item xs={12} sx={{ p: 1 }}>
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
                      getOptionLabel={(option) =>
                        `${option.codigo} - ${option.nombre}`
                      }
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {`${option.codigo} - ${option.nombre}`}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.aplicacion_id : null);
                        // setRolesByApp(newValue ? newValue : null);
                      }}
                      options={aplicaciones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Aplicacion *"
                          error={
                            errors.aplicacion_id?.type === "required"
                              ? true
                              : false
                          }
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
              {(errors.aplicacion_id?.type === "required" ||
                errors.aplicacion_id?.type === "minLength") && (
                <Typography
                  paddingLeft={2}
                  paddingTop={1}
                  fontSize={12.5}
                  color={"#F36892"}
                >
                  La aplicacion es obligatoria
                </Typography>
              )}
            </Grid>

            {/* Rol */}
            <Grid item xs={12} sx={{ p: 1 }}>
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
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.rol_id : null);
                      }}
                      options={roles}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Rol *"
                          error={
                            errors.rol_id?.type === "required" ? true : false
                          }
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
              {(errors.rol_id?.type === "required" ||
                errors.rol_id?.type === "minLength") && (
                <Typography
                  paddingLeft={2}
                  paddingTop={1}
                  fontSize={12.5}
                  color={"#F36892"}
                >
                  El rol es obligatorio
                </Typography>
              )}
            </Grid>

            {/* Visible */}
            <Grid item xs={12} lg={4} sx={{ p: 1 }}>
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
            <Grid item xs={12} lg={4} sx={{ p: 1 }}>
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
            <Grid item xs={12} lg={4} sx={{ p: 1 }}>
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
