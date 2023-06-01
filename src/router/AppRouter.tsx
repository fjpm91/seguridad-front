import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage";
import { SeguridadRoutes } from "../seguridad/routes/SeguridadRoutes";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <SeguridadRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};
