/**
 * 3D Model Viewer Page - CORRECT FOR YOUR API
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { ViewerProvider, useViewer } from './contexts/ViewerContext';
import { ProjectNavigation } from './components/ProjectNavigation';
import { Viewer } from './components/Viewer';
import { StatusFiltersHorizontal } from './components/StatusFiltersHorizontal';
import { PropertiesPanel } from './components/PropertiesPanel';
import { VersionSelector } from './components/VersionSelector';

interface AccVersion {
  versionUrn: string;
  versionNumber: number;
  name: string;
  fileType: string;
  derivativeUrnBase64: string;
}

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

  const handleRefresh = useCallback(() => {
    if (state.currentUrn && state.currentModelName) {
      loadModel(
        state.currentUrn, 
        state.currentModelName,
        state.currentProjectId || undefined,
        state.currentItemId || undefined,
        state.currentVersionId || undefined
      );
    }
  }, [
    state.currentUrn, 
    state.currentModelName, 
    state.currentProjectId,
    state.currentItemId,
    state.currentVersionId,
    loadModel
  ]);

  const handleVersionSelect = useCallback((version: AccVersion) => {
    console.log('Switching to version:', version.versionNumber);
    
    // Your API returns derivativeUrnBase64 which is what the viewer needs
    loadModel(
      version.derivativeUrnBase64,
      `${version.name} (v${version.versionNumber})`,
      state.currentProjectId || undefined,
      state.currentItemId || undefined,
      version.versionUrn  // Use versionUrn as the ID
    );
  }, [state.currentProjectId, state.currentItemId, loadModel]);

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

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      {!isFullscreen && (
        <>
          <div className="mb-5">
            <h1 className="fs-2x fw-bold text-gray-900 mb-2">3D Model Viewer</h1>
            <p className="text-gray-600 fs-5">
              Interactive BIM visualization and navigation
            </p>
          </div>

          <ProjectNavigation />
        </>
      )}

      <div className="row g-5">
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
            <div className="card-header align-items-stretch py-3" style={{
              display: 'flex',
              flexDirection: 'column',
              background: isFullscreen ? 'rgba(0, 0, 0, 0.8)' : undefined,
            }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <h3 className="card-title mb-0" style={{ color: isFullscreen ? 'white' : undefined }}>
                    <i className="fa-solid fa-cube me-2"></i>
                    3D Viewer
                  </h3>
                  
                  {state.currentModelName && (
                    <span 
                      className="badge badge-light-info fw-semibold fs-7"
                      style={{ color: isFullscreen ? 'white' : undefined }}
                    >
                      {state.currentModelName}
                    </span>
                  )}
                </div>

                <div className="card-toolbar d-flex gap-2 align-items-center">
                  <VersionSelector
                    projectId={state.currentProjectId}
                    itemId={state.currentItemId}
                    currentVersionId={state.currentVersionId}
                    onVersionSelect={handleVersionSelect}
                    isLoading={state.isLoading}
                  />

                  {state.currentProjectId && state.currentItemId && (
                    <div style={{ 
                      width: '1px', 
                      height: '30px', 
                      background: isFullscreen ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      margin: '0 5px' 
                    }} />
                  )}

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

              <div style={isFullscreen ? { 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '8px 12px'
              } : {}}>
                <StatusFiltersHorizontal />
              </div>
            </div>

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

        {showProperties && !isFullscreen && (
          <div className="col-lg-3">
            <PropertiesPanel />
          </div>
        )}
      </div>

      <style>{`
        .card:fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        .card:fullscreen .btn-light-primary {
          background: rgba(54, 153, 255, 0.2) !important;
          border-color: rgba(54, 153, 255, 0.3) !important;
          color: #3699FF !important;
        }

        .card:fullscreen .btn-light-primary:hover {
          background: rgba(54, 153, 255, 0.3) !important;
        }

        .card:fullscreen .bg-light-primary {
          background: rgba(54, 153, 255, 0.15) !important;
        }

        .card:fullscreen .bg-light {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .card:fullscreen .text-gray-600 {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .card-toolbar {
          position: relative;
        }
      `}</style>
    </div>
  );
}