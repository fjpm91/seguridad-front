import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CollapsableItem from "./CollapsableItem";
import { Aplicacion, User } from "../App";
import { AccountCircle, Home } from "@mui/icons-material";

interface Props {
  user: User;
  aplicacion: Aplicacion;
}

export interface Modulo {
  id: number;
  Url: string;
  Nombre: string;
  Icono: string;
  Menu: boolean;
  Aplicacion_Id: number;
  Modulo_Padre: number | null;
  SubModulos: Modulo[] | [];
}

const accesos: Modulo[] = [
  {
    id: 1,
    Url: "/",
    Nombre: "Inicio",
    Icono: "home",
    Menu: true,
    Aplicacion_Id: 1,
    Modulo_Padre: null,
    SubModulos: [],
  },
  {
    id: 2,
    Url: "/usuarios-personas",
    Nombre: "Usuarios y Personas",
    Icono: "PeopleAltIcon",
    Menu: true,
    Aplicacion_Id: 2,
    Modulo_Padre: null,
    SubModulos: [
      {
        id: 5,
        Url: "/usuarios",
        Nombre: "Usuarios",
        Icono: "HttpsIcon",
        Menu: true,
        Aplicacion_Id: 1,
        Modulo_Padre: 2,
        SubModulos: [],
      },
      {
        id: 6,
        Url: "/personas",
        Nombre: "Personas",
        Icono: "HttpsIcon",
        Menu: true,
        Aplicacion_Id: 1,
        Modulo_Padre: null,
        SubModulos: [],
      },
    ],
  },
  {
    id: 3,
    Url: "/aplicaciones",
    Nombre: "Aplicaciones",
    Icono: "Apps",
    Menu: true,
    Aplicacion_Id: 1,
    Modulo_Padre: null,
    SubModulos: [],
  },
  {
    id: 4,
    Url: "/roles-accesos",
    Nombre: "Roles y Accesos",
    Icono: "HttpsIcon",
    Menu: true,
    Aplicacion_Id: 1,
    Modulo_Padre: null,
    SubModulos: [
      {
        id: 7,
        Url: "/roles",
        Nombre: "Roles",
        Icono: "HttpsIcon",
        Menu: false,
        Aplicacion_Id: 1,
        Modulo_Padre: null,
        SubModulos: [],
      },
      {
        id: 8,
        Url: "/roles",
        Nombre: "Roles",
        Icono: "HttpsIcon",
        Menu: false,
        Aplicacion_Id: 1,
        Modulo_Padre: null,
        SubModulos: [],
      },
    ],
  },
];

const SideBarList = ({ user, aplicacion }: Props) => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText
              primary={user.nombre_completo}
              secondary={user.nombre_rol}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {accesos.map((acceso) => (
          <CollapsableItem key={acceso.id} acceso={acceso} />
        ))}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{/* <MailIcon /> */}</ListItemIcon>
            <ListItemText primary={"Version: " + aplicacion.version} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};

export default SideBarList;
