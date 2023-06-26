import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { BackendResponse, Persona } from "../../../../interfaces/interfaces";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { ApiEndpoints } from "../../../../models/enums";
import {
  Autocomplete,
  Box,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

export const PersonasForm = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { control, register, setValue, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getPersonaById();
  }, []);

  const getPersonaById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.PERSONAS}/${id}`
    );

    if (!data) return;
    const userdata = data.data as Persona;
    setValue("persona_id", userdata.persona_id);
    setValue("nombre", userdata.nombre);
    setValue("apellido_paterno", userdata.apellido_paterno);
    setValue("apellido_materno", userdata.apellido_materno);
    setValue("correo", userdata.correo);
  };

  const cancel = () => navigate("/users");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
  };

  const submitForm = (event: any) => {
    console.log("🚀 ~ file: PersonasForm.tsx:50 ~ submitForm ~ event:", event);
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

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
            <Grid item xs={12} sm={4} md={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Personas */}
            <Grid item xs={12} sm={6} md={5} sx={{ pr: "16px" }}>
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
                      onChange={(event: any, newValue) => {
                        onChange(newValue ? newValue.persona_id : null);
                      }}
                      options={personas}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Personas *"
                          helperText="La Personas es obligatoria"
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

            {/* Username */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("name")}
                label="Username"
                defaultValue="xxx"
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={4} sx={{ pr: "16px" }}>
              <TextField
                {...register("email")}
                label="Email"
                defaultValue="email@empacar.com.bo"
                sx={{ width: "100%", pr: "16px" }}
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
        </Box>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={toastMessage}
      ></Snackbar>
    </Box>
  );
};
