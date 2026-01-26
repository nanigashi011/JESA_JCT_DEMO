import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Camera, GridLayout } from '../../types/camera';
import { getGenetecCameras, camerasData } from '../../data/camerasData';
import { initGenetecStream, stopGenetecStream, openGenetecCamera } from '../../services/genetec';
import type { GenetecPlayer } from '../../services/genetec';

interface CameraGridViewProps {
  onCameraClick?: (camera: Camera) => void;
}

interface GridCameras {
  [slotIndex: number]: string;
}

export const CameraGridView: React.FC<CameraGridViewProps> = ({ onCameraClick }) => {
  const [layout, setLayout] = useState<GridLayout>(1);
  const [gridCameras, setGridCameras] = useState<GridCameras>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedSlot, setFocusedSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedCameraId, setDraggedCameraId] = useState<string | null>(null);

  const gridSlotPlayersRef = useRef<{ [key: number]: GenetecPlayer | null }>({});

  const streamingCameras = getGenetecCameras();
  const filteredCameras = streamingCameras.filter(camera => {
    const query = searchQuery.toLowerCase();
    return camera.name.toLowerCase().includes(query) ||
           camera.project.toLowerCase().includes(query);
  });

  // Cleanup players on unmount
  useEffect(() => {
    return () => {
      Object.values(gridSlotPlayersRef.current).forEach(player => {
        if (player) stopGenetecStream(player);
      });
    };
  }, []);

  const initializeSlotCamera = useCallback(async (slotIndex: number, camera: Camera) => {
    // Stop existing player in slot
    if (gridSlotPlayersRef.current[slotIndex]) {
      stopGenetecStream(gridSlotPlayersRef.current[slotIndex]!);
      delete gridSlotPlayersRef.current[slotIndex];
    }

    // Only Genetec cameras are used in the grid - always use streaming
    if (camera.guid) {
      const container = document.getElementById(`slot-genetec-${slotIndex}`);
      if (container) {
        try {
          container.innerHTML = '<div style="color: white; text-align: center; padding: 20px; font-size: 14px;">Loading stream...</div>';
          const streamInfo = await openGenetecCamera(camera.guid);
          const player = await initGenetecStream(container, camera.guid, streamInfo);
          gridSlotPlayersRef.current[slotIndex] = player;
        } catch (err) {
          console.error('Failed to initialize slot camera:', err);
          if (container) {
            container.innerHTML = `
              <div style="color: #ff4444; text-align: center; padding: 20px; font-size: 12px;">
                Failed to load stream
              </div>
            `;
          }
        }
      }
    }
  }, []);

  const handleLayoutChange = useCallback((newLayout: GridLayout) => {
    // Stop all existing players before layout change
    Object.entries(gridSlotPlayersRef.current).forEach(([_, player]) => {
      if (player) stopGenetecStream(player);
    });
    gridSlotPlayersRef.current = {};

    setLayout(newLayout);

    // Re-initialize cameras after layout change
    setTimeout(() => {
      Object.entries(gridCameras).forEach(([slotIndex, cameraId]) => {
        const idx = parseInt(slotIndex);
        if (idx < newLayout) {
          const camera = camerasData.find(c => c.id === cameraId);
          if (camera) {
            initializeSlotCamera(idx, camera);
          }
        }
      });
    }, 100);
  }, [gridCameras, initializeSlotCamera]);

  const handleDragStart = (e: React.DragEvent, cameraId: string) => {
    setDraggedCameraId(cameraId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (draggedCameraId && !gridCameras[slotIndex]) {
      const camera = camerasData.find(c => c.id === draggedCameraId);
      if (camera) {
        setGridCameras(prev => ({ ...prev, [slotIndex]: draggedCameraId }));
        setTimeout(() => initializeSlotCamera(slotIndex, camera), 100);
      }
    }
    setDraggedCameraId(null);
  };

  const handleRemoveCamera = (slotIndex: number) => {
    if (gridSlotPlayersRef.current[slotIndex]) {
      stopGenetecStream(gridSlotPlayersRef.current[slotIndex]!);
      delete gridSlotPlayersRef.current[slotIndex];
    }
    setGridCameras(prev => {
      const newCameras = { ...prev };
      delete newCameras[slotIndex];
      return newCameras;
    });
  };

  const handleToggleFocus = (slotIndex: number) => {
    setFocusedSlot(focusedSlot === slotIndex ? null : slotIndex);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setFocusedSlot(null);
  };

  const isCameraInGrid = (cameraId: string) => {
    return Object.values(gridCameras).includes(cameraId);
  };

  const renderSlot = (slotIndex: number) => {
    const cameraId = gridCameras[slotIndex];
    const camera = cameraId ? camerasData.find(c => c.id === cameraId) : null;
    const isFocused = focusedSlot === slotIndex;

    if (!camera) {
      return (
        <div
          key={slotIndex}
          className={`grid-slot empty ${draggedCameraId ? 'drag-over' : ''}`}
          data-slot={slotIndex}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, slotIndex)}
        >
          <div className="slot-placeholder">
            <i className="fa-solid fa-plus"></i>
            <span>Drag camera here</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={slotIndex}
        className={`grid-slot has-camera ${isFocused ? 'focused' : ''}`}
        data-slot={slotIndex}
        onDoubleClick={() => onCameraClick?.(camera)}
      >
        <div className="slot-camera-feed">
          {/* Only Genetec streaming - no static video fallback */}
          <div
            id={`slot-genetec-${slotIndex}`}
            className="slot-genetec-container"
            style={{ width: '100%', height: '100%', background: '#000' }}
          />
        </div>
        <div
          className="slot-controls"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            display: 'flex',
            gap: '5px',
            background: 'rgba(0,0,0,0.7)',
            padding: '5px',
            borderRadius: '5px',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          <button
            className="slot-action-btn"
            title="Fullscreen"
            onClick={() => handleToggleFocus(slotIndex)}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className={`fa-solid fa-${isFocused ? 'compress' : 'expand'}`}></i>
          </button>
          <button
            className="slot-action-btn"
            title="Remove"
            onClick={() => handleRemoveCamera(slotIndex)}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,0,0,0.6)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div
          className="slot-info"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            padding: '5px 10px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '12px',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
        >
          {camera.name} - <span style={{ color: '#00ff00' }}>LIVE</span>
        </div>
      </div>
    );
  };

  const layoutOptions: GridLayout[] = [1, 4, 6, 9, 12, 16];

  return (
    <div className={`camera-grid-view ${isFullscreen ? 'fullscreen' : ''}`} id="cameraGridView">
      {/* Grid Layout Controls */}
      <div className="grid-layout-controls">
        <span className="layout-label">Layout:</span>
        <div className="layout-options">
          {layoutOptions.map(l => (
            <button
              key={l}
              className={`layout-btn ${layout === l ? 'active' : ''}`}
              data-layout={l}
              title={`${l} Camera${l > 1 ? 's' : ''}`}
              onClick={() => handleLayoutChange(l)}
            >
              <div className={`layout-icon layout-${l === 1 ? '1x1' : l === 4 ? '2x2' : l === 6 ? '6' : l === 9 ? '3x3' : l === 12 ? '4x3' : '4x4'}`}></div>
              <span>{l}</span>
            </button>
          ))}
        </div>
        <button
          className="btn-fullscreen"
          id="gridFullscreenBtn"
          title="Fullscreen"
          onClick={handleToggleFullscreen}
        >
          <i className={`fa-solid fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
        </button>
      </div>

      {/* Main Grid Container */}
      <div className="grid-main-container">
        {/* Camera List Sidebar */}
        <div className="camera-list-sidebar">
          <div className="sidebar-header">
            <h4><i className="fa-solid fa-video"></i> Available Cameras</h4>
            <span className="camera-count">{streamingCameras.length} cameras</span>
          </div>
          <div className="camera-search">
            <i className="fa-solid fa-search"></i>
            <input
              type="text"
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="draggable-camera-list" id="draggableCameraList">
            {filteredCameras.map(camera => (
              <div
                key={camera.id}
                className={`draggable-camera-item ${isCameraInGrid(camera.id) ? 'in-grid' : ''}`}
                draggable={!isCameraInGrid(camera.id)}
                onDragStart={(e) => handleDragStart(e, camera.id)}
                data-camera-id={camera.id}
              >
                <div className="camera-item-thumbnail">
                  <img src={camera.thumbnail} alt={camera.name} />
                  <div className={`camera-item-status ${camera.status}`}></div>
                </div>
                <div className="camera-item-info">
                  <div className="camera-item-name">{camera.name}</div>
                  <div className="camera-item-project">{camera.project}</div>
                </div>
                <i className="fa-solid fa-grip-vertical camera-item-drag-handle"></i>
              </div>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="video-grid-container">
          <button
            className="exit-focus-btn"
            id="exitFocusBtn"
            onClick={() => setFocusedSlot(null)}
            style={{ display: focusedSlot !== null ? 'flex' : 'none' }}
          >
            <i className="fa-solid fa-grid-2"></i>
            <span>Back to Grid</span>
          </button>
          <div className={`video-grid layout-${layout} ${focusedSlot !== null ? 'focus-mode' : ''}`} id="videoGrid">
            {Array.from({ length: layout }, (_, i) => renderSlot(i))}
          </div>
        </div>
      </div>

      <style>{`
        .grid-slot.has-camera:hover .slot-controls,
        .grid-slot.has-camera:hover .slot-info {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
