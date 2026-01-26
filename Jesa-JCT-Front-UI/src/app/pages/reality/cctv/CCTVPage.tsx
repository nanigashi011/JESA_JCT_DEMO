import React, { useState } from 'react';
import type { Camera } from '../types/camera';
import { camerasData, getTimelapseCameras } from '../data/camerasData';
import { StatCard } from '../components/common/StatCard';
import { ActionBar } from '../components/common/ActionBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { CameraGrid } from '../components/camera/CameraGrid';
import { CameraGridView } from '../components/camera/CameraGridView';
import { CameraMap } from '../components/map/CameraMap';
import { CameraModal } from '../components/camera/CameraModal';

// Import the camera monitoring styles
import '@/_metronic/assets/sass/camera-monitoring.css';

export const CCTVPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedCameraTypes, setSelectedCameraTypes] = useState(['all', 'fixed', 'ptz', 'timelapse', 'drone']);
  const [selectedZones, setSelectedZones] = useState(['all', 'north', 'south', 'east', 'west']);
  const [modalCamera, setModalCamera] = useState<Camera | null>(null);
  const [modalSource, setModalSource] = useState<string>('other');

  const timelapseCameras = getTimelapseCameras();

  // Filter cameras for map display - only show Genetec streaming cameras (live cameras)
  const filteredCameras = camerasData.filter(camera => {
    // Only include cameras with Genetec streaming (type 'live' with guid)
    if (camera.type !== 'live' || !camera.guid) {
      return false;
    }
    if (selectedProject !== 'all') {
      if (!camera.project.toLowerCase().includes(selectedProject)) {
        return false;
      }
    }
    return true;
  });

  const handleCameraClick = (camera: Camera, source: string = 'other') => {
    setModalCamera(camera);
    setModalSource(source);
  };

  const handleCloseModal = () => {
    setModalCamera(null);
  };

  const tabs = [
    { id: 'grid', icon: 'fa-video', label: 'Cameras', active: activeTab === 'grid' },
    { id: 'map', icon: 'fa-map-location-dot', label: 'Map View', active: activeTab === 'map' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', active: activeTab === 'analytics' },
    { id: 'alerts', icon: 'fa-bell', label: 'Alerts', active: activeTab === 'alerts' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings', active: activeTab === 'settings' }
  ];

  const cameraTypeOptions = [
    { label: 'All Cameras', value: 'all', count: 24 },
    { label: 'Fixed', value: 'fixed', count: 16 },
    { label: 'PTZ', value: 'ptz', count: 8 },
    { label: 'Timelapse', value: 'timelapse', count: 15 },
    { label: 'Drone', value: 'drone', count: 9 }
  ];

  const projectOptions = [
    { label: 'All Projects', value: 'all', count: 24 },
    { label: 'Vertal Project', value: 'vertal', count: 5 },
    { label: 'Jorf Project', value: 'jorf', count: 6 },
    { label: 'MPH Project', value: 'mph', count: 4 },
    { label: 'Khouribga Project', value: 'khouribga', count: 5 },
    { label: 'Safi Project', value: 'safi', count: 4 }
  ];

  const zoneOptions = [
    { label: 'All Zones', value: 'all', count: 24 },
    { label: 'North Zone', value: 'north', count: 8 },
    { label: 'South Zone', value: 'south', count: 6 },
    { label: 'East Zone', value: 'east', count: 5 },
    { label: 'West Zone', value: 'west', count: 5 }
  ];

  return (
    <>
      <div className="app-content flex-column-fluid">
        <div className="container-fluid" id="kt_content_container">
          <div className="camera-monitoring-wrapper">
            {/* Stats Cards */}
            <div className="stats-grid">
              <StatCard
                icon={<i className="fa-solid fa-video text-primary fs-2x"></i>}
                iconBgClass="bg-light-primary"
                label="Total Cameras"
                value="24"
                badge={{ type: 'positive', value: '8.2%' }}
              />
              <StatCard
                icon={
                  <i className="ki-duotone ki-check-circle fs-2x text-success">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                }
                iconBgClass="bg-light-success"
                label="Online"
                value="22"
                badge={{ type: 'positive', value: '91.7%' }}
              />
              <StatCard
                icon={
                  <i className="ki-duotone ki-notification-bing fs-2x text-danger">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                }
                iconBgClass="bg-light-danger"
                label="Alerts"
                value="2"
                badge={{ type: 'negative', value: '50%' }}
              />
              <StatCard
                icon={
                  <i className="ki-duotone ki-setting-2 fs-2x text-warning">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                }
                iconBgClass="bg-light-warning"
                label="PTZ Active"
                value="8"
                badge={{ type: 'positive', value: '100%' }}
              />
            </div>

            {/* Action Bar */}
            <ActionBar tabs={tabs} onTabClick={setActiveTab}>
              <FilterDropdown
                id="cameraTypeDropdown"
                icon="fa-camera"
                label="Camera Type"
                type="checkbox"
                options={cameraTypeOptions}
                selectedValues={selectedCameraTypes}
                onCheckboxChange={setSelectedCameraTypes}
              />
              <FilterDropdown
                id="projectDropdown"
                icon="fa-folder"
                label="Project"
                type="select"
                options={projectOptions}
                selectedValue={selectedProject}
                onSelect={setSelectedProject}
              />
              <FilterDropdown
                id="zoneDropdown"
                icon="fa-map-marker-alt"
                label="Zone"
                type="checkbox"
                options={zoneOptions}
                selectedValues={selectedZones}
                onCheckboxChange={setSelectedZones}
              />
            </ActionBar>

            {/* Camera Grid View (XProtect Style) */}
            {activeTab === 'grid' && (
              <CameraGridView onCameraClick={(camera) => handleCameraClick(camera, 'grid')} />
            )}

            {/* Cameras View (Map and Camera Cards) */}
            {activeTab === 'map' && (
              <div id="camerasView">
                {/* Map Section */}
                <CameraMap
                  cameras={filteredCameras}
                  onCameraClick={(camera) => handleCameraClick(camera, 'map')}
                />

                {/* Timelapse Cameras Section */}
                <div className="content-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        <i className="fa-solid fa-clock"></i>
                        Timelapse
                      </h3>
                      <p className="card-subtitle">Time-lapse camera feeds</p>
                    </div>
                    <div className="card-actions">
                      <select className="select-filter">
                        <option>All Projects</option>
                        <option>Vertal Project</option>
                        <option>Jorf Project</option>
                        <option>MPH Project</option>
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
                    cameras={timelapseCameras}
                    initialLimit={3}
                    onCameraClick={(camera) => handleCameraClick(camera, 'timelapse')}
                    gridId="timelapseCameraGrid"
                  />
                </div>
              </div>
            )}

            {/* Other tabs - placeholder content */}
            {activeTab === 'analytics' && (
              <div className="content-card">
                <div className="card-body" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  <i className="fa-solid fa-chart-line" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
                  <p>Analytics content coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="content-card">
                <div className="card-body" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  <i className="fa-solid fa-bell" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
                  <p>Alerts content coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="content-card">
                <div className="card-body" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  <i className="fa-solid fa-gear" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
                  <p>Settings content coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        camera={modalCamera}
        isOpen={modalCamera !== null}
        onClose={handleCloseModal}
        videoMode={modalSource === 'timelapse' ? 'category' : 'static'}
        source={modalSource}
      />
    </>
  );
};
