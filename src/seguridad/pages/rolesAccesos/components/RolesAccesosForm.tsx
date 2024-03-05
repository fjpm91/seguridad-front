import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  Aplicacion,
  BackendResponse,
  Modulo,
  Rol,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { FormBoxContainer, PageTitle } from "../../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const RolesAccesosForm = ({ setOpen, setToastMessage }: Props) => {
  const { authState } = useAuth();
  const [rolActual, setRolActual] = useState<Rol | null>(null);
  const [aplicacionActual, setAplicacionActual] = useState<Aplicacion | null>(
    null
  );
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getAplicaciones();
  }, []);

  const resetCheckedModulos = () => {
    modulos.forEach((mApp) => (mApp.check = false));
    setModulos([...modulos]);
  };

  const markCheckedModulos = (modulosRol: Modulo[]) => {
    const modulosApp = aplicacionActual?.modulos
      ? [...aplicacionActual?.modulos]
      : [];
    if (!modulosRol || modulosRol?.length === 0) return;

    modulosApp.forEach((mApp) => {
      modulosRol.forEach((mHijo) => {
        if (mApp.modulo_id === mHijo.modulo_id) mApp.check = true;
      });
    });
    setModulos([...modulosApp]);
  };

  const handleCheckModulo = (e: any) => {
    const { value } = e.target;
    const index = modulos.findIndex((m) => m.modulo_id == value);
    if (index >= 0) {
      const modulosModificados = [...modulos];
      const modBuscado = modulosModificados[index];
      modBuscado.check = !modBuscado.check;
      setModulos([...modulosModificados]);
    }
  };

  const getAplicacionById = async (aplicacion_id?: number) => {
    if (!aplicacion_id) return;
    const { data } = await apiClient.get<Aplicacion>(
      `/${ApiEndpoints.APLICACIONES}/${aplicacion_id}`
    );

    if (!data) return;
    setAplicacionActual(data);
    setRoles(data.roles);
  };

  const getRolById = async (rol_id?: number) => {
    if (!rol_id) return;
    const { data } = await apiClient.get<Rol>(
      `/${ApiEndpoints.ROLES}/${rol_id}`
    );

    if (!data) return;
    setRolActual(data);
    markCheckedModulos(data.modulos);
  };

  const getModulosPorAplicacion = async (codigo_app?: string) => {
    const codigo = codigo_app ? codigo_app : import.meta.env.VITE_CODIGO_APP;
    const { data: dataModulos } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.MODULOS_BY_APP}/${codigo}`
    );

    if (!dataModulos) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!dataModulos.success) {
      showMessage(dataModulos.message);
      return;
    }

    const mods = (dataModulos.data as Modulo[]).map((m) => {
      return {
        ...m,
        check: false,
      };
    });
    setModulos([...mods]);
    if (codigo !== rolActual?.aplicacion.codigo) return;
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
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

  const store = async (formData: any) => {
    const accesosSeleccionados = modulos
      .filter((m) => m.check)
      .map((m) => m.modulo_id);
    const datos = {
      ...formData,
      accesos: accesosSeleccionados,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };
    console.log("🚀 ~ file: RolesAccesosForm.tsx:148 ~ store ~ datos:", datos);

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROLES_ACCESOS}`,
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
        // navigate("/users");
        reset();
        setModulos([]);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => navigate("/roles");

  const submitForm = (event: any) => {
    store(event);
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
            <PageTitle title="Formulario de Roles y Accesos" variant="h5" />
          </Grid>

          {/* Aplicaciones */}
          <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
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
                        {option.codigo} - {option.nombre}
                      </Box>
                    )}
                    onChange={(_event: any, newValue) => {
                      onChange(newValue ? newValue.aplicacion_id : null);
                      getModulosPorAplicacion(newValue?.codigo);
                      getAplicacionById(newValue?.aplicacion_id);
                    }}
                    options={aplicaciones}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aplicacion *"
                        inputProps={{
                          ...params.inputProps,
                        }}
                        error={
                          errors.aplicacion_id?.type === "required"
                            ? true
                            : false
                        }
                      />
                    )}
                  />
                );
              }}
            />
            {errors.aplicacion_id?.type === "required" && (
              <Typography color={"#d32f2f"} paddingTop={1} fontSize={12.5}>
                La Aplicación es obligatoria
              </Typography>
            )}
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
                    onChange={(_event: any, newValue) => {
                      onChange(newValue ? newValue.rol_id : null);
                      getRolById(newValue?.rol_id);
                      resetCheckedModulos();
                    }}
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
                El rol es obligatorio
              </Typography>
            )}
          </Grid>

          {/* Modulos */}
          <Grid item xs={12} sm={8} sx={{ pr: "16px" }}>
            {modulos.map((modulo) => (
              <div key={modulo.modulo_id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`check-${modulo.modulo_id}`}
                      value={modulo.modulo_id}
                      // defaultChecked={false}
                      checked={modulo.check || false}
                      onChange={(e) => {
                        handleCheckModulo(e);
                      }}
                    />
                  }
                  label={
                    modulo.menu === 1
                      ? `Menú - ${modulo.titulo}`
                      : modulo.nombre
                  }
                />
              </div>
            ))}
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
