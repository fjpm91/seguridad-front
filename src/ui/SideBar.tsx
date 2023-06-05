import Drawer from "@mui/material/Drawer";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import CollapsableItem from "../components/CollapsableItem";
import {
  Aplicacion,
  Modulo,
  Persona,
  Rol,
  User,
} from "../interfaces/interfaces";

interface Props {
  aplicacion: Aplicacion | null | undefined;
  open: boolean;
  persona: Persona | null;
  rol: Rol | null | undefined;
  user: User | null;
  modulos: Modulo[] | null | undefined;
  onOpenClose: () => void;
}

export function SideBar({
  aplicacion,
  open = false,
  persona,
  rol,
  modulos,
  onOpenClose,
}: Props) {
  return (
    <>
      <Drawer anchor="left" open={open} onClose={() => onOpenClose()}>
        <List>
          {/* Usuario */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText
                primary={persona?.nombre_completo}
                secondary={rol?.nombre}
              />
            </ListItemButton>
          </ListItem>

          <Divider />

          {/* Modulos dinamicos por rol */}
          {modulos?.map((modulo) =>
            modulo.menu ? (
              <CollapsableItem key={modulo?.modulo_id} modulo={modulo} />
            ) : null
          )}
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>{/* <MailIcon /> */}</ListItemIcon>
              <ListItemText primary={"Version: " + aplicacion?.version} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
