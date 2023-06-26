import { useContext } from "react";
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
import { EmpresaForm } from "../pages/empresas";
import { UsersForm } from "../pages/usuarios";
import { RolesAccesosForm } from "../pages/rolesAccesos";
import { BitacoraPage } from "../pages/bitacora";
import { UsuarioRolForm } from "../pages/usuarioRol";
import { ComponentsForm } from "../pages/componentes";
import { RolAsignacionForm, RolAsignacionPage } from "../pages/rolAsignacion";

export const SeguridadRoutes = () => {
  // const [openNavBar, setOpenNavBar] = useState(false);
  const { authState, toggle } = useContext(AuthContext);

  const { aplicacion, modulos, persona, rol, user } = authState;
  return (
    <>
      <NavBar aplicacion={aplicacion} onOpen={() => toggle(!authState.open)} />
      <SideBar
        aplicacion={aplicacion}
        open={authState.open}
        persona={persona}
        rol={rol}
        user={user}
        modulos={modulos}
        onCloseSideBar={() => toggle(false)}
      />

      <div>
        <Routes>
          <Route element={<SeguridadProtectedRoutes url="inicio" />}>
            <Route path="inicio" element={<InicioPage />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="roles_accesos_index" />}
          >
            <Route path="roles-accesos" element={<RolesAccesosPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="accesos_index" />}>
            <Route path="accesos" element={<RolesAccesosForm />} />
            <Route path="accesos/:id" element={<RolesAccesosForm />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="aplicaciones_index" />}
          >
            <Route path="aplicaciones" element={<AplicacionesPage />} />
            <Route path="aplicaciones/:id" element={<AplicacionForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="empresas_index" />}>
            <Route path="empresas" element={<EmpresasPage />} />
            <Route path="empresas/:id" element={<EmpresaForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="modulos_index" />}>
            <Route path="modulos" element={<ModulosPage />} />
            <Route path="modulos/:id" element={<ModuloForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="componentes_index" />}>
            <Route path="componentes" element={<ComponentesPage />} />
            <Route path="componentes/:id" element={<ComponentsForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="personas_index" />}>
            <Route path="personas" element={<PersonasPage />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="personas_usuarios_index" />}
          >
            <Route path="personas-usuarios" element={<AplicacionesPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="bitacora_index" />}>
            <Route path="bitacora" element={<BitacoraPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_index" />}>
            <Route path="roles" element={<RolesPage />} />
            <Route path="roles/:id" element={<RolForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_index" />}>
            <Route path="roles" element={<RolesPage />} />
            <Route path="roles/:id" element={<RolForm />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="rol_asignacion_index" />}
          >
            <Route path="rol-asignacion" element={<RolAsignacionPage />} />
            <Route path="rol-asignacion/:id" element={<RolAsignacionForm />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="users_index" />}>
            <Route path="users" element={<UsuariosPage />} />
            <Route path="users/:id" element={<UsersForm />} />
            <Route path="usuario-rol/:id" element={<UsuarioRolForm />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="usuario_rol_insert" />}
          >
            <Route path="usuario-rol/:id" element={<UsuarioRolForm />} />
          </Route>

          <Route path="/" element={<Navigate to="/inicio" />} />
        </Routes>
      </div>
    </>
  );
};
