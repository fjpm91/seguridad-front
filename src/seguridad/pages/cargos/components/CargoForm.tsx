import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  BackendResponse,
  Cargo,
  Empresa,
  UnidadNegocio,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const CargoForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Cargo>();
  const navigate = useNavigate();
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const { user } = authState;
  const empresaWatched = watch("empresa_id");

  useEffect(() => {
    getEmpresas();
    getCargos();
    getCargoById();
    if (id === "0") {
      getUnidadesNegocio();
      getCargos();
    }
  }, []);

  useEffect(() => {
    if (empresaWatched) {
      getUnidadesNegocio(empresaWatched);
      getCargos(empresaWatched);
    }
  }, [empresaWatched]);

  const getUnidadesNegocio = async (empresaId?: number) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDAD_NEGOCIO}`,
      {
        params: {
          empresaId: empresaId ? empresaId : 0,
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
    setUnidadesNegocio([...data.data]);
  };

  const getEmpresas = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.EMPRESAS}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setEmpresas([...data.data]);
  };

  const getCargos = async (empresaId?: number) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CARGOS}`,
      {
        params: {
          empresaId: empresaId ? empresaId : 0,
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
    setCargos([...data.data]);
  };

  const getCargoById = async () => {
    if (!id || id === "0") return;

    const { data: dataResponse } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CARGOS}/${id}`
    );

    const { data } = dataResponse;
    if (!data) return;
    setValue("cargo_id", data.cargo_id);
    setValue("cargo_nombre", data.cargo_nombre);
    setValue("unidad_negocio_id", data.unidad_negocio_id);
    data.superior_id ? setValue("superior_id", data.superior_id) : null;
  };

  const store = async (formData: any) => {
    const datos = { ...formData };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;
    if (datos.ip_servidor === "...") datos.ip_servidor = null;

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.CARGOS}`,
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
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? 1 : 0,
    };
    if (datos.area === "...") datos.area = null;
    if (datos.url === "...") datos.url = null;
    if (datos.descripcion === "...") datos.descripcion = null;
    if (datos.base_datos === "...") datos.base_datos = null;
    if (datos.icono === "...") datos.icono = null;
    datos.habilitado ? (datos.habilitado = 1) : (datos.habilitado = 0);

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.CARGOS}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const cancel = () => navigate(`/${ApiEndpoints.CARGOS}`);

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
          p: 2, // 4 * 8
          borderRadius: 2, // 4 * 4
        }}
      >
        {/* Formulario */}
        <Grid container sx={{ mb: 4 }}>
          {/* Titulo Formulario */}
          <Grid item xs={12}>
            <PageTitle title="Formulario de Cargos" variant="h5" />
          </Grid>

          <Grid container item lg={6}>
            {/* Id */}
            <Grid item xs={12} lg={6} sx={{ mr: "auto", mt: 2 }}>
              <TextField
                {...register("cargo_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Empresa */}
            <Grid item xs={10} sx={{ mt: 2 }}>
              <Controller
                name="empresa_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? empresas.find(
                              (option) => value === option.empresa_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) => option.nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) =>
                        onChange(newValue ? newValue.empresa_id : null)
                      }
                      options={empresas}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Empresa *"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.empresa_id?.type === "required"
                              ? true
                              : false
                          }
                        />
                      )}
                    />
                  );
                }}
              />
              {errors.empresa_id?.type === "required" && (
                <ErrorText text="La empresa es obligatoria" />
              )}
            </Grid>

            {/* Unidad de Negocio */}
            <Grid item xs={10} sx={{ mt: 2 }}>
              <Controller
                name="unidad_negocio_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? unidades.find((option) => value === option.id) ??
                            null
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
                        onChange(newValue ? newValue.id : null);
                      }}
                      options={unidades}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Unidad de Negocio"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.unidad_negocio_id?.type === "required"
                              ? true
                              : false
                          }
                        />
                      )}
                    />
                  );
                }}
              />
              {errors.unidad_negocio_id?.type === "required" && (
                <ErrorText text="La Unidad de Negocio es obligatoria" />
              )}
            </Grid>

            {/* Cargo Superior */}
            <Grid item xs={10} sx={{ mt: 2 }}>
              <Controller
                name="superior_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? cargos.find(
                              (option) => value === option.cargo_id
                            ) ?? null
                          : null
                      }
                      getOptionLabel={(option) =>
                        `${option.cargo_id} - ${option.cargo_nombre}`
                      }
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {`${option.cargo_id} - ${option.cargo_nombre}`}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.cargo_id : null);
                      }}
                      options={cargos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cargo Superior"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.unidad_negocio_id?.type === "required"
                              ? true
                              : false
                          }
                        />
                      )}
                    />
                  );
                }}
              />
              {errors.unidad_negocio_id?.type === "required" && (
                <ErrorText text="El Cargo Superior es obligatorio" />
              )}
            </Grid>

            {/* Nombre */}
            <Grid item xs={10} sx={{ mt: 2 }}>
              <TextField
                {...register("cargo_nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                required
                label="Nombre"
                defaultValue="---"
                error={
                  errors.cargo_nombre?.type === "required" ||
                  errors.cargo_nombre?.type === "minLength"
                    ? true
                    : false
                }
                onFocus={() =>
                  getValues("cargo_nombre") === "---"
                    ? setValue("cargo_nombre", "")
                    : null
                }
                onBlur={() =>
                  getValues("cargo_nombre") === ""
                    ? setValue("cargo_nombre", "---")
                    : null
                }
                sx={{ width: "100%" }}
              />
              {(errors.cargo_nombre?.type === "required" ||
                errors.cargo_nombre?.type === "minLength") && (
                <ErrorText text="El Nombre del Cargo debe ser mayor o igual a 3 caracteres" />
              )}
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
