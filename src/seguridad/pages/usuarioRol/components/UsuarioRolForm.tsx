import React, { useEffect, useState } from "react";
import apiClient from "../../../../services/api-client";
import { BackendResponse, Rol, User } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { useAuth } from "../../../../auth/context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { UseToastMessage } from "../../../../hooks/useToastMessage";

export const UsuarioRolForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const navigate = useNavigate();
  const { accesos, user } = authState;
  const { control, register, setValue, handleSubmit } = useForm();
  const { toastMessage, setToastMessage } = UseToastMessage();

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const getUsers = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.USERS}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setUsers([...data.data]);
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

  const store = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.USUARIO_ROL}`,
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

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
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

  const cancel = () => navigate("/users");

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
                Asignación de Roles
              </Typography>
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

            {/* Usuario */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
              <Controller
                name="user_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? users.find((option) => value === option.id) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.name}
                        </Box>
                      )}
                      onChange={(event: any, newValue) =>
                        onChange(newValue ? newValue.id : null)
                      }
                      options={users}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Usuario"
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

            {/* Rol */}
            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ pr: "16px" }}>
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
                      onChange={(event: any, newValue) =>
                        onChange(newValue ? newValue.rol_id : null)
                      }
                      options={roles}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Rol"
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
