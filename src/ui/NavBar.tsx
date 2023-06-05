import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../auth";
import { Aplicacion } from "../interfaces/interfaces";

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
      <AppBar position="static">
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
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/")}
          >
            {aplicacion?.nombre}
          </Typography>

          <Button onClick={onLogout} color="inherit">
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};
