import React from 'react';
import type { Camera } from '../../types/camera';

interface CameraCardProps {
  camera: Camera;
  onClick: (camera: Camera) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, onClick }) => {
  return (
    <div className="camera-card" onClick={() => onClick(camera)}>
      <div className="camera-thumbnail">
        <img src={camera.thumbnail} alt={camera.name} />
        <div className="camera-overlay">
          <div className="play-overlay">
            <i className="fa-solid fa-play"></i>
          </div>
        </div>
        <div className={`camera-status-badge ${camera.status}`}>
          <i className="fa-solid fa-circle"></i>
          {camera.status === 'online' ? 'Online' : 'Offline'}
        </div>
      </div>
      <div className="camera-info">
        <div className="camera-name">{camera.name}</div>
        <div className="camera-details">
          <div className="camera-detail">
            <i className="fa-solid fa-folder"></i>
            <span>{camera.project}</span>
          </div>
          <div className="camera-detail">
            <i className="fa-solid fa-location-dot"></i>
            <span>{camera.lat.toFixed(4)}°N, {Math.abs(camera.lng).toFixed(4)}°W</span>
          </div>
          <div className="camera-detail">
            <i className="fa-solid fa-film"></i>
            <span>{camera.resolution} • {camera.fps} FPS</span>
          </div>
        </div>
        <div className="camera-tags">
          {camera.type !== 'timelapse' && camera.type !== 'drone' && camera.ptz && (
            <div className="camera-tag ptz">
              <i className="ki-duotone ki-setting-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i> PTZ
            </div>
          )}
          {camera.type !== 'timelapse' && (
            <div className={`camera-tag ${camera.status === 'online' ? 'live' : 'offline'}`}>
              <i className={`ki-duotone ki-${camera.status === 'online' ? 'check-circle' : 'cross-circle'}`}>
                <span className="path1"></span>
                <span className="path2"></span>
              </i> {camera.status === 'online' ? 'Live' : 'Offline'}
            </div>
          )}
          <div className="camera-tag playback">
            <i className="ki-duotone ki-time">
              <span className="path1"></span>
              <span className="path2"></span>
            </i> Playback
          </div>
        </div>
      </div>
    </div>
  );
};
