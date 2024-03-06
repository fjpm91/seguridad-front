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
import { EmpresaForm } from "../pages/empresas";
import { UsersForm } from "../pages/usuarios";
import { RolesAccesosForm } from "../pages/rolesAccesos";
import { BitacoraPage } from "../pages/bitacora";
import { UsuarioRolBaseForm, UsuarioRolForm } from "../pages/usuarioRol";
import { ComponentsForm } from "../pages/componentes";
import { RolAsignacionForm, RolAsignacionPage } from "../pages/rolAsignacion";
import { UnidadNegocioForm, UnidadNegocioPage } from "../pages/unidadNegocio";
import { DivisionForm, DivisionPage } from "../pages/division";
import { PersonasCentroCostoForm, PersonasForm } from "../pages/personas";
import { UseToastMessage } from "../../hooks/useToastMessage";
import { Snackbar } from "@mui/material";
import { CargoForm, CargosPage } from "../pages/cargos";
import { CentroCostoForm, CentrosCostoPage } from "../pages/centrosCosto";

export const SeguridadRoutes = () => {
  const { authState, toggle } = useContext(AuthContext);
  const { aplicacion, modulos, persona, rol, user } = authState;
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } = UseToastMessage();
  const handleClose = () => {
    setOpen(false);
    setToastMessage("");
  };

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
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={toastMessage}
      ></Snackbar>

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
            <Route
              path="accesos"
              element={
                <RolesAccesosForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="accesos/:id"
              element={
                <RolesAccesosForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="aplicaciones_index" />}
          >
            <Route
              path="aplicaciones"
              element={
                <AplicacionesPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="aplicaciones/:id"
              element={
                <AplicacionForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="empresas_index" />}>
            <Route
              path="empresas"
              element={
                <EmpresasPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="empresas/:id"
              element={
                <EmpresaForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="modulos_index" />}>
            <Route
              path="modulos"
              element={
                <ModulosPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="modulos/:id"
              element={
                <ModuloForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="componentes_index" />}>
            <Route
              path="componentes"
              element={
                <ComponentesPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="componentes/:id"
              element={
                <ComponentsForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="personas_index" />}>
            <Route
              path="personas"
              element={
                <PersonasPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="personas/:id"
              element={
                <PersonasForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route
            element={
              <SeguridadProtectedRoutes url="personas_centro_costo_index" />
            }
          >
            <Route
              path="personas"
              element={
                <PersonasPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="/personas-centro-costo/:id"
              element={
                <PersonasCentroCostoForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="personas_usuarios_index" />}
          >
            <Route
              path="personas-usuarios"
              element={
                <AplicacionesPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="bitacora_index" />}>
            <Route path="bitacora" element={<BitacoraPage />} />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_index" />}>
            <Route
              path="roles"
              element={
                <RolesPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="roles/:id"
              element={
                <RolForm setToastMessage={setToastMessage} setOpen={setOpen} />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="roles_index" />}>
            <Route
              path="roles"
              element={
                <RolesPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="roles/:id"
              element={
                <RolForm setToastMessage={setToastMessage} setOpen={setOpen} />
              }
            />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="rol_asignacion_index" />}
          >
            <Route
              path="rol-asignacion"
              element={
                <RolAsignacionPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="rol-asignacion/:id"
              element={
                <RolAsignacionForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="users_index" />}>
            <Route
              path="users"
              element={
                <UsuariosPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="users/:id"
              element={
                <UsersForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="usuario-rol/:id"
              element={
                <UsuarioRolForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route path="usuario-rol-base" element={<UsuarioRolBaseForm />} />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="usuario_rol_insert" />}
          >
            <Route
              path="usuario-rol/:id"
              element={
                <UsuarioRolForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="unidades_negocio_index" />}
          >
            <Route
              path="unidades-negocio"
              element={
                <UnidadNegocioPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="unidades-negocio/:id"
              element={
                <UnidadNegocioForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="divisiones_index" />}>
            <Route
              path="divisiones"
              element={
                <DivisionPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="divisiones/:id"
              element={
                <DivisionForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route element={<SeguridadProtectedRoutes url="cargos_index" />}>
            <Route
              path="cargos"
              element={
                <CargosPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="cargos/:id"
              element={
                <CargoForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route
            element={<SeguridadProtectedRoutes url="centros_costo_index" />}
          >
            <Route
              path="centros-costo"
              element={
                <CentrosCostoPage
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path="centros-costo/:id"
              element={
                <CentroCostoForm
                  setToastMessage={setToastMessage}
                  setOpen={setOpen}
                />
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/inicio" />} />
        </Routes>
      </div>
    </>
  );
};
