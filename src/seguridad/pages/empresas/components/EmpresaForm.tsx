import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { BackendResponse, Empresa } from "../../../../interfaces/interfaces";
import { UseToastMessage } from "../../../../hooks/useToastMessage";
import apiClient from "../../../../services/api-client";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

export const EmpresaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const { user } = authState;

  useEffect(() => {
    getEmpresaById();
  }, []);

  const getEmpresaById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<Empresa>(
      `/${ApiEndpoints.EMPRESAS}/${id}`
    );

    if (!data) return;
    console.log("🚀 ~ file: EmpresaForm.tsx:52 ~ getEmpresaById ~ data:", data);
    setValue("empresa_id", data.empresa_id);
    setValue("nombre", data.nombre);
    setValue("habilitado", data.habilitado === 1 ? true : false);
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
      habilitado: formData.habilitado ? formData.habilitado : 0,
    };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.EMPRESAS}`,
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
        navigate("/empresas");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: EmpresaForm.tsx:79 ~ store ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const update = async (formData: any) => {
    const datos = {
      ...formData,
      user: user?.id,
      codigo_app: import.meta.env.VITE_CODIGO_APP,
      habilitado: formData.habilitado ? formData.habilitado : 0,
    };
    console.log("🚀 ~ file: EmpresaForm.tsx:91 ~ update ~ datos:", datos);

    try {
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.EMPRESAS}/${id}`,
        datos
      );
      if (!data) {
        showMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }

      showMessage(data.message);
      setTimeout(() => {
        navigate("/empresas");
      }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: EmpresaForm.tsx:109 ~ update ~ error:", error);
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate("/empresas");

  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
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
                Formulario de Empresas
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("empresa_id")}
                label="Id"
                defaultValue="0"
                disabled
                sx={{ width: "100%", pr: "16px" }}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6} sx={{ pr: "16px" }}>
              <TextField
                {...register("nombre", { required: true })}
                required
                label="Nombre"
                helperText="El Nombre de la Empresa es obligatorio"
                defaultValue="Nombre Empresa"
                sx={{ width: "100%" }}
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
