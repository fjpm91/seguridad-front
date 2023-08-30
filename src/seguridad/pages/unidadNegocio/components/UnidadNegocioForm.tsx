import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Autocomplete,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Empresa,
  BackendResponse,
  Division,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const UnidadNegocioForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { authState } = useAuth();
  const { user } = authState;

  useEffect(() => {
    getEmpresas();
    getDivisiones();
    getunidadNegocioById();
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

  const getDivisiones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.DIVISIONES}`
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    setDivisiones([...data.data]);
  };

  const getunidadNegocioById = async () => {
    if (!id || id === "0") return;

    const { data: response } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDAD_NEGOCIO}/${id}`
    );

    if (!response) return;

    if (!response.success) {
      showMessage(response.message);
      return;
    }

    const { data } = response;
    setValue("unidad_negocio_id", data.unidad_negocio_id);
    setValue("empresa_id", data.empresa.empresa_id);
    setValue("division_id", data.division_id);
    setValue("nombre", data.nombre);
    setValue("habilitado", data.habilitado === 1 ? true : false);
  };

  const submitForm = (event: any) => {
    if (id === "0") {
      store(event);
    } else {
      update(event);
    }
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
        `/${ApiEndpoints.UNIDAD_NEGOCIO}`,
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
        navigate("/unidad-negocio");
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? 1 : 0,
    };

    try {
      const { data: response } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.UNIDAD_NEGOCIO}/${id}`,
        datos
      );
      if (!response) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      if (!response.success) {
        showMessage(response.message);
        return;
      }

      showMessage(response.message);
      setTimeout(() => {
        cancel();
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/unidades-negocio");

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
            <PageTitle title="Formulario de Unidades de Negocio" variant="h5" />
          </Grid>

          {/* ID */}
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              {...register("unidad_negocio_id")}
              label="Id"
              defaultValue="0"
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
                        label="Seleccionar empresa"
                        error={
                          errors.empresa_id?.type === "required" ? true : false
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
            {errors.empresa_id?.type === "required" && (
              <ErrorText text="La Empresa es obligatoria" />
            )}
          </Grid>

          {/* Nombre Unidad */}
          <Grid item xs={12} md={5}>
            <TextField
              {...register("nombre", {
                required: true,
                minLength: { value: 4, message: "error message" },
              })}
              required
              label="Nombre"
              defaultValue="..."
              onFocus={() =>
                getValues("nombre") === "..." ? setValue("nombre", "") : null
              }
              onBlur={() =>
                getValues("nombre") === "..." ? setValue("nombre", "") : null
              }
              error={
                errors.nombre?.type === "required" ||
                errors.nombre?.type === "minLength"
                  ? true
                  : false
              }
              sx={{ width: "100%" }}
            />
            {(errors.nombre?.type === "required" ||
              errors.nombre?.type === "minLength") && (
              <ErrorText text="El Nombre es obligatorio" />
            )}
          </Grid>

          {/* Division */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Controller
              name="division_id"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <Autocomplete
                    value={
                      value
                        ? divisiones.find(
                            (option) => value === option.division_id
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
                      onChange(newValue ? newValue.division_id : null)
                    }
                    options={divisiones}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Division"
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

          {/* Habilitado */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="habilitado"
              control={control}
              render={({ field }) => (
                <>
                  <FormLabel component="legend">Estado</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value || false}
                        />
                      }
                      label="Habilitado"
                    />
                  </FormGroup>
                </>
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
