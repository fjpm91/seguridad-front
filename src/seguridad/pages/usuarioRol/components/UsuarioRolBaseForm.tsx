import { useEffect, useState } from "react";
import apiClient from "../../../../services/api-client";
import {
  Aplicacion,
  BackendResponse,
  Rol,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { useAuth } from "../../../../auth/context/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";

export const UsuarioRolBaseForm = () => {
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState<Rol[]>([]);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const navigate = useNavigate();
  const { user } = authState;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setToastMessage } = UseToastMessage();

  useEffect(() => {
    getAplicaciones();
    getRoles();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}/?roles=1`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
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

  const getRoles = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROLES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    setRoles([...data.data]);
  };

  const setRolesByApp = async (aplicacion: Aplicacion | null) => {
    if (!aplicacion) return;
    setRoles([...aplicacion.roles]);
    console.log("setRolesByApp");
  };

  const store = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.USUARIO_ROL_BASE}`,
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
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/users");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <FormBoxContainer>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(store)}
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
            <PageTitle title="Asignación de Rol Base" variant="h5" />
          </Grid>

          {/* Aplicacion */}
          <Grid item xs={12} sm={6} md={4} sx={{ pr: "16px" }}>
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
                    getOptionLabel={(app) => `${app.codigo} - ${app.nombre}`}
                    renderOption={(props, app) => (
                      <Box component="li" {...props}>
                        {app.codigo_nombre} - {app.nombre}
                      </Box>
                    )}
                    onChange={(_event: any, newValue) => {
                      onChange(newValue ? newValue.codigo : null);
                      setRolesByApp(newValue ? newValue : null);
                    }}
                    options={aplicaciones}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar aplicación"
                        error={
                          errors.codigo_app?.type === "required" ? true : false
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
            {(errors.codigo_app?.type === "required" ||
              errors.codigo_app?.type === "minLength") && (
              <ErrorText text="La aplicacion es obligatoria" />
            )}
          </Grid>

          {/* Rol */}
          <Grid item xs={12} sm={6} md={4} sx={{ pr: "16px" }}>
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
                    onChange={(_event: any, newValue) =>
                      onChange(newValue ? newValue.rol_id : null)
                    }
                    options={roles}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar Rol"
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
              <ErrorText text="El rol es obligatorio" />
            )}
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

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={message}
      ></Snackbar>
    </FormBoxContainer>
  );
};
