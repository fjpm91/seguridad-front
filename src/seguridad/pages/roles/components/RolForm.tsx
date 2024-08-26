import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
import { useAuth } from "../../../../auth/context/useAuth";
import apiClient from "../../../../services/api-client";
import {
  Aplicacion,
  BackendResponse,
  Rol,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import { ErrorText } from "../../../../components/ErrorText";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const RolForm = ({ setOpen, setToastMessage }: Props) => {
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
  const { authState } = useAuth();
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const { user } = authState;

  useEffect(() => {
    getAplicaciones();
    getRolById();
  }, []);

  const getRolById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Rol>(`/${ApiEndpoints.ROLES}/${id}`);

    if (!data) return;
    setValue("rol_id", data.rol_id);
    setValue("nombre", data.nombre);
    setValue("habilitado", data.habilitado === 1 ? true : false);
    setValue("codigo_app", data.aplicacion.codigo);
  };

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
    );

    if (!data) {
      showMessage("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      showMessage(data.message);
      return;
    }

    const apps: Aplicacion[] = (data.data as Aplicacion[]).map((aplicacion) => {
      return {
        ...aplicacion,
        codigo_nombre: `${aplicacion.codigo} - ${aplicacion.nombre}`,
      };
    });
    setAplicaciones([...apps]);
  };

  const store = async (formData: any) => {
    const aplicacionSeleccionada = aplicaciones.find(
      (ap) => ap.codigo === formData.codigo_app
    );
    const datos = {
      ...formData,
      aplicacion_id: aplicacionSeleccionada?.aplicacion_id,
      user: user?.id,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.ROLES}`,
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
        navigate("/roles");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const aplicacionSeleccionada = aplicaciones.find(
      (ap) => ap.codigo === formData.codigo_app
    );
    const datos = {
      ...formData,
      aplicacion_id: aplicacionSeleccionada?.aplicacion_id,
      user: user?.id,
    };
    console.log("🚀 ~ file: RolForm.tsx:120 ~ update ~ datos:", datos);
    // return;
    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.ROLES}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/roles");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: AplicacionForm.tsx:55 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/roles");

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
        <Grid container item xs={12} lg={6} xl={5}>
          {/* Id */}
          <Grid item xs={12} lg={3} sx={{ p: 1 }}>
            <TextField
              {...register("rol_id")}
              label="Id"
              defaultValue="0"
              disabled
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Aplicacion */}
          <Grid item xs={12} lg={9} sx={{ p: 1 }}>
            <Controller
              name="codigo_app"
              rules={{ required: true }}
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <Autocomplete
                    value={
                      value
                        ? aplicaciones.find(
                            (option) => value === option.codigo
                          ) ?? null
                        : null
                    }
                    getOptionLabel={(option) =>
                      `${option.codigo} - ${option.nombre}`
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.codigo_nombre}
                      </Box>
                    )}
                    onChange={(_event: any, newValue) =>
                      onChange(newValue ? newValue.codigo : null)
                    }
                    options={aplicaciones}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aplicación"
                        error={
                          errors.codigo_app?.type === "required" ? true : false
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
            {(errors.codigo_app?.type === "required" ||
              errors.codigo_app?.type === "minLength") && (
              <ErrorText text="La Aplicación es obligatoria" />
            )}
          </Grid>

          {/* Nombre */}
          <Grid item xs={12} lg={12} sx={{ p: 1 }}>
            <TextField
              {...register("nombre", {
                required: true,
                minLength: { value: 3, message: "error message" },
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
              <ErrorText text="El nombre del rol es obligatorio" />
            )}
          </Grid>

          {/* Habilitado */}
          <Grid item xs={12} sm={4} md={3} sx={{ p: 1 }}>
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
      </Grid>

      {/* Botones */}
      <Grid container sx={{ p: 1 }}>
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
  );
};
