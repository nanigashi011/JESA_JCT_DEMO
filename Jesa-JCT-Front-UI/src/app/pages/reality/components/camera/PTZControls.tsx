import React from 'react';

interface PTZControlsProps {
  onPTZCommand: (direction: string) => void;
  onPTZStop?: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onZoomStop?: () => void;
}

export const PTZControls: React.FC<PTZControlsProps> = ({
  onPTZCommand,
  onPTZStop,
  onZoom,
  onZoomStop
}) => {
  // Handle PTZ button press - start movement on mousedown, stop on mouseup/mouseleave
  const handlePTZMouseDown = (direction: string) => {
    onPTZCommand(direction);
  };

  const handlePTZMouseUp = () => {
    onPTZStop?.();
  };

  // Handle zoom button press
  const handleZoomMouseDown = (direction: 'in' | 'out') => {
    onZoom(direction);
  };

  const handleZoomMouseUp = () => {
    onZoomStop?.();
  };

  // Common props for PTZ direction buttons
  const getPTZButtonProps = (direction: string) => ({
    className: direction === 'home' ? 'ptz-btn home' : 'ptz-btn',
    'data-direction': direction,
    onMouseDown: () => handlePTZMouseDown(direction),
    onMouseUp: handlePTZMouseUp,
    onMouseLeave: handlePTZMouseUp,
    onTouchStart: () => handlePTZMouseDown(direction),
    onTouchEnd: handlePTZMouseUp,
  });

  // Common props for zoom buttons
  const getZoomButtonProps = (direction: 'in' | 'out') => ({
    className: 'zoom-btn',
    onMouseDown: () => handleZoomMouseDown(direction),
    onMouseUp: handleZoomMouseUp,
    onMouseLeave: handleZoomMouseUp,
    onTouchStart: () => handleZoomMouseDown(direction),
    onTouchEnd: handleZoomMouseUp,
  });

  return (
    <div className="panel-card" id="ptzPanel">
      <h4 className="panel-title">
        <i className="fa-solid fa-arrows-up-down-left-right"></i>
        PTZ Controls
      </h4>
      <div className="ptz-controls">
        <div className="ptz-grid">
          <button {...getPTZButtonProps('upleft')}>
            <i className="fa-solid fa-arrow-up" style={{ transform: 'rotate(-45deg)' }}></i>
          </button>
          <button {...getPTZButtonProps('up')}>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <button {...getPTZButtonProps('upright')}>
            <i className="fa-solid fa-arrow-up" style={{ transform: 'rotate(45deg)' }}></i>
          </button>
          <button {...getPTZButtonProps('left')}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button {...getPTZButtonProps('home')}>
            <i className="fa-solid fa-house"></i>
          </button>
          <button {...getPTZButtonProps('right')}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <button {...getPTZButtonProps('downleft')}>
            <i className="fa-solid fa-arrow-down" style={{ transform: 'rotate(45deg)' }}></i>
          </button>
          <button {...getPTZButtonProps('down')}>
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <button {...getPTZButtonProps('downright')}>
            <i className="fa-solid fa-arrow-down" style={{ transform: 'rotate(-45deg)' }}></i>
          </button>
        </div>

        <div className="zoom-controls">
          <button {...getZoomButtonProps('in')}>
            <i className="fa-solid fa-magnifying-glass-plus"></i>
            Zoom In
          </button>
          <button {...getZoomButtonProps('out')}>
            <i className="fa-solid fa-magnifying-glass-minus"></i>
            Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
};
