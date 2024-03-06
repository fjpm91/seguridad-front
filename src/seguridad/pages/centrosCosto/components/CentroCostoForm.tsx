import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";
import {
  UnidadNegocio,
  CentroCosto,
  Empresa,
  BackendResponse,
} from "../../../../interfaces/interfaces";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const CentroCostoForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CentroCosto>();
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const { authState } = useAuth();
  const { user } = authState;
  const empresaWatched = watch("empresa_id");

  useEffect(() => {
    getEmpresas();
    getCentroCostoById();
    if (id === "0") getUnidadesNegocio();
  }, []);

  useEffect(() => {
    if (empresaWatched) {
      getUnidadesNegocio(empresaWatched);
    }
  }, [empresaWatched]);

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

  const getCentroCostoById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CENTROS_COSTO}/${id}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    const ccData = data.data as CentroCosto;
    setValue("id", ccData.id);
    setValue("codigo", ccData.codigo);
    setValue("nombre", ccData.nombre);
    setValue("empresa_id", ccData.empresa_id);
    setValue("unidad_negocio_id", ccData.unidad_negocio_id);
  };

  const store = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? formData.habilitado : 0,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.CENTROS_COSTO}`,
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
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? formData.habilitado : 0,
    };

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.CENTROS_COSTO}/${id}`,
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
        cancel();
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ update ~ error:", error);
      showMessage(JSON.stringify(error));
    }
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

  const cancel = () => navigate(`/${ApiEndpoints.CENTROS_COSTO}`);

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
            <PageTitle title="Formulario de Centros de Costo" variant="h5" />
          </Grid>

          <Grid container item lg={6}>
            {/* Id */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <TextField
                {...register("id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Codigo */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <TextField
                {...register("codigo", { required: true })}
                label="Codigo"
                defaultValue="0"
                error={
                  errors.codigo?.type === "required" ||
                  getValues("codigo") === "0"
                    ? true
                    : false
                }
                onFocus={() =>
                  getValues("codigo") === "0" ? setValue("codigo", "") : null
                }
                onBlur={() =>
                  getValues("codigo") === "" ? setValue("codigo", "0") : null
                }
                sx={{ width: "100%", pr: "16px" }}
              />
              {(errors.codigo?.type === "required" ||
                errors.codigo?.type === "minLength" ||
                getValues("codigo") === "0") && (
                <ErrorText text="El Codigo del Centro de Costo es obligatorio" />
              )}
            </Grid>

            {/* Nombre */}
            <Grid item xs={6} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                label="Nombre"
                defaultValue="..."
                error={
                  errors.nombre?.type === "required" ||
                  errors.nombre?.type === "minLength"
                    ? true
                    : false
                }
                onFocus={() =>
                  getValues("nombre") === "..." ? setValue("nombre", "") : null
                }
                onBlur={() =>
                  getValues("nombre") === "" ? setValue("nombre", "...") : null
                }
                sx={{ width: "100%", pr: "16px" }}
              />
              {(errors.nombre?.type === "required" ||
                errors.nombre?.type === "minLength") && (
                <ErrorText text="El Nombre es obligatorio" />
              )}
            </Grid>

            <Grid item xs={6} sx={{ p: 1 }}></Grid>

            {/* Empresa */}
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
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
            <Grid item xs={12} sx={{ p: 1 }}>
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
