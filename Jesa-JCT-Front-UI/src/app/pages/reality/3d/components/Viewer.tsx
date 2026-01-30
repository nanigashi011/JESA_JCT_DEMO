/**
 * APS 3D Viewer Component
 * Handles Autodesk Viewer initialization and model loading
 */

import { useEffect, useRef, useState } from 'react';
import { useViewer } from '../contexts/ViewerContext';
import { getAccessToken } from '../services/api';
import { loadViewerSDK, isViewerSDKLoaded } from '../services/viewerLoader';
import type { ElementProperty } from '../types';

interface LoadingProgress {
  state: 'initializing' | 'downloading' | 'processing' | 'rendering' | 'complete';
  percent: number;
  message: string;
}

export function Viewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<LoadingProgress | null>(null);
  const {
    state,
    viewerRef,
    setInitialized,
    setLoading,
    setError,
    selectElement,
    setStats,  // ← ADD THIS LINE
    initializeElementStatuses,
    applyStatusFilters,
    extractModelHierarchy,
  } = useViewer();

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current || state.isViewerInitialized) return;

    const initViewer = async () => {
      try {
        setLoading(true);

        // Load Autodesk Viewer SDK if not already loaded (lazy loading)
        if (!isViewerSDKLoaded()) {
          setProgress({ state: 'initializing', percent: 0, message: 'Loading 3D viewer engine...' });
          await loadViewerSDK();
        }

        // Get token (likely already preloaded)
        const tokenData = await getAccessToken();
        const cachedToken = tokenData.access_token;
        const cachedExpiry = tokenData.expires_in;

        // Initialize Autodesk Viewer
        const options: Autodesk.Viewing.InitializerOptions = {
          env: 'AutodeskProduction',
          getAccessToken: (onTokenReady) => {
            onTokenReady(cachedToken, cachedExpiry);
          },
        };

        window.Autodesk.Viewing.Initializer(options, () => {
          if (!containerRef.current) return;

          const config = { extensions: [] };
          const viewer = new window.Autodesk.Viewing.GuiViewer3D(containerRef.current, config);

          const startResult = viewer.start();
          if (startResult !== 0) {
            setError('Failed to start viewer');
            return;
          }

          viewerRef.current = viewer;

          // Selection event listener
          viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => {
            const selectedIds = event.dbIdArray || [];
            if (selectedIds.length === 1) {
              loadElementProperties(viewer, selectedIds[0]);
            } else {
              selectElement(null);
            }
          });

          setInitialized(true);
          setLoading(false);
          setProgress(null);
        });
      } catch (err) {
        console.error('Viewer init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize viewer');
        setLoading(false);
        setProgress(null); // Clear the SDK loading progress on error
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.finish();
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Load model when URN changes
  useEffect(() => {
    if (!state.isViewerInitialized || !state.currentUrn || !viewerRef.current) return;

    const loadModel = () => {
      // Clear old stats immediately
      setStats({ total: 0, displayed: 0, byStatus: {} });
      setLoading(true);
      setError(null);
      setProgress({ state: 'initializing', percent: 0, message: 'Connecting to Autodesk servers...' });

      // The URN needs to be base64-encoded for the viewer
      // state.currentUrn might already have "urn:" prefix or be base64-encoded
      const rawUrn = state.currentUrn!; // We already checked it's not null above
      let documentId: string;

      // If it's not already base64-encoded (starts with "urn:"), encode it
      if (rawUrn.startsWith('urn:')) {
        // Base64 encode the URN (URL-safe: replace + with -, / with _, remove =)
        const base64Urn = btoa(rawUrn)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        documentId = `urn:${base64Urn}`;
      } else {
        // Already encoded, just ensure it has the urn: prefix
        documentId = rawUrn.startsWith('urn:') ? rawUrn : `urn:${rawUrn}`;
      }

      const viewer = viewerRef.current;
      if (!viewer) return;

      // Progress listener with detailed stages
      const onProgress = (event: { percent: number; state?: number }) => {
        const percent = Math.round(event.percent || 0);
        let progressState: LoadingProgress['state'] = 'downloading';
        let message = 'Loading model data...';

        // Autodesk Viewer states: 1=Root, 2=Download, 3=Parse, 4=Render
        if (percent < 15) {
          progressState = 'initializing';
          message = 'Connecting to Autodesk servers...';
        } else if (percent < 40) {
          progressState = 'downloading';
          message = `Downloading 3D geometry (${percent}%)`;
        } else if (percent < 70) {
          progressState = 'processing';
          message = `Parsing model data (${percent}%)`;
        } else if (percent < 95) {
          progressState = 'rendering';
          message = `Building 3D scene (${percent}%)`;
        } else {
          progressState = 'complete';
          message = 'Almost ready...';
        }

        setProgress({ state: progressState, percent, message });
      };

      viewer.addEventListener(window.Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgress);

      window.Autodesk.Viewing.Document.load(
        documentId,
        (doc) => {
          setProgress({ state: 'downloading', percent: 10, message: 'Document loaded, fetching geometry...' });

          const defaultModel = doc.getRoot().getDefaultGeometry();

          viewer
            .loadDocumentNode(doc, defaultModel)
            .then(() => {
              console.log('Model loaded successfully');
              setLoading(false);
              setProgress({ state: 'complete', percent: 100, message: 'Model ready!' });
              setTimeout(() => setProgress(null), 1500);
              viewer.removeEventListener(window.Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgress);

              // Wait for geometry to be fully loaded before initializing statuses
              const onGeometryLoaded = () => {
                console.log('Geometry fully loaded, initializing element statuses...');
                initializeElementStatuses();
                extractModelHierarchy();
                viewer.removeEventListener(window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
              };

              // Check if already loaded, otherwise wait
              if (viewer.model?.getInstanceTree()) {
                console.log('Instance tree already available');
                initializeElementStatuses();
                extractModelHierarchy();
              } else {
                viewer.addEventListener(window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
              }
            })
            .catch((err) => {
              console.error('Error loading model:', err);
              setError('Failed to load model');
              setLoading(false);
              setProgress(null);
              viewer.removeEventListener(window.Autodesk.Viewing.PROGRESS_UPDATE_EVENT, onProgress);
            });
        },
        (errorCode, errorMsg) => {
          console.error('Document load error:', errorCode, errorMsg);
          let userMessage = `Failed to load document: ${errorMsg}`;
          if (errorCode === 4) {
            userMessage = 'Model not found or not translated. Please check ACC.';
          } else if (errorCode === 5) {
            userMessage = 'Access denied. Check your APS credentials.';
          } else if (errorCode === 6) {
            userMessage = 'Model translation in progress. Please wait.';
          }
          setError(userMessage);
          setLoading(false);
          setProgress(null);
        }
      );
    };

    loadModel();
  }, [state.isViewerInitialized, state.currentUrn]);

  // Apply status filters when they change
  useEffect(() => {
    if (state.isViewerInitialized && viewerRef.current?.model) {
      applyStatusFilters();
    }
  }, [state.statusFilters, state.isViewerInitialized]);

  // Load element properties
  const loadElementProperties = (viewer: Autodesk.Viewing.GuiViewer3D, dbId: number) => {
    viewer.getProperties(dbId, (result) => {
      const properties: ElementProperty[] = result.properties.map((prop) => ({
        label: prop.displayName,
        value: prop.displayValue,
        category: prop.displayCategory,
      }));

      selectElement({
        dbId,
        name: result.name || `Element ${dbId}`,
        type: result.externalId || 'Unknown',
        properties,
      });
    });
  };

  return (
    <div className="viewer-container position-relative w-100 h-100">
      <div ref={containerRef} className="w-100 h-100" />

      {/* Loading overlay with stages - fully opaque to hide Autodesk logo */}
      {(state.isLoading || progress) && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: '#1a1a2e', zIndex: 10 }}>
          <div className="text-center" style={{ width: '350px' }}>
            {/* Animated 3D cube icon */}
            <div className="mb-4">
              <i className="fa-solid fa-cube fa-3x text-primary fa-bounce"></i>
            </div>

            {progress ? (
              <>
                {/* Loading stages indicator */}
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <LoadingStage
                    icon="fa-link"
                    label="Connect"
                    active={progress.state === 'initializing'}
                    done={['downloading', 'processing', 'rendering', 'complete'].includes(progress.state)}
                  />
                  <LoadingStage
                    icon="fa-download"
                    label="Download"
                    active={progress.state === 'downloading'}
                    done={['processing', 'rendering', 'complete'].includes(progress.state)}
                  />
                  <LoadingStage
                    icon="fa-gears"
                    label="Process"
                    active={progress.state === 'processing'}
                    done={['rendering', 'complete'].includes(progress.state)}
                  />
                  <LoadingStage
                    icon="fa-cube"
                    label="Render"
                    active={progress.state === 'rendering'}
                    done={progress.state === 'complete'}
                  />
                </div>

                <p className="text-gray-300 mb-3 fs-6">{progress.message}</p>
                <div className="progress mb-2" style={{ height: '6px', borderRadius: '3px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${progress.percent}%`, transition: 'width 0.3s ease' }}
                  />
                </div>
                <p className="text-primary fw-bold fs-5">{progress.percent}%</p>

                {/* Helpful tip */}
                {progress.percent > 0 && progress.percent < 50 && (
                  <p className="text-gray-500 fs-8 mt-3">
                    <i className="fa-solid fa-lightbulb me-1"></i>
                    Large models may take a moment to download
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-300">Initializing viewer...</p>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div className="position-absolute top-0 start-50 translate-middle-x mt-4">
          <div className="alert alert-danger" role="alert">
            {state.error}
          </div>
        </div>
      )}

      {/* No model placeholder */}
      {!state.currentUrn && !state.isLoading && state.isViewerInitialized && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-gray-500">
            <i className="fa-solid fa-cube fs-5x mb-5 opacity-25"></i>
            <h3 className="text-gray-400">3D Model Viewer</h3>
            <p className="text-gray-500">Select a model from the project tree to view</p>
          </div>
        </div>
      )}

      {/* Viewer Controls */}
      <ViewerControls />
    </div>
  );
}

function ViewerControls() {
  const { viewerRef, resetView } = useViewer();

  const handleZoomIn = () => viewerRef.current?.navigation?.setZoomFactor(1.2);
  const handleZoomOut = () => viewerRef.current?.navigation?.setZoomFactor(0.8);
  const handleFitView = () => viewerRef.current?.fitToView();
  const handleSection = () => viewerRef.current?.loadExtension('Autodesk.Section');
  const handleMeasure = () => viewerRef.current?.loadExtension('Autodesk.Measure');

  return (
    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
      <div className="d-flex gap-2 p-3 rounded-3" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={handleZoomIn} title="Zoom In">
          <i className="fa-solid fa-plus"></i>
        </button>
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={handleZoomOut} title="Zoom Out">
          <i className="fa-solid fa-minus"></i>
        </button>
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={handleFitView} title="Fit View">
          <i className="fa-solid fa-expand"></i>
        </button>
        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }} />
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={handleSection} title="Section">
          <i className="fa-solid fa-scissors"></i>
        </button>
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={handleMeasure} title="Measure">
          <i className="fa-solid fa-ruler"></i>
        </button>
        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }} />
        <button className="btn btn-sm btn-icon" style={controlBtnStyle} onClick={resetView} title="Reset View">
          <i className="fa-solid fa-house"></i>
        </button>
      </div>
    </div>
  );
}

const controlBtnStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Loading stage indicator component
function LoadingStage({ icon, label, active, done }: { icon: string; label: string; active: boolean; done: boolean }) {
  return (
    <div className="text-center" style={{ width: '60px' }}>
      <div
        className={`d-flex align-items-center justify-content-center rounded-circle mx-auto mb-1 ${
          done ? 'bg-success' : active ? 'bg-primary' : 'bg-secondary'
        }`}
        style={{ width: '32px', height: '32px', transition: 'all 0.3s ease' }}
      >
        {done ? (
          <i className="fa-solid fa-check text-white fs-7"></i>
        ) : (
          <i className={`fa-solid ${icon} ${active ? 'text-white fa-pulse' : 'text-gray-500'} fs-7`}></i>
        )}
      </div>
      <span className={`fs-8 ${done ? 'text-success' : active ? 'text-primary' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
