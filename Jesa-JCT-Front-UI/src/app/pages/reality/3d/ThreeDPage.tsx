/**
 * 3D Model Viewer Page
 * J-Tower three-panel layout: Left (Filters) | Center (Viewer) | Right (Properties)
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { ViewerProvider, useViewer } from './contexts/ViewerContext';
import { ProjectNavigation } from './components/ProjectNavigation';
import { Viewer } from './components/Viewer';
import { StatusFilters } from './components/StatusFilters';
import { PropertiesPanel } from './components/PropertiesPanel';

export function ThreeDPage() {
  return (
    <ViewerProvider>
      <ThreeDContent />
    </ViewerProvider>
  );
}

function ThreeDContent() {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { state, loadModel } = useViewer();

  // Refresh: reload the current model
  const handleRefresh = useCallback(() => {
    if (state.currentUrn && state.currentModelName) {
      // Trigger model reload by re-setting the same URN
      loadModel(state.currentUrn, state.currentModelName);
    }
  }, [state.currentUrn, state.currentModelName, loadModel]);

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    const container = viewerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes (e.g., user presses Escape)
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  // Add event listener for fullscreen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="fs-2x fw-bold text-gray-900 mb-2">3D Model Viewer</h1>
        <p className="text-gray-600 fs-5">
          Interactive BIM visualization and navigation
        </p>
      </div>

      {/* Navigation Hierarchy */}
      <ProjectNavigation />

      {/* Main 3D Viewer Layout */}
      <div className="row g-5">
        {/* Left Panel: Filters & Legend */}
        <div className="col-lg-3">
          <StatusFilters />
        </div>

        {/* Center: 3D Viewer */}
        <div className="col-lg-6">
          <div className="card card-flush h-100" ref={viewerContainerRef}>
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-cube me-2"></i>
                3D Viewer
              </h3>
              <div className="card-toolbar">
                <button
                  className="btn btn-sm btn-icon btn-light-primary me-2"
                  onClick={handleRefresh}
                  title="Refresh model"
                  disabled={!state.currentUrn}
                >
                  <i className="fa-solid fa-rotate"></i>
                </button>
                <button
                  className="btn btn-sm btn-icon btn-light-primary"
                  onClick={handleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div
                style={{
                  height: isFullscreen ? 'calc(100vh - 60px)' : 'calc(100vh - 380px)',
                  minHeight: '500px',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: isFullscreen ? '0' : '0 0 0.75rem 0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Viewer />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Properties */}
        <div className="col-lg-3">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
