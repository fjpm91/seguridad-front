import { useEffect, useState } from "react";
import { Box, Grid, TextField, Button, Autocomplete } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackendResponse,
  Division,
  Empresa,
  UnidadOrganizativa,
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

export const UnidadOrganizativaForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [divisiones, setDivisiones] = useState<Division[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UnidadOrganizativa>();
  const { authState } = useAuth();
  const { user } = authState;
  const empresaWatched = watch("empresa_id");

  useEffect(() => {
    getEmpresas();
    getUnidadOrganizativaById();
  }, []);

  useEffect(() => {
    if (empresaWatched) {
      getDivisiones(empresaWatched);
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

  const getDivisiones = async (empresaId: number = 0) => {
    const { data } = await apiClient.get<BackendResponse>(
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

    setDivisiones([...data.data]);
  };

  const getUnidadOrganizativaById = async () => {
    if (!id || id === "0") return;

    const { data: response } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}/${id}`
    );

    if (!response) return;

    if (!response.success) {
      showMessage(response.message);
      return;
    }

    const modelData = response.data as UnidadOrganizativa;
    setValue("unidad_organizativa_id", modelData.unidad_organizativa_id);
    setValue("empresa_id", modelData.empresa_id);
    setValue("division_id", modelData.division_id);
    setValue("nombre", modelData.nombre);
    setValue("division_nombre", modelData.division_nombre);
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
        `/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}`,
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
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
    };

    try {
      const { data: response } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}/${id}`,
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

  const cancel = () => navigate(`/${ApiEndpoints.UNIDADES_ORGANIZATIVAS}`);

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
          p: 3, // 4 * 8
          borderRadius: 2, // 4 * 4
        }}
      >
        {/* Formulario */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Titulo Formulario */}
          <Grid item xs={12}>
            <PageTitle
              title="Formulario de Unidades Organizativas"
              variant="h5"
              divider={true}
            />
          </Grid>

          <Grid container item xs={12} sm={10} md={8} lg={6}>
            {/* ID */}
            <Grid item xs={12} md={4} sx={{ p: 1 }}>
              <TextField
                {...register("unidad_organizativa_id")}
                label="Id"
                defaultValue={0}
                type="number"
                disabled
                inputProps={{
                  readOnly: true,
                }}
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Empresa */}
            <Grid item xs={12} md={8} sx={{ p: 1 }}>
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
                          label="Empresa"
                          error={
                            errors.empresa_id?.type === "required"
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
              {errors.empresa_id?.type === "required" && (
                <ErrorText text="La Empresa es obligatoria" />
              )}
            </Grid>

            {/* Division */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Controller
                name="division_id"
                rules={{ required: "La division es obligatoria" }}
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
                          error={!!errors.division_id}
                          helperText={
                            errors.division_id
                              ? errors.division_id.message?.toString()
                              : ""
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
            </Grid>

            {/* Nombre Unidad */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("nombre", {
                  required: true,
                  minLength: { value: 4, message: "error message" },
                })}
                required
                label="Nombre"
                defaultValue="---"
                onFocus={() =>
                  getValues("nombre") === "---" ? setValue("nombre", "") : null
                }
                onBlur={() =>
                  getValues("nombre") === "" ? setValue("nombre", "---") : null
                }
                error={!!errors.nombre}
                sx={{ width: "100%" }}
              />
              {errors.nombre && <ErrorText text="El Nombre es obligatorio" />}
            </Grid>

            {/* Descripcion Unidad */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <TextField
                {...register("descripcion")}
                required
                label="Descripcion"
                defaultValue="----"
                onFocus={() =>
                  getValues("descripcion") === "----"
                    ? setValue("descripcion", "")
                    : null
                }
                onBlur={() =>
                  getValues("descripcion") === ""
                    ? setValue("descripcion", "----")
                    : null
                }
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
