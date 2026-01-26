/**
 * 3D Model Viewer Page - FIXED FULLSCREEN
 * Filters stay properly positioned on the right in fullscreen
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { ViewerProvider, useViewer } from './contexts/ViewerContext';
import { ProjectNavigation } from './components/ProjectNavigation';
import { Viewer } from './components/Viewer';
import { StatusFiltersHorizontal } from './components/Statusfiltershorizontal';
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
  const [showProperties, setShowProperties] = useState(true);
  const { state, loadModel } = useViewer();

  // Refresh: reload the current model
  const handleRefresh = useCallback(() => {
    if (state.currentUrn && state.currentModelName) {
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

  // Listen for fullscreen changes
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      {/* Page Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <>
          <div className="mb-5">
            <h1 className="fs-2x fw-bold text-gray-900 mb-2">3D Model Viewer</h1>
            <p className="text-gray-600 fs-5">
              Interactive BIM visualization and navigation
            </p>
          </div>

          {/* Navigation Hierarchy */}
          <ProjectNavigation />
        </>
      )}

      {/* Main 3D Viewer Layout - REDESIGNED */}
      <div className="row g-5">
        {/* Main Viewer Area - Full Width or with collapsible sidebar */}
        <div className={showProperties && !isFullscreen ? "col-lg-9" : "col-lg-12"}>
          <div 
            className="card card-flush h-100" 
            ref={viewerContainerRef}
            style={isFullscreen ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              margin: 0,
              borderRadius: 0,
            } : {}}
          >
            {/* Card Header with Horizontal Filters */}
            <div className="card-header align-items-stretch py-3" style={{
              display: 'flex',
              flexDirection: 'column',
              background: isFullscreen ? 'rgba(0, 0, 0, 0.8)' : undefined,
            }}>
              {/* Row 1: Title + Actions on left, Stats on right */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="card-title mb-0" style={{ color: isFullscreen ? 'white' : undefined }}>
                  <i className="fa-solid fa-cube me-2"></i>
                  3D Viewer
                </h3>
                <div className="card-toolbar d-flex gap-2">
                  <button
                    className="btn btn-sm btn-icon btn-light-primary"
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
                  {!isFullscreen && (
                    <button
                      className="btn btn-sm btn-icon btn-light-primary"
                      onClick={() => setShowProperties(!showProperties)}
                      title={showProperties ? "Hide properties" : "Show properties"}
                    >
                      <i className={`fa-solid ${showProperties ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Horizontal Filters Bar */}
              <div style={isFullscreen ? { 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '8px 12px'
              } : {}}>
                <StatusFiltersHorizontal />
              </div>
            </div>

            {/* Viewer Body */}
            <div className="card-body p-0">
              <div
                style={{
                  height: isFullscreen ? 'calc(100vh - 140px)' : 'calc(100vh - 420px)',
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

        {/* Right Panel: Properties - Collapsible, Hidden in fullscreen */}
        {showProperties && !isFullscreen && (
          <div className="col-lg-3">
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* CSS for fullscreen improvements */}
      <style>{`
        /* Ensure fullscreen container takes full space */
        .card:fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        /* Improve filter button contrast in fullscreen */
        .card:fullscreen .btn-light-primary {
          background: rgba(54, 153, 255, 0.2) !important;
          border-color: rgba(54, 153, 255, 0.3) !important;
          color: #3699FF !important;
        }

        .card:fullscreen .btn-light-primary:hover {
          background: rgba(54, 153, 255, 0.3) !important;
        }

        /* Make stats more visible in fullscreen */
        .card:fullscreen .bg-light-primary {
          background: rgba(54, 153, 255, 0.15) !important;
        }

        .card:fullscreen .bg-light {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .card:fullscreen .text-gray-600 {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>
    </div>
  );
}