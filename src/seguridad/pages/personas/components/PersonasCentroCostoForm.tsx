import { useEffect, useState } from "react";
import {
  BackendResponse,
  CentroCosto,
  Empresa,
  PCC,
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
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FormBoxContainer, PageTitle } from "../../../../components";
import { ErrorText } from "../../../../components/ErrorText";
import { Check, Close, Delete } from "@mui/icons-material";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const PersonasCentroCostoForm = ({
  setOpen,
  setToastMessage,
}: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [centrosCosto, setCentrosCosto] = useState<CentroCosto[]>([]);
  const [centrosCostoPersona, setCentrosCostoPersona] = useState<PCC[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const empresaWatched = watch("empresa_id");
  const unidadNegocioWatched = watch("unidad_negocio_id");

  useEffect(() => {
    getEmpresas();
    getPersonaById();
    if (id === "0") getUnidadesNegocio();
  }, []);

  useEffect(() => {
    if (empresaWatched) {
      getUnidadesNegocio(empresaWatched);
    }
  }, [empresaWatched]);

  useEffect(() => {
    if (unidadNegocioWatched) {
      getCentrosCosto(unidadNegocioWatched);
    }
  }, [unidadNegocioWatched]);

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

  const getCentrosCosto = async (unidadNegocioId?: number) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CENTROS_COSTO}`,
      {
        params: {
          unidadNegocioId: unidadNegocioId ? unidadNegocioId : 0,
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

    const centros = (data.data as CentroCosto[]).map((m) => {
      return {
        ...m,
        checkEncargado: false,
        checkPertenece: false,
      };
    });
    setCentrosCosto([...centros]);
  };

  const getPersonaById = async () => {
    if (!id || id === "0") return;

    const datos = {
      persona_id: id,
      user: 1,
      personaCC: true,
    };
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}/${id}`,
      {
        params: datos,
      }
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
    setValue("nombre", userdata.nombre_completo);
    setValue("unidad_negocio_id", userdata.unidad_negocio_id);
    if (userdata.empresa_id) setValue("empresa_id", userdata.empresa_id);
    if (userdata.user) setValue("user", userdata.user.name);
    if (userdata.habilitado)
      setValue("habilitado", userdata.habilitado ? true : false);
    if (userdata.centro_costo_encargado)
      setValue("encargado", userdata.centro_costo_encargado === 1 ? true : 0);
    if (userdata.centro_costo_id)
      setValue("centro_costo_id", userdata.centro_costo_id);
    if (userdata.persona_centros_costos) {
      // const pcc = userdata.persona_centros_costos.map((x) => {
      //   return {
      //     ...x,
      //     centro_costo_id: x.centro_costos.id,
      //     nombre: x.centro_costos.nombre,
      //     codigo: x.centro_costos.codigo,
      //     persona_centro_costo_id: x.id,
      //   };
      // });
      // setCentrosCostoPersona([...pcc]);
      setCentrosCostoPersona([...userdata.persona_centros_costos]);
    }
  };

  const store = async (formData: any) => {
    const datos = {
      ...formData,
      encargado: formData.encargado ? 1 : 0,
    };
    console.log("🚀 ~ store ~ datos:", datos);

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.PERSONAS_CENTROS_COSTO}`,
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
        // cancel();
        resetForm();
        getPersonaById();
      }, 500);
    } catch (error) {
      console.log("🚀 ~ file: PersonasForm.tsx:143 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const submitForm = (event: any) => {
    store(event);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const cancel = () => navigate("/personas");

  const handleEliminar = async (centroCosto: PCC) => {
    try {
      const datos = {
        persona_id: centroCosto.persona_id,
        persona_centro_costo_id: centroCosto.id,
        centro_costo_id: centroCosto.cc_id,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ELIMINAR_ASIGNACION_PCC}`,
        datos
      );

      if (!data) {
        showMessage("No se pudo completar la operación");
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      showMessage(data.message);
      getPersonaById();
    } catch (error) {
      console.log(error);
    }
  };

  const handleActualizarEncargado = async (pcc: PCC) => {
    console.log("🚀 ~ handleActualizarEncargado ~ centroCosto:", pcc);
    try {
      const datos = {
        persona_id: pcc.persona_id,
        persona_centro_costo_id: pcc.id,
        centro_costo_id: pcc.cc_id,
        encargado: pcc.cc_encargado,
      };
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ACTUALIZAR_ENCARGADO_PCC}`,
        datos
      );

      if (!data) {
        showMessage("No se pudo completar la operación");
        return;
      }

      if (!data.success) {
        showMessage(data.message);
        return;
      }

      showMessage(data.message);
      getPersonaById();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setValue("centro_costo_id", 0);
    setValue("encargado", false);
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
              title="Asignacion de Centros de Costo"
              variant="h5"
              divider={true}
            />
          </Grid>

          <Grid container item xs={12} lg={6}>
            {/* Id */}
            {/* <Grid item xs={12} md={5} sx={{ p: 1 }}>
              <TextField
                {...register("persona_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid> */}

            {/* Nombre */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                label="Persona"
                defaultValue="..."
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
              {(errors.nombre?.type === "required" ||
                errors.nombre?.type === "minLength") && (
                <ErrorText text="El Nombre es obligatorio" />
              )}
            </Grid>

            {/* Empresa */}
            <Grid item xs={12} sx={{ p: 1 }}>
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
                          disabled
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

            {/* Centros de Costo */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Controller
                name="centro_costo_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? centrosCosto.find(
                              (option) => value === option.id
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
                        onChange(newValue ? newValue.id : null);
                      }}
                      options={centrosCosto}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Centro de Costo"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          error={
                            errors.centro_costo_id?.type === "required"
                              ? true
                              : false
                          }
                        />
                      )}
                    />
                  );
                }}
              />
              {errors.centro_costo_id?.type === "required" && (
                <ErrorText text="El Centro de Costo es obligatorio" />
              )}
            </Grid>

            {/* Encargado */}
            <Grid item xs={12} sm={4} md={3}>
              <Controller
                name="encargado"
                control={control}
                render={({ field }) => (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{ ml: 1 }}
                          onChange={(e) => field.onChange(e.target.checked)}
                          checked={field.value || false}
                        />
                      }
                      label="Encargado"
                    />
                  </FormGroup>
                )}
              />
            </Grid>

            {/* Botones */}
            <Grid container item sx={{ p: 1 }}>
              <Grid item xs={6}>
                <Button
                  size="medium"
                  variant="contained"
                  sx={{ width: { xs: "100%", sm: "initial" } }}
                  type="submit"
                >
                  Asignar
                </Button>
              </Grid>

              <Grid item xs={6}>
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

          {/* Centros de Costo */}
          <Grid item xs={12} lg={6} sx={{ pl: 2 }}>
            <Typography variant="body2">Centros de Costo Asignados</Typography>
            <Divider />
            <List>
              {centrosCostoPersona.map((cc) => (
                <ListItem key={cc.id}>
                  <ListItemText
                    primary={`${cc.cc_codigo} - ${cc.cc_nombre}`}
                    secondary={cc.cc_encargado ? "Encargado" : "---"}
                  />

                  <Tooltip
                    title={
                      cc.cc_encargado
                        ? "Quitar Encargado"
                        : "Marcar como Encargado"
                    }
                  >
                    <IconButton
                      color={cc.cc_encargado ? "warning" : "default"}
                      onClick={() => handleActualizarEncargado(cc)}
                    >
                      {cc.cc_encargado ? <Close /> : <Check />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar Asignacion de CC">
                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(cc)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </FormBoxContainer>
  );
};
