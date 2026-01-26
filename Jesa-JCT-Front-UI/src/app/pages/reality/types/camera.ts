// Camera types and interfaces

export interface Camera {
  id: string;
  guid?: string;
  name: string;
  project: string;
  type: 'live' | 'timelapse' | 'drone';
  status: 'online' | 'offline';
  ptz: boolean;
  lat: number;
  lng: number;
  thumbnail: string;
  resolution: string;
  fps: number;
  isGenetec: boolean;
  videoFile?: string;
  liveVideoFile?: string;
}

export interface CameraStats {
  totalCameras: number;
  online: number;
  alerts: number;
  ptzActive: number;
}

export interface FilterState {
  project: string;
  cameraTypes: string[];
  zones: string[];
}

export interface GenetecConfig {
  apiBaseUrl: string;
  endpoints: {
    open: (cameraGuid: string) => string;
    token: (cameraGuid: string) => string;
  };
}

export interface GridSlotCamera {
  slotIndex: number;
  cameraId: string;
}

export type GridLayout = 1 | 4 | 6 | 9 | 12 | 16;
