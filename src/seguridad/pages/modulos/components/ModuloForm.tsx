import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  DynamicMenuIcon,
  FormBoxContainer,
  PageTitle,
} from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";
import {
  Aplicacion,
  BackendResponse,
  Modulo,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { IconNames } from "../../../../models/iconNames";
import apiClient from "../../../../services/api-client";

const regMultipleSpaces = /  +/g;
const regYspaces = /\sy\s/gi;
const iconos = [...IconNames];

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ModuloForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
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
    if (data.menu) {
      setValue("menu", data.menu === 1 ? true : false);
    }
  };

  const getModulos = async (codigo_app?: string) => {
    const fullRoute = codigo_app
      ? `/${ApiEndpoints.MODULOS_BY_APP}/${codigo_app}`
      : `/${ApiEndpoints.MODULOS}`;
    const { data } = await apiClient.get<BackendResponse>(fullRoute);

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
    // const replaceValue = formData.menu ? "-" : "_";

    const nombreModuloHijo = (formData.nombre as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      .replace(regYspaces, "-")
      .replace(" ", "-");
    const urlModuloHijo = (formData.url as string)
      .trim()
      .toLowerCase()
      .replace(regMultipleSpaces, " ")
      .replace(regYspaces, "-")
      .replace(" ", "-");

    const datos = {
      ...formData,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? formData.habilitado : 0,
      icono: formData.icono ? formData.icono : "Home",
      menu: formData.menu ? formData.menu : 0,
      nombre: nombreModuloHijo,
      url: urlModuloHijo,
      user: user?.id,
    };

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

  const cancel = () => navigate(`/${ApiEndpoints.MODULOS}`);

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
        <Grid container sx={{ mb: 2, justifyContent: "center" }}>
          {/* Formulario */}
          <Grid container item xs={12} md={10} lg={8}>
            {/* Titulo Formulario */}
            <Grid item xs={12}>
              <PageTitle
                title="Formulario de Modulos"
                variant="h5"
                divider={true}
              />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={3} lg={2} sx={{ p: 1 }}>
              <TextField
                {...register("modulo_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Titulo */}
            <Grid item xs={12} sm={9} sx={{ p: 1 }}>
              <TextField
                {...register("titulo", {
                  required: "El titulo del modulo es obligatorio",
                  minLength: {
                    value: 4,
                    message: "El titulo debe contener minimo 4 caracteres",
                  },
                })}
                required
                label="Titulo"
                defaultValue="---"
                error={!!errors.titulo}
                onFocus={() =>
                  getValues("titulo") === "---" ? setValue("titulo", "") : null
                }
                onBlur={() =>
                  getValues("titulo") === "" ? setValue("titulo", "---") : null
                }
                sx={{ width: "100%" }}
              />
              {!!errors.titulo && (
                <ErrorText
                  text={errors.titulo.message?.toString() || "Error"}
                />
              )}
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: "El nombre del modulo es obligatorio",
                  minLength: {
                    value: 4,
                    message:
                      "El nombre del modulo debe contener minimo 4 caracteres",
                  },
                })}
                required
                label="Nombre"
                defaultValue="---"
                error={!!errors.nombre}
                onFocus={() =>
                  getValues("nombre") === "---" ? setValue("nombre", "") : null
                }
                onBlur={() =>
                  getValues("nombre") === "" ? setValue("nombre", "---") : null
                }
                sx={{ width: "100%" }}
              />
              {!!errors.nombre && (
                <ErrorText
                  text={errors.nombre.message?.toString() || "Error"}
                />
              )}
            </Grid>

            {/* URL */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <TextField
                {...register("url", {
                  required: "La url del modulo es obligatorio",
                  minLength: {
                    value: 4,
                    message:
                      "La url del modulo debe contener al menos 4 caracteres",
                  },
                })}
                required
                label="URL"
                defaultValue="---"
                error={!!errors.url}
                onFocus={() =>
                  getValues("url") === "---" ? setValue("url", "") : null
                }
                onBlur={() =>
                  getValues("url") === "" ? setValue("url", "---") : null
                }
                sx={{ width: "100%" }}
              />
              {!!errors.url && (
                <ErrorText text={errors.url.message?.toString() || "Error"} />
              )}
            </Grid>

            {/* Aplicacion */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <Controller
                name="aplicacion_id"
                rules={{
                  required: "El nombre de la aplicacion es obligatorio",
                }}
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
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.aplicacion_id : null);
                        getModulos(newValue?.codigo);
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
              {!!errors.aplicacion_id && (
                <ErrorText
                  text={errors.aplicacion_id.message?.toString() || "Error"}
                />
              )}
            </Grid>

            {/* Modulo Padre */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
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
                      onChange={(_event: any, newValue) =>
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

            {/* Icono */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <Controller
                name="icono"
                rules={{ required: "El icono es obligatorio" }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? iconos.find((option) => value === option.name) ??
                            null
                          : null
                      }
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <DynamicMenuIcon icon={option.name} /> &nbsp;{" "}
                          {option.name}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) =>
                        onChange(newValue ? newValue.name : null)
                      }
                      options={iconos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Icono"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={!!errors.icono}
                        />
                      )}
                    />
                  );
                }}
              />
              {!!errors.icono && (
                <ErrorText text={errors.icono.message?.toString() || "Error"} />
              )}
            </Grid>

            {/* Vacio */}
            <Grid item sm={5}></Grid>

            {/* Habilitado */}
            <Grid item xs={12} sm={4} md={3} sx={{ p: 1 }}>
              <Controller
                name="habilitado"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => {
                          console.log(
                            "🚀 ~ file: ModuloForm.tsx:485 ~ ModuloForm ~ e:",
                            e
                          );
                          field.onChange(e.target.checked);
                        }}
                        checked={field.value || false}
                      />
                    }
                    label="Habilitado"
                  />
                )}
              />
            </Grid>

            {/* Menu */}
            <Grid item xs={12} sm={4} md={3} sx={{ p: 1 }}>
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
                    label="Menu"
                  />
                )}
              />
            </Grid>

            {/* Botones */}
            <Grid container>
              <Grid item xs={6} sm={3} sx={{ p: 1 }}>
                <Button
                  size="medium"
                  variant="contained"
                  sx={{ width: { xs: "100%", sm: "initial" } }}
                  type="submit"
                >
                  Guardar
                </Button>
              </Grid>

              <Grid item xs={6} sm={3} sx={{ p: 1 }}>
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
          </Grid>
        </Grid>
      </Box>
    </FormBoxContainer>
  );
};
