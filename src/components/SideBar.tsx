import Drawer from "@mui/material/Drawer";
import {
  Aplicacion,
  Modulo,
  Persona,
  Rol,
  User,
} from "../interfaces/interfaces";
import { AccountCircle } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CollapsableItem from "./CollapsableItem";

interface Props {
  aplicacion: Aplicacion | null | undefined;
  open: boolean;
  persona: Persona | null;
  rol: Rol | null | undefined;
  user: User | null;
  modulos: Modulo[] | null | undefined;
  onOpenClose: () => void;
}
export default function SideBar({
  aplicacion,
  open = false,
  persona,
  rol,
  modulos,
  onOpenClose,
}: Props) {
  // const [state, setState] = React.useState(open);

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
          {modulos?.map((modulo) => (
             modulo.menu ? <CollapsableItem key={modulo?.modulo_id} modulo={modulo} /> : null
          ))}
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
