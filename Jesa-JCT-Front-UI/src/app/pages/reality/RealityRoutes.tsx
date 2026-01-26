import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Lazy load the pages for better performance
const CCTVPage = lazy(() => import('./cctv/CCTVPage').then(module => ({ default: module.CCTVPage })));
const DronePage = lazy(() => import('./drone/DronePage').then(module => ({ default: module.DronePage })));
const ThreeDPage = lazy(() => import('./3d/ThreeDPage').then(module => ({ default: module.ThreeDPage })));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const RealityRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="cctv" element={<CCTVPage />} />
        <Route path="drone" element={<DronePage />} />
        <Route path="3d" element={<ThreeDPage />} />
        <Route path="" element={<Navigate to="3d" replace />} />
        <Route path="*" element={<Navigate to="3d" replace />} />
      </Routes>
    </Suspense>
  );
};
