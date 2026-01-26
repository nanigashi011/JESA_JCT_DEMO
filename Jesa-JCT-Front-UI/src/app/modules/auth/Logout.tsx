import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./core/Auth";
import { useMsal } from "@azure/msal-react";

export function Logout() {
  const { logout } = useAuth();
  const { instance } = useMsal();

  useEffect(() => {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
    logout();
  }, [instance, logout]);

  return (
    <Routes>
      <Route index element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}
