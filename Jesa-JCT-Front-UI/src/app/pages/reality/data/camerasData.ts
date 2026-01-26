import type { Camera, GenetecConfig } from '../types/camera';

// Genetec API Configuration
export const GENETEC_CONFIG: GenetecConfig = {
  apiBaseUrl: 'http://localhost:5217',
  endpoints: {
    open: (cameraGuid: string) => `http://localhost:5217/api/cameras/${cameraGuid}/open`,
    token: (cameraGuid: string) => `http://localhost:5217/api/cameras/${cameraGuid}/token`
  }
};

// Camera GUID Mappings
export const CAMERA_GUID_MAP: Record<string, string> = {
  '110': '0b000000-0000-babe-0000-e430229e47c1',
  '111': '0b000000-0000-babe-0000-e430229e47c6',
  '112': '0b000000-0000-babe-0000-e430229e47bc',
  '115': '0b000000-0000-babe-0000-e430229e47b0',
  '116': '0b000000-0000-babe-0000-e43022a13f10',
  '127': '0b000000-0000-babe-0000-e430229e47d3',
  '128': '0b000000-0000-babe-0000-e430229e47be',
  '129': '0b000000-0000-babe-0000-e430229e47c5',
  '211': '0b000000-0000-babe-0000-e430229e632b',
  '219': '0b000000-0000-babe-0000-e430229e47b5'
};

// Camera Data
export const camerasData: Camera[] = [
  // Genetec Live Cameras
  {
    id: '110',
    guid: '0b000000-0000-babe-0000-e430229e47c1',
    name: 'Camera 110',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5731,
    lng: -7.5898,
    thumbnail: '/assets/images/thumbnails/camera-110.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '111',
    guid: '0b000000-0000-babe-0000-e430229e47c6',
    name: 'Camera 111',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5745,
    lng: -7.5910,
    thumbnail: '/assets/images/thumbnails/camera-111.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '112',
    guid: '0b000000-0000-babe-0000-e430229e47bc',
    name: 'Camera 112',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5720,
    lng: -7.5885,
    thumbnail: '/assets/images/thumbnails/camera-112.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '115',
    guid: '0b000000-0000-babe-0000-e430229e47b0',
    name: 'Camera 115',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5738,
    lng: -7.5875,
    thumbnail: '/assets/images/thumbnails/camera-115.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '116',
    guid: '0b000000-0000-babe-0000-e43022a13f10',
    name: 'Camera 116',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5752,
    lng: -7.5892,
    thumbnail: '/assets/images/thumbnails/camera-116.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '127',
    guid: '0b000000-0000-babe-0000-e430229e47d3',
    name: 'Camera 127',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5760,
    lng: -7.5905,
    thumbnail: '/assets/images/thumbnails/camera-127.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '128',
    guid: '0b000000-0000-babe-0000-e430229e47be',
    name: 'Camera 128',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5710,
    lng: -7.5920,
    thumbnail: '/assets/images/thumbnails/camera-128.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '129',
    guid: '0b000000-0000-babe-0000-e430229e47c5',
    name: 'Camera 129',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5725,
    lng: -7.5865,
    thumbnail: '/assets/images/thumbnails/camera-129.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '211',
    guid: '0b000000-0000-babe-0000-e430229e632b',
    name: 'Camera 211',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5735,
    lng: -7.5880,
    thumbnail: '/assets/images/thumbnails/camera-211.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },
  {
    id: '219',
    guid: '0b000000-0000-babe-0000-e430229e47b5',
    name: 'Camera 219',
    project: 'JESA HSE',
    type: 'live',
    status: 'online',
    ptz: true,
    lat: 33.5748,
    lng: -7.5895,
    thumbnail: '/assets/images/thumbnails/camera-219.jpg',
    resolution: '1920x1080',
    fps: 30,
    isGenetec: true
  },

  // Timelapse Cameras
  {
    id: 'TL001',
    name: 'Vertal North Progress',
    project: 'Vertal Project',
    type: 'timelapse',
    status: 'online',
    ptz: false,
    lat: 34.0207,
    lng: -6.8415,
    thumbnail: '/assets/images/thumbnails/timelapse-1.jpg',
    resolution: '3840x2160',
    fps: 30,
    isGenetec: false,
    videoFile: 'timelapse-1.mp4',
    liveVideoFile: 'timelapse-1.mp4'
  },
  {
    id: 'TL002',
    name: 'Khouribga East Wing',
    project: 'Khouribga Project',
    type: 'timelapse',
    status: 'online',
    ptz: false,
    lat: 32.8863,
    lng: -6.9063,
    thumbnail: '/assets/images/thumbnails/timelapse-2.jpg',
    resolution: '3840x2160',
    fps: 30,
    isGenetec: false,
    videoFile: 'timelapse-2.mp4',
    liveVideoFile: 'timelapse-2.mp4'
  },
  {
    id: 'TL003',
    name: 'Casablanca Marina Construction',
    project: 'Marina Project',
    type: 'timelapse',
    status: 'online',
    ptz: false,
    lat: 33.6091,
    lng: -7.6326,
    thumbnail: '/assets/images/thumbnails/timelapse-1.jpg',
    resolution: '3840x2160',
    fps: 30,
    isGenetec: false,
    videoFile: 'timelapse-1.mp4',
    liveVideoFile: 'timelapse-1.mp4'
  },

  // Drone Cameras
  {
    id: 'DR001',
    name: 'Vertal Aerial Overview',
    project: 'Vertal Project',
    type: 'drone',
    status: 'online',
    ptz: false,
    lat: 34.0215,
    lng: -6.8425,
    thumbnail: '/assets/images/thumbnails/drone-1.jpg',
    resolution: '3840x2160',
    fps: 60,
    isGenetec: false,
    videoFile: 'drone-1.mp4',
    liveVideoFile: 'drone-1.mp4'
  },
  {
    id: 'DR002',
    name: 'Khouribga Site Survey',
    project: 'Khouribga Project',
    type: 'drone',
    status: 'online',
    ptz: false,
    lat: 32.8875,
    lng: -6.9075,
    thumbnail: '/assets/images/thumbnails/drone-2.jpg',
    resolution: '3840x2160',
    fps: 60,
    isGenetec: false,
    videoFile: 'drone-2.mp4',
    liveVideoFile: 'drone-2.mp4'
  },
  {
    id: 'DR003',
    name: 'Marina Coastal View',
    project: 'Marina Project',
    type: 'drone',
    status: 'online',
    ptz: false,
    lat: 33.6102,
    lng: -7.6338,
    thumbnail: '/assets/images/thumbnails/drone-1.jpg',
    resolution: '3840x2160',
    fps: 60,
    isGenetec: false,
    videoFile: 'drone-1.mp4',
    liveVideoFile: 'drone-1.mp4'
  }
];

// Helper functions
export const getCamerasByType = (type: Camera['type']): Camera[] => {
  return camerasData.filter(camera => camera.type === type);
};

export const getCameraById = (id: string): Camera | undefined => {
  return camerasData.find(camera => camera.id === id);
};

export const getGenetecCameras = (): Camera[] => {
  return camerasData.filter(camera => camera.isGenetec);
};

export const getLiveCameras = (): Camera[] => {
  return camerasData.filter(camera => camera.type === 'live');
};

export const getTimelapseCameras = (): Camera[] => {
  return camerasData.filter(camera => camera.type === 'timelapse');
};

export const getDroneCameras = (): Camera[] => {
  return camerasData.filter(camera => camera.type === 'drone');
};
