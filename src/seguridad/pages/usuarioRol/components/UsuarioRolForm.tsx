import { useEffect, useState } from "react";
import apiClient from "../../../../services/api-client";
import { BackendResponse, Rol, User } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { useAuth } from "../../../../auth/context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormBoxContainer, PageTitle } from "../../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UsuarioRolForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const navigate = useNavigate();
  const { user } = authState;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          p: 4, // 4 * 8
          borderRadius: 2, // 4 * 4
        }}
      >
        {/* Formulario */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Titulo Formulario */}
          <Grid item xs={12}>
            <PageTitle title="Asignación de Roles" />
          </Grid>

          {/* Id */}
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              {...register("rol_id")}
              label="Id"
              defaultValue="0"
              disabled
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Usuario */}
          <Grid item xs={12} sm={6} md={4}>
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
                        {option.name} - {option.persona.nombre_completo}
                      </Box>
                    )}
                    onChange={(_event: any, newValue) =>
                      onChange(newValue ? newValue.id : null)
                    }
                    options={users}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Usuario *"
                        inputProps={{
                          ...params.inputProps,
                        }}
                        error={
                          errors.user_id?.type === "required" ? true : false
                        }
                      />
                    )}
                  />
                );
              }}
            />
            {errors.user_id?.type === "required" && (
              <Typography color={"#d32f2f"} paddingTop={1} fontSize={12.5}>
                El Usuario es obligatorio
              </Typography>
            )}
          </Grid>

          {/* Rol */}
          <Grid item xs={12} sm={6} md={4}>
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
                        label="Rol *"
                        inputProps={{
                          ...params.inputProps,
                        }}
                        error={
                          errors.rol_id?.type === "required" ? true : false
                        }
                      />
                    )}
                  />
                );
              }}
            />
            {errors.rol_id?.type === "required" && (
              <Typography color={"#d32f2f"} paddingTop={1} fontSize={12.5}>
                El Rol es obligatorio
              </Typography>
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
    </FormBoxContainer>
  );
};
