import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import {
  BackendResponse,
  Cargo,
  Empresa,
  Persona,
  UnidadNegocio,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";
import apiClient from "../../../../services/api-client";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const AsignarCargoForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const empresaWatched = watch("empresa_id");
  const unidadNegocioWatched = watch("unidad_negocio_id");
  const personaWatched = watch("persona_id");

  useEffect(() => {
    getEmpresas();
    getPersonas({});
    getCargos({});
    getCargoById();
    if (id === "0") {
      getUnidadesNegocio();
      getCargos({});
    }
  }, []);

  useEffect(() => {
    if (empresaWatched) {
      getUnidadesNegocio(empresaWatched);
      getPersonas({ empresaId: empresaWatched });
      getCargos({ empresaId: empresaWatched });
    }
  }, [empresaWatched]);

  useEffect(() => {
    if (unidadNegocioWatched) {
      getPersonas({ unidadNegocioId: unidadNegocioWatched });
      getCargos({ unidadNegocioId: unidadNegocioWatched });
      setValue("cargo_nombre", "---");
    }
  }, [unidadNegocioWatched]);

  useEffect(() => {
    if (personaWatched) {
      const personaBuscada = personas.find(
        (x) => x.persona_id === personaWatched
      );
      setValue("cargo_nombre", personaBuscada?.cargos?.nombre || "---");
    }
  }, [personaWatched]);

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

  const getPersonas = async ({ empresaId = 0, unidadNegocioId = 0 }) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}`,
      {
        params: {
          empresaId,
          unidadNegocioId,
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

    setPersonas([...data.data]);
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

  const getCargos = async ({ empresaId = 0, unidadNegocioId = 0 }) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CARGOS}`,
      {
        params: {
          empresaId,
          unidadNegocioId,
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
    // const datos = { ...formData };

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.ACTUALIZAR_CARGOS}`,
        {
          ...formData,
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
        // cancel();
        resetForm();
      }, 500);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
    }
  };

  const cancel = () => navigate(`/${ApiEndpoints.CARGOS}`);

  const submitForm = (event: any) => {
    store(event);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const resetForm = () => {
    setValue("persona_id", 0);
    setValue("cargo_nombre", "---");
    setValue("cargos_id", 0);
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
            <PageTitle
              title="Formulario para Asignacion de Cargos"
              variant="h5"
            />
          </Grid>

          <Grid container item lg={6}>
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

            {/* Colaborador */}
            <Grid item xs={10}>
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
                      onChange={(_event: any, newValue) =>
                        onChange(newValue ? newValue.persona_id : null)
                      }
                      options={personas}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Colaborador *"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.persona_id?.type === "required"
                              ? true
                              : false
                          }
                        />
                      )}
                      sx={{ mt: 1 }}
                    />
                  );
                }}
              />
            </Grid>

            {/* Cargo Actual Colaborador */}
            <Grid item xs={10}>
              <TextField
                {...register("cargo_nombre")}
                label="Cargo Actual"
                defaultValue="---"
                disabled
                sx={{ width: "100%", mt: 1 }}
              />
            </Grid>

            {/* Cargos */}
            <Grid item xs={10}>
              <Controller
                name="cargos_id"
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
                      getOptionLabel={(option) => option.cargo_nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.cargo_nombre}
                        </Box>
                      )}
                      onChange={(_event: any, newValue) =>
                        onChange(newValue ? newValue.cargo_id : null)
                      }
                      options={cargos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cargo *"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.cargos_id?.type === "required" ? true : false
                          }
                        />
                      )}
                      sx={{ mt: 1 }}
                    />
                  );
                }}
              />
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
