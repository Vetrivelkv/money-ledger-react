import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AppHome from './pages/AppHome';
import { PATHS } from './routes/paths';

export default function App() {
  return (
    <Routes>
      <Route path={PATHS.ROOT} element={<Navigate to={PATHS.REGISTER} replace />} />

      <Route
        path={PATHS.REGISTER}
        element={
          <AuthLayout>
            <Register />
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

      {/* Placeholder for your protected app routes */}
      <Route path={PATHS.APP} element={<AppHome />} />

      <Route path="*" element={<Navigate to={PATHS.REGISTER} replace />} />
    </Routes>
  );
}
