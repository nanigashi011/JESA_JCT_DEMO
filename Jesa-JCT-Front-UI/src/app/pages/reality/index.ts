// Main exports for Reality module
export * from './RealityRoutes';
export * from './cctv/CCTVPage';
export * from './drone/DronePage';
export * from './3d/ThreeDPage';

// Re-export types
export type { Camera, CameraStats, FilterState, GenetecConfig, GridSlotCamera, GridLayout } from './types/camera';

// Re-export data functions
export {
  camerasData,
  GENETEC_CONFIG,
  getCamerasByType,
  getCameraById,
  getGenetecCameras,
  getLiveCameras,
  getTimelapseCameras,
  getDroneCameras
} from './data/camerasData';
