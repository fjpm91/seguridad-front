import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";
import {
  Aplicacion,
  BackendResponse,
  Componente,
  ComponenteForm,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ComponentsForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ComponenteForm>();
  const navigate = useNavigate();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const { user } = authState;

  useEffect(() => {
    getComponentById();
    getAplicaciones();
  }, []);

  const getComponentById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.COMPONENTES}/${id}`
    );

    if (!data) return;
    const componenteData = data.data as Componente;
    setValue("componente_id", componenteData.componente_id);
    setValue("nombre", componenteData.nombre);
    setValue("habilitadoForm", componenteData.habilitado === 1 ? true : false);
    if (componenteData.aplicacion_id)
      setValue("aplicacion_id", componenteData.aplicacion_id);
    if (componenteData.ruta) setValue("ruta", componenteData.ruta);
    if (componenteData.formulario)
      setValue("formulario", componenteData.formulario);
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES_CON_ROLES}`
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
    const datos = { ...formData, habilitado: formData.habilitadoForm ? 1 : 0 };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}`,
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
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitadoForm ? 1 : 0,
      user: user?.id,
    };

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}/${id}`,
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
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate(`/${ApiEndpoints.COMPONENTES}`);

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
        <Grid container sx={{ mb: 4, justifyContent: "center" }}>
          <Grid container item xs={12} md={10} lg={8} xl={6}>
            {/* Titulo Formulario */}
            <Grid item xs={12}>
              <PageTitle
                title="Formulario de Componentes"
                variant="h5"
                divider={true}
              />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} sx={{ p: 1 }}>
              <TextField
                {...register("componente_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} sm={9} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                required
                label="Nombre"
                defaultValue="---"
                error={
                  errors.nombre?.type === "required" ||
                  errors.nombre?.type === "minLength"
                    ? true
                    : false
                }
                onFocus={() =>
                  getValues("nombre") === "---" ? setValue("nombre", "") : null
                }
                onBlur={() =>
                  getValues("nombre") === "" ? setValue("nombre", "---") : null
                }
                sx={{ width: "100%" }}
              />
              {(errors.nombre?.type === "required" ||
                errors.nombre?.type === "minLength") && (
                <ErrorText text="El nombre del componente es obligatorio" />
              )}
            </Grid>

            {/* Aplicacion */}
            <Grid item xs={12} sx={{ p: 1 }}>
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
                          {`${option.codigo} - ${option.nombre}`}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) => {
                        onChange(newValue ? newValue.aplicacion_id : null);
                        // setRolesByApp(newValue ? newValue : null);
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
              {(errors.aplicacion_id?.type === "required" ||
                errors.aplicacion_id?.type === "minLength") && (
                <ErrorText text="La aplicacion es obligatoria" />
              )}
            </Grid>

            {/* Formulario */}
            <Grid item xs={12} sm={8} lg={6} sx={{ p: 1 }}>
              <TextField
                {...register("formulario")}
                label="Formulario"
                defaultValue="---"
                onFocus={() =>
                  getValues("formulario") === "---"
                    ? setValue("formulario", "")
                    : null
                }
                onBlur={() =>
                  getValues("formulario") === ""
                    ? setValue("formulario", "---")
                    : null
                }
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Ruta */}
            <Grid item xs={12} sm={8} lg={6} sx={{ p: 1 }}>
              <TextField
                {...register("ruta")}
                label="Ruta"
                defaultValue="---"
                onFocus={() =>
                  getValues("ruta") === "---" ? setValue("ruta", "") : null
                }
                onBlur={() =>
                  getValues("ruta") === "" ? setValue("ruta", "---") : null
                }
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Habilitado */}
            <Grid item xs={12} sm={4} margin={1}>
              <Controller
                name="habilitadoForm"
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

            {/* Botones */}
            <Grid container spacing={2} margin={1}>
              <Button size="medium" variant="contained" type="submit">
                Guardar
              </Button>
              <Button
                size="medium"
                variant="outlined"
                sx={{ ml: 1 }}
                onClick={cancel}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </FormBoxContainer>
  );
};
