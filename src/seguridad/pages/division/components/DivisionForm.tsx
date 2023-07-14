import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackendResponse,
  UnidadNegocio,
  Division,
} from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";
import apiClient from "../../../../services/api-client";
import { useAuth } from "../../../../auth/context/useAuth";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const DivisionForm = ({ setOpen, setToastMessage }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { register, setValue, handleSubmit } = useForm();
  const [unidadesNegocio, setUnidadesNegocio] = useState<UnidadNegocio[]>([]);
  const [divisionActual, setDivisionActual] = useState<Division | null>(null);
  const { user } = authState;

  useEffect(() => {
    getUnidadesNegocio();
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
      // habilitado: formData.habilitado ? formData.habilitado : 0,
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

  const cancel = () => navigate("/divisiones");

  const showMessage = (text: string = "Operacion correcta") => {
    setToastMessage(text);
    setOpen(true);
  };

  const handleCheckUnidad = (e: any) => {
    console.log("🚀 ~ file: DivisionForm.tsx:186 ~ handleCheckUnidad ~ e:", e);
    const { value } = e.target;
    const index = unidadesNegocio.findIndex(
      (m) => m.unidad_negocio_id == value
    );
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
        if (uApp.unidad_negocio_id === uList.unidad_negocio_id)
          uApp.check = true;
      });
    });
    setUnidadesNegocio([...unidadesDivision]);
  };

  const getDiferenciaUnidades = () => {
    const unidadesSeleccionadas = unidadesNegocio
      .filter((unidad) => unidad.check)
      .map((u) => u.unidad_negocio_id);
    const unidadesIniciales =
      divisionActual?.unidades_negocio.map((u) => u.unidad_negocio_id) ?? [];
    const diferencia = unidadesSeleccionadas.filter(
      (x) => unidadesIniciales.indexOf(x) === -1
    );
    return diferencia;
  };

  const getDiferenciaEliminarUnidades = () => {
    const unidadesNoSeleccionadas = unidadesNegocio
      .filter((unidad) => !unidad.check)
      .map((u) => u.unidad_negocio_id);
    const unidadesIniciales =
      divisionActual?.unidades_negocio.map((u) => u.unidad_negocio_id) ?? [];
    const diferencia = unidadesNoSeleccionadas.filter(
      (x) => unidadesIniciales.indexOf(x) !== -1
    );
    return diferencia;
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
                Formulario de Divisiones
              </Typography>
              <Divider />
            </Grid>

            {/* Id */}
            <Grid item xs={12} sm={4} md={3} lg={2} sx={{ pr: "16px" }}>
              <TextField
                {...register("division_id")}
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
                helperText="El Nombre de la Division es obligatorio"
                defaultValue="Nombre Division"
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Unidades de Negocio */}
            {id !== "0" ? (
              <Grid item xs={12} sm={8} sx={{ pr: "16px" }}>
                {unidadesNegocio.map((unidad) => (
                  <div key={unidad.unidad_negocio_id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={unidad.unidad_negocio_id}
                          checked={unidad.check}
                          onChange={(e) => {
                            handleCheckUnidad(e);
                          }}
                        />
                      }
                      label={unidad.unidad_negocio_id + " - " + unidad.nombre}
                    />
                  </div>
                ))}
              </Grid>
            ) : null}
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
