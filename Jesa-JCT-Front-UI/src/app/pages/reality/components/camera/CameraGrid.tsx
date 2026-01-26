import React, { useState } from 'react';
import type { Camera } from '../../types/camera';
import { CameraCard } from './CameraCard';

interface CameraGridProps {
  cameras: Camera[];
  initialLimit?: number;
  onCameraClick: (camera: Camera) => void;
  gridId?: string;
}

export const CameraGrid: React.FC<CameraGridProps> = ({
  cameras,
  initialLimit = 3,
  onCameraClick,
  gridId
}) => {
  const [expanded, setExpanded] = useState(false);

  const visibleCameras = expanded ? cameras : cameras.slice(0, initialLimit);
  const hasMore = cameras.length > initialLimit;

  return (
    <div className="card-body">
      <div className="camera-grid" id={gridId}>
        {visibleCameras.map(camera => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onClick={onCameraClick}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button
            className="btn-light"
            onClick={() => setExpanded(!expanded)}
          >
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'}`}></i>
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};
