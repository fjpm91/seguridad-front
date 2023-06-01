import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User, Aplicacion } from "../interfaces/interfaces";

interface Props {
  user: User;
  aplicacion: Aplicacion;
  onOpen: () => void;
}

const ButtonAppBar = ({ user, aplicacion, onOpen }: Props) => {
  const botones = user.persona_id ? (
    <Button color="inherit">Cerrar sesión</Button>
  ) : (
    <Button color="inherit">Login</Button>
  );
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {aplicacion.nombre}
          </Typography>
          {botones}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default ButtonAppBar;
