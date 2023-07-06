import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import apiClient from "../../services/api-client";
import { AuthContext } from "../context";
import { StorageKeys } from "../../models/enums";
import { BackendResponse, Modulo } from "../../interfaces/interfaces";

const guardarState = (
  accesos: any,
  aplicacion: any,
  modulos: any,
  persona: any,
  rol: any,
  user: any,
  token: any
) => {
  localStorage.setItem(StorageKeys.ACCESOS, JSON.stringify(accesos));
  localStorage.setItem(StorageKeys.APLICACION, JSON.stringify(aplicacion));
  localStorage.setItem(StorageKeys.MODULOS, JSON.stringify(modulos));
  localStorage.setItem(StorageKeys.PERSONA, JSON.stringify(persona));
  localStorage.setItem(StorageKeys.ROL, JSON.stringify(rol));
  localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
  localStorage.setItem(StorageKeys.USER_TOKEN, token);
  localStorage.setItem(StorageKeys.LOGGED, JSON.stringify(true));
};

const ordenarModulos = (modulos: Modulo[]) => {
  const operaciones = ["query", "insert", "update", "delete"];
  modulos.forEach((moduloPadre) => {
    moduloPadre.SubModulos = [];
    modulos.forEach((moduloHijo) => {
      const nombreModuloHijo = moduloHijo.nombre.split("_");
      const found = operaciones.some((r) => nombreModuloHijo.indexOf(r) >= 0);
      if (moduloPadre.modulo_id === moduloHijo.modulo_padre && !found) {
        moduloPadre.SubModulos?.push(moduloHijo);
      }
    });
  });
  return modulos;
};

export const LoginPage = () => {
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    try {
      if (!dataForm.get("username") || !dataForm.get("password")) {
        console.log("Datos invalidos");
        return;
      }

      const response = await apiClient.post<BackendResponse>("/login", {
        username: dataForm.get("username"),
        password: dataForm.get("password"),
        codigo_app: import.meta.env.VITE_CODIGO_APP,
      });

      if (!response) {
      }

      const { success, message, data } = response.data;

      if (!success) {
        showMessage(JSON.stringify(message));
        return;
      }

      const { accesos, aplicacion, modulos, persona, rol, token, user } = data;
      const modulosOrdenados: Modulo[] = ordenarModulos(modulos);
      const open = false;
      guardarState(
        accesos,
        aplicacion,
        modulosOrdenados,
        persona,
        rol,
        user,
        token
      );
      login(
        accesos,
        aplicacion,
        modulos,
        open,
        persona,
        rol,
        token,
        user,
        true
      );

      navigate("/");
    } catch (error: any) {
      console.log(error);
      const { response } = error;
      if (response) {
        const { data } = response;
        showMessage(data.message);
        return;
      }
      showMessage(JSON.stringify(error));
    }
  };

  const showMessage = (text: string = "Operacion correcta") => {
    setMessage(text);
    // setOpen(true);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sistema de Seguridad y Accesos
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de usuario"
                name="username"
                autoComplete="usuario"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar sesión
              </Button>

              {message && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {message}
                </Alert>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
