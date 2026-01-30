import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  BackendResponse,
  Cargo,
  Division,
  Empresa,
  UnidadNegocio,
  UnidadOrganizativa,
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
  const [unidadesOrganizativas, setUnidadesOrganizativas] = useState<
    UnidadOrganizativa[]
  >([]);
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const { user } = authState;
  const empresaWatched = watch("empresa_id");
  const divisionWatched = watch("division_id");

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
    console.log("🚀 ~ useEffect ~ empresaWatched:", empresaWatched);
    if (!empresaWatched) return;
    getUnidadesNegocio(empresaWatched);
    getCargos(empresaWatched);
    getDivisiones(empresaWatched);
  }, [empresaWatched]);

  useEffect(() => {
    if (divisionWatched) {
      getUnidadesOrganizativas(divisionWatched);
    }
  }, [divisionWatched]);

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

  const getDivisiones = async (empresaId: number = 0) => {
    const { data } = await apiClient.get<BackendResponse<Division[]>>(
      `/${ApiEndpoints.DIVISIONES}`,
      {
        params: {
          empresaId,
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

    const divisionesData = data.data;
    setDivisiones([
      ...divisionesData.sort((a, b) => a.nombre.localeCompare(b.nombre)),
    ]);
  };

  const getUnidadesOrganizativas = async (divisionId: number = 0) => {
    const { data } = await apiClient.get<BackendResponse<UnidadOrganizativa[]>>(
      `/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}`,
      {
        params: { divisionId },
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
    const unidadesData = data.data;
    setUnidadesOrganizativas([
      ...unidadesData.sort((a, b) => a.nombre.localeCompare(b.nombre)),
    ]);
  };

  const getCargos = async (empresaId?: number) => {
    const { data } = await apiClient.get<BackendResponse<Cargo[]>>(
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
    const newLocal = data.data;
    setCargos([
      ...newLocal.sort((a, b) => a.cargo_nombre.localeCompare(b.cargo_nombre)),
    ]);
  };

  const getCargoById = async () => {
    if (!id || id === "0") return;

    const { data: dataResponse } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.CARGOS}/${id}`
    );

    const data: Cargo = dataResponse.data;
    if (!data) return;
    setValue("cargo_id", data.cargo_id);
    setValue("cargo_nombre", data.cargo_nombre);
    setValue("unidad_negocio_id", data.unidad_negocio_id);
    setValue("empresa_id", data.empresa_id);
    if (data.superior_id) setValue("superior_id", data.superior_id);
    if (data.division_id) setValue("division_id", data.division_id);
    if (data.unidad_organizativa_id)
      setValue("unidad_organizativa_id", data.unidad_organizativa_id);
    if (data.cargo_descripcion)
      setValue("cargo_descripcion", data.cargo_descripcion);
    if (data.cargo_salario) setValue("cargo_salario", data.cargo_salario);
    if (data.cargo_competencias)
      setValue("cargo_competencias", data.cargo_competencias);
    if (data.monto_minimo_salario)
      setValue("monto_minimo_salario", data.monto_minimo_salario);
    if (data.monto_maximo_salario)
      setValue("monto_maximo_salario", data.monto_maximo_salario);
    if (data.total_vacantes) setValue("total_vacantes", data.total_vacantes);
    if (data.vacantes_ocupadas)
      setValue("vacantes_ocupadas", data.vacantes_ocupadas);
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
            <PageTitle
              title="Formulario de Cargos"
              variant="h5"
              divider={true}
            />
          </Grid>

          <Grid container item lg={6}>
            {/* Id */}
            <Grid item xs={12} lg={4} sx={{ p: 1 }}>
              <TextField
                {...register("cargo_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Empresa */}
            <Grid item xs={12} lg={8} sx={{ p: 1 }}>
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

            {/* Division */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Controller
                name="division_id"
                rules={{ required: true }}
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

            {/* Unidad Organizativa */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Controller
                name="unidad_organizativa_id"
                rules={{ required: true }}
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Autocomplete
                      value={
                        value
                          ? unidadesOrganizativas.find(
                              (option) =>
                                value === option.unidad_organizativa_id
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
                        onChange(
                          newValue ? newValue.unidad_organizativa_id : null
                        )
                      }
                      options={unidadesOrganizativas}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Unidad Organizativa"
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

            {/* Cargo Superior */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Controller
                name="superior_id"
                // rules={{ required: true }}
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
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("cargo_nombre", {
                  required: {
                    value: true,
                    message: "El nombre del cargo es obligatorio",
                  },
                  minLength: {
                    value: 4,
                    message:
                      "El Nombre del Cargo debe ser mayor o igual a 4 caracteres",
                  },
                })}
                required
                label="Nombre"
                defaultValue="---"
                error={!!errors.cargo_nombre}
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
              {errors.cargo_nombre && (
                <ErrorText
                  text={errors.cargo_nombre.message?.toString() || "Error"}
                />
              )}
            </Grid>

            {/* Descripcion */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("cargo_descripcion", {
                  required: {
                    value: true,
                    message: "La descripcion es obligatoria",
                  },
                  minLength: {
                    value: 4,
                    message: "La descripcion debe ser mayor a 4 caracteres",
                  },
                })}
                label="Descripcion"
                defaultValue="-----"
                error={!!errors.cargo_descripcion}
                onFocus={() =>
                  getValues("cargo_descripcion") === "-----"
                    ? setValue("cargo_descripcion", "")
                    : null
                }
                onBlur={() =>
                  getValues("cargo_descripcion") === ""
                    ? setValue("cargo_descripcion", "-----")
                    : null
                }
                sx={{ width: "100%" }}
              />
              {errors.cargo_descripcion && (
                <ErrorText
                  text={errors.cargo_descripcion.message?.toString() || "Error"}
                />
              )}
            </Grid>

            {/* Competencias */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("cargo_competencias", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                label="Competencias"
                defaultValue="---"
                error={
                  errors.cargo_competencias?.type === "required" ||
                  errors.cargo_competencias?.type === "minLength"
                    ? true
                    : false
                }
                onFocus={() =>
                  getValues("cargo_competencias") === "---"
                    ? setValue("cargo_competencias", "")
                    : null
                }
                onBlur={() =>
                  getValues("cargo_competencias") === ""
                    ? setValue("cargo_competencias", "---")
                    : null
                }
                sx={{ width: "100%" }}
              />
              {(errors.cargo_competencias?.type === "required" ||
                errors.cargo_competencias?.type === "minLength") && (
                <ErrorText text="El Nombre del Cargo debe ser mayor o igual a 3 caracteres" />
              )}
            </Grid>

            {/* Salario Minimo */}
            <Grid item xs={12} md={6} sx={{ p: 1 }}>
              <TextField
                {...register("monto_minimo_salario", {})}
                label="Monto Minimo Salario"
                defaultValue={0}
                type="number"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Salario Maximo */}
            <Grid item xs={12} md={6} sx={{ p: 1 }}>
              <TextField
                {...register("monto_maximo_salario", {})}
                label="Monto Maximo Salario"
                defaultValue={0}
                type="number"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Total Vacantes */}
            <Grid item xs={12} md={6} sx={{ p: 1 }}>
              <TextField
                {...register("total_vacantes", {})}
                label="Total Vacantes"
                defaultValue={0}
                type="number"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Vacantes Ocupadas */}
            <Grid item xs={12} md={6} sx={{ p: 1 }}>
              <TextField
                {...register("vacantes_ocupadas", {})}
                label="Vacantes Ocupadas"
                defaultValue={0}
                inputProps={{
                  readOnly: true,
                }}
                sx={{ width: "100%" }}
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
