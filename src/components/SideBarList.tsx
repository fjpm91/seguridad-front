import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CollapsableItem from "./CollapsableItem";
import { AccountCircle } from "@mui/icons-material";
import { Aplicacion, Modulo, Persona, Rol, User } from "../interfaces/interfaces";

interface Props {
  aplicacion: Aplicacion;
  persona: Persona;
  user: User;
  rol: Rol;
}

const modulos: Modulo[] = [
  {
    modulo_id: 1,
    url: "/",
    nombre: "Inicio",
    titulo: "Inicio",
    icono: "home",
    menu: true,
    aplicacion_id: 1,
    modulo_padre: null,
    SubModulos: [],
  },
  {
    modulo_id: 2,
    url: "/usuarios-personas",
    nombre: "Usuarios y Personas",
    titulo: "Usuarios y Personas",
    icono: "PeopleAltIcon",
    menu: true,
    aplicacion_id: 2,
    modulo_padre: null,
    SubModulos: [
      {
        modulo_id: 5,
        url: "/usuarios",
        nombre: "Usuarios",
        titulo: "Usuarios",
        icono: "HttpsIcon",
        menu: true,
        aplicacion_id: 1,
        modulo_padre: 2,
        SubModulos: [],
      },
      {
        modulo_id: 6,
        url: "/personas",
        nombre: "Personas",
        titulo: "Personas",
        icono: "HttpsIcon",
        menu: true,
        aplicacion_id: 1,
        modulo_padre: null,
        SubModulos: [],
      },
    ],
  },
  {
    modulo_id: 3,
    url: "/aplicaciones",
    nombre: "Aplicaciones",
    titulo: "Aplicaciones",
    icono: "Apps",
    menu: true,
    aplicacion_id: 1,
    modulo_padre: null,
    SubModulos: [],
  },
  {
    modulo_id: 4,
    url: "/roles-accesos",
    nombre: "Roles y Accesos",
    titulo: "Roles y Accesos",
    icono: "HttpsIcon",
    menu: true,
    aplicacion_id: 1,
    modulo_padre: null,
    SubModulos: [
      {
        modulo_id: 7,
        url: "/roles",
        nombre: "Roles",
        titulo: "Roles",
        icono: "HttpsIcon",
        menu: false,
        aplicacion_id: 1,
        modulo_padre: null,
        SubModulos: [],
      },
      {
        modulo_id: 8,
        url: "/roles",
        nombre: "Roles",
        titulo: "Roles",
        icono: "HttpsIcon",
        menu: false,
        aplicacion_id: 1,
        modulo_padre: null,
        SubModulos: [],
      },
    ],
  },
];

const SideBarList = ({ aplicacion, persona, rol, user }: Props) => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText
              primary={persona?.nombre_completo}
              secondary={rol.nombre}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {modulos.map((modulo) => (
          <CollapsableItem key={modulo.modulo_id} modulo={modulo} />
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
