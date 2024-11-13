import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Autocomplete,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackendResponse,
  UnidadNegocio,
  Division,
  Empresa,
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

export const DivisionForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [unidadesNegocio, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [divisionActual, setDivisionActual] = useState<Division | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const { user } = authState;
  const empresaWatched = watch("empresa_id");

  useEffect(() => {
    // getUnidadesNegocio();
    getEmpresas();
  }, []);

  useEffect(() => {
    if (!empresaWatched) return;
    getUnidadesNegocio(empresaWatched);
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

  const getUnidadesNegocio = async (empresaId = 0) => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDAD_NEGOCIO}`,
      { params: { empresaId } }
    );

    if (!data) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }
    const mods = (data.data as UnidadNegocio[]).map((unidad) => {
      return {
        ...unidad,
        check: false,
      };
    });
    setUnidadesNegocio([...mods]);
    getDivisionById([...mods]);
  };

  const getDivisionById = async (listaUnidades?: UnidadNegocio[]) => {
    if (!id || id === "0") return;

    const { data: response } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.DIVISIONES}/${id}`
    );

    if (!response) {
      showMessage(Messages.NO_SE_PUDO_COMPLETAR);
      return;
    }

    if (!response.success) {
      showMessage(response.message);
      return;
    }

    const { data } = response;
    setValue("division_id", data.division_id);
    setValue("nombre", data.nombre);
    if (data.empresa_id) setValue("empresa_id", data.empresa_id);
    setDivisionActual(data);
    const lista = listaUnidades ? listaUnidades : [];
    markCheckedUnidades(data.unidades_negocio, lista);
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
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.DIVISIONES}`,
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
        navigate("/divisiones");
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      agregar_unidades: getDiferenciaUnidades(),
      eliminar_unidades: getDiferenciaEliminarUnidades(),
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? formData.habilitado : 0,
    };

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.DIVISIONES}/${id}`,
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
        navigate("/divisiones");
      }, 1000);
    } catch (error) {
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/" + ApiEndpoints.DIVISIONES);

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const handleCheckUnidad = (e: any) => {
    console.log("🚀 ~ file: DivisionForm.tsx:186 ~ handleCheckUnidad ~ e:", e);
    const { value } = e.target;
    const index = unidadesNegocio.findIndex((m) => m.id == value);
    if (index >= 0) {
      const unidadesModificadas = [...unidadesNegocio];
      const unidadBuscada = unidadesModificadas[index];
      unidadBuscada.check = !unidadBuscada.check;
      setUnidadesNegocio([...unidadesModificadas]);
    }
  };

  const markCheckedUnidades = (
    unidadesDivisionActual: UnidadNegocio[],
    listaUnidades: UnidadNegocio[]
  ) => {
    const unidadesDivision = listaUnidades ? [...listaUnidades] : [];
    if (!unidadesDivisionActual || unidadesDivisionActual?.length === 0) return;

    unidadesDivision.forEach((uApp) => {
      unidadesDivisionActual.forEach((uList) => {
        if (uApp.id === uList.id) uApp.check = true;
      });
    });
    setUnidadesNegocio([...unidadesDivision]);
  };

  const getDiferenciaUnidades = () => {
    const unidadesSeleccionadas = unidadesNegocio
      .filter((unidad) => unidad.check)
      .map((u) => u.id);
    const unidadesIniciales =
      divisionActual?.unidades_negocio.map((u) => u.id) ?? [];
    const diferencia = unidadesSeleccionadas.filter(
      (x) => unidadesIniciales.indexOf(x) === -1
    );
    return diferencia;
  };

  const getDiferenciaEliminarUnidades = () => {
    const unidadesNoSeleccionadas = unidadesNegocio
      .filter((unidad) => !unidad.check)
      .map((u) => u.id);
    const unidadesIniciales =
      divisionActual?.unidades_negocio.map((u) => u.id) ?? [];
    const diferencia = unidadesNoSeleccionadas.filter(
      (x) => unidadesIniciales.indexOf(x) !== -1
    );
    return diferencia;
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
            <PageTitle
              title="Formulario de Divisiones"
              variant="h5"
              divider={true}
            />
          </Grid>

          {/* Id */}
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField
              {...register("division_id")}
              label="Id"
              defaultValue="0"
              disabled
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Empresa */}
          <Grid item xs={12} md={6}>
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

          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              {...register("nombre", {
                required: true,
                minLength: { value: 4, message: "error message" },
              })}
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
              errors.nombre?.type === "minLength" ||
              getValues("nombre") === "0") && (
              <Typography paddingTop={1} fontSize={12.5} color={"#F36892"}>
                El nombre de la División es obligatorio
              </Typography>
            )}
          </Grid>

          {/* Unidades de Negocio */}
          {id !== "0" ? (
            <Grid item xs={12} sx={{ pr: "16px" }}>
              {unidadesNegocio.map((unidad) => (
                <div key={unidad.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={unidad.id}
                        checked={unidad.check}
                        onChange={(e) => {
                          handleCheckUnidad(e);
                        }}
                      />
                    }
                    label={unidad.id + " - " + unidad.nombre}
                  />
                </div>
              ))}
            </Grid>
          ) : null}
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
