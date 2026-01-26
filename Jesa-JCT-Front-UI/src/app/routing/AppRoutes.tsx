import { FC } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { App } from "../App";
const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route index element={<Navigate to="/home" />} />
          <Route path="/*" element={<PrivateRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
