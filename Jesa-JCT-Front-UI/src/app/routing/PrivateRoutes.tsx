import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import { HomePage } from "../pages/home/HomePage";
import { RealityRoutes } from "../pages/reality/RealityRoutes";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="auth/*" element={<Navigate to="/home" />} />
        {/* Pages */}
        <Route path="home" element={<HomePage />} />
        {/* Reality View (CCTV/Drone) */}
        <Route path="reality-view/*" element={<RealityRoutes />} />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

export { PrivateRoutes };
