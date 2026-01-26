import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { AuthLayout } from "./AuthLayout";

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route index element={<Login />} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Route>
  </Routes>
);

export { AuthPage };
