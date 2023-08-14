import { useEffect, useState } from "react";
import {
  BackendResponse,
  Empresa,
  Persona,
  UnidadNegocio,
} from "../../../../interfaces/interfaces";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const PersonasForm = ({ setOpen, setToastMessage }: Props) => {
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
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const { authState } = useAuth();
  const { user } = authState;

  useEffect(() => {
    getEmpresas();
    getUnidadesNegocio();
    getPersonaById();
  }, []);

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

  const getUnidadesNegocio = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDAD_NEGOCIO}`
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

  const getPersonaById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}/${id}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    const userdata = data.data as Persona;
    setValue("persona_id", userdata.persona_id);
    setValue("codigo", userdata.codigo);
    setValue("cargo", userdata.cargo);
    setValue("ubicacion", userdata.ubicacion);
    setValue("nombre", userdata.nombre);
    setValue("apellido_paterno", userdata.apellido_paterno);
    setValue("apellido_materno", userdata.apellido_materno);
    setValue("nombre_completo", userdata.nombre_completo);
    setValue("unidad_negocio_id", userdata.unidad_negocio_id);
    if (userdata.empresa_id) setValue("empresa_id", userdata.empresa_id);
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
        `/${ApiEndpoints.PERSONAS}`,
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
      console.log("🚀 ~ file: PersonasForm.tsx:143 ~ store ~ error:", error);
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
        `/${ApiEndpoints.PERSONAS}/${id}`,
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
      console.log("🚀 ~ file: PersonasForm.tsx:178 ~ update ~ error:", error);
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

  const cancel = () => navigate("/personas");

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
            <PageTitle title="Formulario de Personas" variant="h5" />
          </Grid>

          {/* Id */}
          <Grid item xs={12} sm={3}>
            <TextField
              {...register("persona_id")}
              label="Id"
              defaultValue="0"
              disabled
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Codigo */}
          <Grid item xs={12} sm={3}>
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
              <ErrorText text="El Codigo del Usuario es obligatorio" />
            )}
          </Grid>

          {/* Nombre */}
          <Grid item xs={12} sm={6}>
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

          {/* Apellido Paterno */}
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("apellido_paterno", {
                required: true,
                minLength: { value: 4, message: "error message" },
              })}
              label="Apellido Paterno"
              defaultValue="..."
              error={
                errors.apellido_paterno?.type === "required" ||
                errors.apellido_paterno?.type === "minLength"
                  ? true
                  : false
              }
              onFocus={() =>
                getValues("apellido_paterno") === "..."
                  ? setValue("apellido_paterno", "")
                  : null
              }
              onBlur={() =>
                getValues("apellido_paterno") === ""
                  ? setValue("apellido_paterno", "...")
                  : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
            {(errors.apellido_paterno?.type === "required" ||
              errors.apellido_paterno?.type === "minLength") && (
              <ErrorText text="El Apellido Paterno es obligatorio" />
            )}
          </Grid>

          {/* Apellido Materno */}
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("apellido_materno")}
              label="Apellido Materno"
              defaultValue="..."
              onFocus={() =>
                getValues("apellido_materno") === "..."
                  ? setValue("apellido_materno", "")
                  : null
              }
              onBlur={() =>
                getValues("apellido_materno") === ""
                  ? setValue("apellido_materno", "...")
                  : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Cargo */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...register("cargo")}
              label="Cargo"
              defaultValue="..."
              onFocus={() =>
                getValues("cargo") === "..." ? setValue("cargo", "") : null
              }
              onBlur={() =>
                getValues("cargo") === "" ? setValue("cargo", "...") : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Ciudad */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              {...register("ubicacion")}
              label="Ciudad"
              defaultValue="..."
              onFocus={() =>
                getValues("ubicacion") === "..."
                  ? setValue("ubicacion", "")
                  : null
              }
              onBlur={() =>
                getValues("ubicacion") === ""
                  ? setValue("ubicacion", "...")
                  : null
              }
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Empresa */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                          errors.empresa_id?.type === "required" ? true : false
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
          <Grid item xs={12} sm={6} md={4}>
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
                        ? unidades.find(
                            (option) => value === option.unidad_negocio_id
                          ) ?? null
                        : null
                    }
                    getOptionLabel={(option) =>
                      `${option.unidad_negocio_id} - ${option.nombre}`
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {`${option.unidad_negocio_id} - ${option.nombre}`}
                      </Box>
                    )}
                    onChange={(_event: any, newValue) => {
                      onChange(newValue ? newValue.unidad_negocio_id : null);
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

          {/* Habilitado */}
          <Grid item xs={12} sm={4} md={3}>
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
