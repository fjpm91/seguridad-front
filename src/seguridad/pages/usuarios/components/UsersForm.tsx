import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import {
  BackendResponse,
  Persona,
  Rol,
  User,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

export const UsersForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [userRoles, setUserRoles] = useState<Rol[]>([]);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { control, register, setValue, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getPersonas();
    getUserById();
  }, []);

  const getUserById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.USERS}/${id}`
    );

    if (!data) return;
    const userdata = data.data as User;
    setUserRoles(userdata.roles);
    setValue("id", userdata.id);
    setValue("name", userdata.name);
    setValue("persona_id", userdata.persona_id);
    setValue("email", userdata.email);
    setValue("persona_id", userdata.persona_id);
  };

  const getPersonas = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setPersonas([...data.data]);
  };

  const store = async (formData: any) => {
    const datos = { ...formData };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.USERS}`,
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
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const handleEliminar = async (rol_id: number) => {
    try {
      const datos = {
        user_id: id,
        rol_id: rol_id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ELIMINAR_USUARIO_ROL}`,
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

      showMessage(data.message);
      getUserById();
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      user_id: id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.USERS}/${id}`,
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
        navigate("/users");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const cancel = () => navigate("/users");

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
                Formulario de Usuarios
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Personas */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
              <Controller
                name="persona_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? personas.find(
                              (option) => value === option.persona_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.nombre_completo}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre_completo}
                        </Box>
                      )}
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.persona_id : null);
                      }}
                      options={personas}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Personas *"
                          helperText="La Personas es obligatoria"
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

            {/* Username */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("name")}
                label="Username"
                defaultValue="xxx"
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("email")}
                label="Email"
                defaultValue="email@empacar.com.bo"
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

            {/* Roles */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <Typography variant="body2">Roles del usuario</Typography>
              <Divider />
              <List>
                {userRoles.map((rol) => (
                  <ListItem key={rol.rol_id}>
                    <ListItemText primary={rol.nombre} />

                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(rol.rol_id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
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
