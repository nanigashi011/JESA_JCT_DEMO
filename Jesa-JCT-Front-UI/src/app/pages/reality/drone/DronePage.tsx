import React, { useState } from 'react';
import type { Camera } from '../types/camera';
import { getDroneCameras } from '../data/camerasData';
import { CameraGrid } from '../components/camera/CameraGrid';
import { CameraModal } from '../components/camera/CameraModal';

// Import the camera monitoring styles
import '@/_metronic/assets/sass/camera-monitoring.css';

export const DronePage: React.FC = () => {
  const [modalCamera, setModalCamera] = useState<Camera | null>(null);
  const droneCameras = getDroneCameras();

  const handleCameraClick = (camera: Camera) => {
    setModalCamera(camera);
  };

  const handleCloseModal = () => {
    setModalCamera(null);
  };

  return (
    <>
      <div className="app-content flex-column-fluid">
        <div className="container-fluid" id="kt_content_container">
          <div className="camera-monitoring-wrapper">
            {/* Drone Cameras Section */}
            <div className="content-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <i className="fa-solid fa-helicopter"></i>
                    Drone
                  </h3>
                  <p className="card-subtitle">Drone camera feeds</p>
                </div>
                <div className="card-actions">
                  <select className="select-filter">
                    <option>All Projects</option>
                    <option>Khouribga Project</option>
                    <option>Safi Project</option>
                  </select>
                  <button className="btn-icon">
                    <i className="fa-solid fa-grid-2"></i>
                  </button>
                  <button className="btn-icon">
                    <i className="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>
              <CameraGrid
                cameras={droneCameras}
                initialLimit={3}
                onCameraClick={handleCameraClick}
                gridId="droneCameraGrid"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        camera={modalCamera}
        isOpen={modalCamera !== null}
        onClose={handleCloseModal}
        videoMode="category"
        source="drone"
      />
    </>
  );
};
