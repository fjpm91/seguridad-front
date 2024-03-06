import { useEffect, useState } from "react";
import {
  BackendResponse,
  CentroCosto,
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
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
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
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const { authState } = useAuth();
  const { user } = authState;
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
  };

  const store = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      centros: centrosCosto,
    };
    console.log("🚀 ~ store ~ datos:", datos);
    return;

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

  const submitForm = (event: any) => {
    store(event);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const cancel = () => navigate("/personas");

  const handleCheckEncargadoCC = (e: any) => {
    const { value } = e.target;
    const index = centrosCosto.findIndex((cc) => cc.id == value);
    if (index >= 0) {
      const centrosCostoModificados = [...centrosCosto];
      const ccBuscado = centrosCostoModificados[index];
      ccBuscado.checkEncargado = !ccBuscado.checkEncargado;
      setCentrosCosto([...centrosCostoModificados]);
    }
  };

  const handleCheckPerteneceCC = (e: any) => {
    const { value } = e.target;
    const index = centrosCosto.findIndex((cc) => cc.id == value);
    if (index >= 0) {
      const centrosCostoModificados = [...centrosCosto];
      const ccBuscado = centrosCostoModificados[index];
      ccBuscado.checkPertenece = !ccBuscado.checkPertenece;
      setCentrosCosto([...centrosCostoModificados]);
    }
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
            <PageTitle title="Asignacion de Centros de Costo" variant="h5" />
          </Grid>

          <Grid container item lg={6}>
            {/* Id */}
            <Grid item xs={12} md={5} sx={{ p: 1 }}>
              <TextField
                {...register("persona_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={7} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                label="Nombre"
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
            <Grid item xs={12} md={5} sx={{ p: 1 }}>
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
            <Grid item xs={12} md={7} sx={{ p: 1 }}>
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
                          disabled
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
            <Grid item xs={12} sx={{ pr: "16px" }}>
              <Grid container item xs={12}>
                <List>
                  <ListItem>
                    <ListItemText primary="Centros de Costo" />
                  </ListItem>
                  {centrosCosto.map((centro) => (
                    <ListItem
                      key={centro.id}
                      sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        p: "0 0  0 8px",
                      }}
                    >
                      <ListItemText
                        primary={`${centro.codigo} - ${centro.nombre}`}
                      />
                      <div style={{ width: "100%" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={`check-pertenece-${centro.id}`}
                              value={centro.id}
                              // defaultChecked={false}
                              checked={centro.checkPertenece || false}
                              onChange={(e) => {
                                handleCheckPerteneceCC(e);
                              }}
                            />
                          }
                          label="Pertenece"
                          sx={{ flex: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={`check-encargado-${centro.id}`}
                              value={centro.id}
                              // defaultChecked={false}
                              checked={centro.checkEncargado || false}
                              onChange={(e) => {
                                handleCheckEncargadoCC(e);
                              }}
                            />
                          }
                          label="Encargado"
                        />
                        <Divider />
                      </div>
                    </ListItem>
                  ))}
                </List>
              </Grid>
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
