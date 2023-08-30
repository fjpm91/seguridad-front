import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import { Controller, useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { BackendResponse, Componente } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FormBoxContainer, PageTitle } from "../../../../components";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const ComponentsForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const { authState } = useAuth();
  const {
    control,
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = authState;

  useEffect(() => {
    getComponentById();
  }, []);

  const getComponentById = async () => {
    if (!id || id === "0") return;

    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.COMPONENTES}/${id}`
    );

    if (!data) return;
    const componenteData = data.data as Componente;
    setValue("componente_id", componenteData.componente_id);
    setValue("nombre", componenteData.nombre);
    setValue("habilitado", componenteData.habilitado === 1 ? true : false);
  };

  const store = async (formData: any) => {
    const datos = { ...formData };

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}`,
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
      const { data } = await apiClient.put<BackendResponse>(
        `/${ApiEndpoints.COMPONENTES}/${id}`,
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
      showMessage(JSON.stringify(error));
    }
  };

  const cancel = () => navigate(`/${ApiEndpoints.COMPONENTES}`);

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
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Titulo Formulario */}
          <Grid item xs={12}>
            <PageTitle title="Formulario de Componentes" variant="h5" />
          </Grid>

          {/* Id */}
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              {...register("componente_id")}
              label="Id"
              defaultValue="0"
              disabled
              sx={{ width: "100%", pr: "16px" }}
            />
          </Grid>

          {/* Nombre */}
          <Grid item xs={12} sm={4}>
            <TextField
              {...register("nombre", {
                required: true,
                minLength: { value: 4, message: "error message" },
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
              sx={{ width: "100%", pr: "16px" }}
            />
            {(errors.nombre?.type === "required" ||
              errors.nombre?.type === "minLength") && (
              <Typography
                paddingLeft={2}
                paddingTop={1}
                fontSize={12.5}
                color={"#F36892"}
              >
                El nombre del componente es obligatorio
              </Typography>
            )}
          </Grid>

          {/* Habilitado */}
          <Grid item xs={12} sm={4} md={3}>
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
