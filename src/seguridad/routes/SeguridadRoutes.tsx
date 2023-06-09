import { useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../auth";
import {
  EmpresasPage,
  InicioPage,
  PersonasPage,
  RolesAccesosPage,
} from "../pages";
import { AplicacionForm, AplicacionesPage } from "../pages/aplicaciones";
import { ComponentesPage } from "../pages/componentes/ComponentesPage";
import { ModuloForm, ModulosPage } from "../pages/modulos";
import { NavBar, SideBar } from "../../ui";
import { RolesPage } from "../pages/roles/RolesPage";
import { RolForm } from "../pages/roles/components";
import { SeguridadProtectedRoutes } from "./SeguridadProtectedRoutes";
import { UsuariosPage } from "../pages/usuarios/UsuariosPage";

export const SeguridadRoutes = () => {
  const [openNavBar, setOpenNavBar] = useState(false);
  const { authState } = useContext(AuthContext);

  const { aplicacion, modulos, persona, rol, user } = authState;
  return (
    <>
      <NavBar aplicacion={aplicacion} onOpen={() => setOpenNavBar(!openNavBar)} />
      <SideBar
        aplicacion={aplicacion}
        open={openNavBar}
        persona={persona}
        rol={rol}
        user={user}
        modulos={modulos}
        onOpenClose={() => setOpenNavBar(false)}
      />

      <div>
        <Routes>
          <Route element={<SeguridadProtectedRoutes url="inicio" />}>
            <Route path="inicio" element={<InicioPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_accesos_index" />}>
            <Route path="roles-accesos" element={<RolesAccesosPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="accesos_index" />}>
            <Route path="accesos" element={<RolesAccesosPage />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="aplicaciones_index" />}
          >
            <Route path="aplicaciones" element={<AplicacionesPage />} />
            <Route path="aplicaciones/:id" element={<AplicacionForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="empresas_index" />}>
            <Route path="empresas" element={<EmpresasPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="modulos_index" />}>
            <Route path="modulos" element={<ModulosPage />} />
            <Route path="modulos/:id" element={<ModuloForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="componentes_index" />}>
            <Route path="componentes" element={<ComponentesPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="personas_index" />}>
            <Route path="personas" element={<PersonasPage />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="personas_usuarios_index" />}
          >
            <Route path="personas-usuarios" element={<AplicacionesPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_index" />}>
            <Route path="roles" element={<RolesPage />} />
            <Route path="roles/:id" element={<RolForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="usuarios_index" />}>
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/inicio" />} />
        </Routes>
      </div>
    </>
  );
};
