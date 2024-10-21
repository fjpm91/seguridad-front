import { useEffect, useState } from "react";
import apiClient from "../../../../services/api-client";
import {
  Aplicacion,
  BackendResponse,
  Rol,
  User,
  UsuarioRol,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { useAuth } from "../../../../auth/context/useAuth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { BasicTable, PageTitle } from "../../../../components";
import { LoadingButton } from "@mui/lab";
import { GreyBox, SolicitudButtonStyle } from "../../../../models/constants";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

const tableHeaders = ["id", "Nombre", "PersonaId", "Acciones"];

export const UsuarioRolForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const rutaActual = useLocation();
  const { user } = authState;
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<UsuarioRol>();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolActual, setRolActual] = useState<Rol | null>(null);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const aplicacionWatched = watch("aplicacion_id");

  useEffect(() => {
    getUsers();
    getRoles();
    getAplicaciones();
    getRolById();
  }, []);

  useEffect(() => {
    if (!rolActual) return;
    setValue("rol_id", rolActual.rol_id);
  }, [rolActual]);

  useEffect(() => {
    if (!aplicacionWatched) return;
    getRoles(aplicacionWatched);
  }, [aplicacionWatched]);

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

  const getRoles = async (aplicacionId = 0) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.ROLES}`,
      {
        params: {
          aplicacionId,
        },
      }
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
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      setIsLoading(true);
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
        // navigate("/users");
        getRolById();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      setErrorMessage(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = () => navigate("/roles");

  const submitForm = (event: any) => {
    store(event);
    // if (id === "0") {
    // } else {
    //   update(event);
    // }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const getRolById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Rol>(`/${ApiEndpoints.ROLES}/${id}`, {
      params: { withUsers: 1 },
    });

    if (!data) return;
    setRolActual(data);
  };

  const handleOpen = (personaId: number) => {
    navigate("/users/" + personaId);
    console.log("🚀 ~ handleOpen ~ personaId:", personaId);
  };

  const handleDelete = async (user_id: number) => {
    try {
      setIsLoading(true);
      const datos = {
        user_id: user_id,
        rol_id: rolActual?.rol_id,
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ELIMINAR_USUARIO_ROL}`,
        datos
      );

      if (!data) {
        setErrorMessage("No se pudo completar la operación");
        return;
      }

      if (!data.success) {
        setErrorMessage(data.message);
        return;
      }

      showMessage(data.message);
      getRolById();
    } catch (error) {
      setErrorMessage(JSON.stringify(error));
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getTableItems = () => {
    if (!rolActual || !rolActual.users || rolActual.users?.length === 0)
      return [];
    return rolActual.users.map((p) => {
      return {
        id: p.id,
        name: p.name,
        // persona_id: p.persona_id,
        user_id: p.pivot.user_id,
      };
    });
  };

  const backgrounStyle = rutaActual.pathname.includes(ApiEndpoints.USUARIO_ROL)
    ? GreyBox
    : {};

  return (
    <Box sx={backgrounStyle}>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{
          backgroundColor: "white",
          p: 2, // 4 * 8
          borderRadius: 2, // 4 * 4,
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Formulario */}
          <Grid item container xs={12} md={8} lg={6} alignContent="flex-start">
            {rutaActual.pathname.includes(ApiEndpoints.USUARIO_ROL) && (
              <Grid item xs={12}>
                <PageTitle title="Asignar Usuario Rol" divider={true} />
              </Grid>
            )}

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} sx={{ p: 1 }}>
              <TextField
                {...register("rol_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Usuario */}
            <Grid item xs={12} sm={8} md={9} sx={{ p: 1 }}>
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
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.persona.nombre_completo}`
                      }
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

            {/* Aplicacion */}
            <Grid item xs={12} sx={{ p: 1 }}>
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
                      getOptionLabel={(option) =>
                        `${option.codigo} - ${option.nombre}`
                      }
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.codigo_nombre} - {option.nombre}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) =>
                        onChange(newValue ? newValue.aplicacion_id : null)
                      }
                      options={aplicaciones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Aplicación"
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
                      getOptionLabel={(option) =>
                        `${option.aplicacion.codigo} - ${option.nombre}`
                      }
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {`${option.aplicacion.codigo} - ${option.nombre}`}
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

            {/* Botones */}
            <Grid container spacing={2}>
              <Grid item>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  variant="contained"
                  sx={SolicitudButtonStyle}
                >
                  <span>Guardar</span>
                </LoadingButton>
              </Grid>

              <Grid item>
                <Button size="medium" variant="outlined" onClick={cancel}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>

            {errorMessage && (
              <Grid item xs={12} sx={{ p: 1 }}>
                <Alert severity="error">{errorMessage}</Alert>
              </Grid>
            )}
          </Grid>

          {/* Listado de Personas */}
          <Grid item xs={12} md={8} lg={6} sx={{ pt: 2 }}>
            {rolActual?.users?.length === 0 && (
              <Grid item xs={12} sx={{ p: 1 }}>
                <Alert severity="info">
                  No existen Usuarios asociados a este Rol
                </Alert>
              </Grid>
            )}

            {rolActual?.users && rolActual?.users?.length > 0 && (
              <>
                {/* <Divider sx={{ mt: 1 }} /> */}
                <Typography variant="body1" sx={{ my: 1 }}>
                  Usuarios asociados a este Rol
                </Typography>
                <BasicTable
                  items={getTableItems()}
                  headers={tableHeaders}
                  canEdit="fecha_retiro"
                  handleOpen={handleOpen}
                  handleDelete={handleDelete}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
