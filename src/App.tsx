import { useState } from "react";
import "./App.css";
import ButtonAppBar from "./components/ButtonAppBar";
import SideBar from "./components/SideBar";
import { Box, Card, Container, Typography } from "@mui/material";
import MainContent from "./components/MainContent";
import { Modulo } from "./components/SideBarList";

export interface User {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rol: number;
  nombre_rol: string;
  nombre_completo: string;
}

export interface Aplicacion {
  aplicacion_id: number;
  codigo: string;
  nombre: string;
  titulo: string;
  icono: string;
  url: string;
  descripcion: string;
  version: string;
}

const currentUser: User = {
  nombre: "Luis Alberto",
  apellido_paterno: "Mendez",
  apellido_materno: "Anez",
  rol: 3,
  nombre_rol: "Administrador del sistema",
  nombre_completo: "Luis Alberto Mendez Anez",
};

const aplicacion: Aplicacion = {
  aplicacion_id: 1,
  codigo: "SSA",
  nombre: "Sistema de Seguridad y Accesos",
  titulo: "Sistema de Seguridad y Accesos",
  icono: "lock",
  url: "",
  descripcion: "",
  version: "0.0.1",
};

const modulo: Modulo = {
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
};

function App() {
  const [openState, setOpenState] = useState(false);
  return (
    <>
      <ButtonAppBar
        user={currentUser}
        aplicacion={aplicacion}
        onOpen={() => setOpenState(!openState)}
      />
      <SideBar
        user={currentUser}
        aplicacion={aplicacion}
        open={openState}
        onOpenClose={() => setOpenState(false)}
      />
      <MainContent modulo={modulo} />
    </>
  );
}

export default App;
