import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Camera } from '../../types/camera';

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CameraMapProps {
  cameras: Camera[];
  onCameraClick: (camera: Camera) => void;
}

const MapResizer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    // Invalidate size on mount
    setTimeout(() => map.invalidateSize(), 100);

    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

const createCustomIcon = (status: string) => {
  const iconColor = status === 'online' ? '#22C55E' : '#DC2626';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${iconColor};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      ">
        <i class="fa-solid fa-video"></i>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

export const CameraMap: React.FC<CameraMapProps> = ({ cameras, onCameraClick }) => {
  const mapRef = useRef<L.Map | null>(null);

  const handleFullscreen = () => {
    const mapCard = document.querySelector('#camerasView .content-card');
    if (mapCard) {
      mapCard.classList.toggle('map-fullscreen');
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);
    }
  };

  const handleRefresh = () => {
    if (mapRef.current) {
      mapRef.current.setView([33.8, -7.5], 6);
    }
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <i className="fa-solid fa-map-location-dot"></i>
            Map View
          </h3>
          <p className="card-subtitle">Interactive camera locations</p>
        </div>
        <div className="card-actions">
          <button className="btn-icon" onClick={handleFullscreen} title="Fullscreen">
            <i className="fa-solid fa-expand"></i>
          </button>
          <button className="btn-icon" onClick={handleRefresh} title="Refresh">
            <i className="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <MapContainer
          center={[33.8, -7.5]}
          zoom={6}
          style={{ height: '450px', borderRadius: '12px' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <MapResizer />
          {cameras.map(camera => (
            <Marker
              key={camera.id}
              position={[camera.lat, camera.lng]}
              icon={createCustomIcon(camera.status)}
            >
              <Popup>
                <div style={{ padding: '8px', minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>{camera.name}</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748B' }}>
                    <i className="fa-solid fa-folder"></i> {camera.project}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748B' }}>
                    <i className="fa-solid fa-signal"></i> {camera.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                  <button
                    onClick={() => onCameraClick(camera)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#1E40AF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa-solid fa-play"></i> Open
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
