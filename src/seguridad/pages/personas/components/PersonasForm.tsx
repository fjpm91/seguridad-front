import { useEffect, useState } from "react";
import {
  BackendResponse,
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
  Container,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const PersonasForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, register, setValue, handleSubmit } = useForm();
  const [unidades, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);

  useEffect(() => {
    getUnidadesNegocio();
    getPersonaById();
  }, []);

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
    setValue("nombre_completo", userdata.nombre_completo);
    setValue("cargo", userdata.cargo);
    setValue("ubicacion", userdata.ubicacion);
    setValue("apellido_paterno", userdata.apellido_paterno);
    setValue("apellido_materno", userdata.apellido_materno);
    setValue("unidad_negocio_id", userdata.unidad_negocio_id);
  };

  const submitForm = (event: any) => {
    console.log("🚀 ~ file: PersonasForm.tsx:50 ~ submitForm ~ event:", event);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const cancel = () => navigate("/personas");

  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <Container sx={{ p: 0 }}>
        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{
            backgroundColor: "white",
            p: 4, // 4 * 8
            borderRadius: 2, // 4 * 4
          }}
        >
          {/* Formulario */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Titulo Formulario */}
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="div"
                sx={{ flexGrow: 1, mb: 2 }}
              >
                Formulario de Usuarios
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("persona_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Codigo */}
            <Grid item xs={12} sm={3} md={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("codigo")}
                label="Codigo"
                defaultValue="0"
                disabled={id ? true : false}
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Nombre Completo */}
            <Grid item xs={12} sm={5} md={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre_completo")}
                label="Nombre Completo"
                defaultValue="..."
                disabled={id ? true : false}
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Cargo */}
            <Grid item xs={12} sm={5} md={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("cargo")}
                label="Cargo"
                defaultValue="..."
                disabled={id ? true : false}
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Ciudad */}
            <Grid item xs={12} sm={5} md={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("ubicacion")}
                label="Ciudad"
                defaultValue="..."
                disabled={id ? true : false}
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Unidad de Negocio */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
              <Controller
                name="unidad_negocio_id"
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
                      getOptionLabel={(option) => option.nombre}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.nombre}
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
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>

            {/* Habilitado */}
            <Grid item xs={12} sm={4} md={3} sx={{ pr: "16px" }}>
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
            <Grid item>
              <Button size="medium" variant="contained" type="submit">
                Guardar
              </Button>
            </Grid>

            <Grid item>
              <Button size="medium" variant="outlined" onClick={cancel}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
