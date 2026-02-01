import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import RegisterSuccess from "./pages/auth/RegisterSuccess"; // ✅ add
import AppHome from "./pages/AppHome";
import { PATHS } from "./routes/paths";

export default function App() {
  return (
    <Routes>
      <Route
        path={PATHS.ROOT}
        element={<Navigate to={PATHS.REGISTER} replace />}
      />

      <Route
        path={PATHS.REGISTER}
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      <Route
        path={PATHS.REGISTER_SUCCESS}
        element={
          <AuthLayout>
            <RegisterSuccess />
          </AuthLayout>
        }
      />

      <Route
        path={PATHS.LOGIN}
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route path={PATHS.APP} element={<AppHome />} />

      {/* keep wildcard last */}
      <Route path="*" element={<Navigate to={PATHS.REGISTER} replace />} />
    </Routes>
  );
}
