import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../auth";
import { Aplicacion } from "../interfaces/interfaces";
import { Logout } from "@mui/icons-material";

interface Props {
  aplicacion: Aplicacion | null | undefined;
  onOpen: () => void;
}

const vaciarStorage = () => {
  localStorage.clear();
};

export const NavBar = ({ aplicacion, onOpen }: Props) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    vaciarStorage();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => onOpen()}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}
            onClick={() => navigate("/")}
          >
            {aplicacion?.nombre}
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}
            onClick={() => navigate("/")}
          >
            {aplicacion?.codigo}
          </Typography>

          <Button
            sx={{ display: { xs: "none", sm: "block" } }}
            onClick={onLogout}
            color="inherit"
          >
            Cerrar sesión
          </Button>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logout"
            sx={{ display: { sm: "none", xs: "block" } }}
            onClick={onLogout}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};
