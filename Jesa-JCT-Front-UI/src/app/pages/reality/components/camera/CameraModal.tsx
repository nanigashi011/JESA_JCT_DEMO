import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Camera } from '../../types/camera';
import { PTZControls } from './PTZControls';
import { openGenetecCamera, initGenetecStream, stopGenetecStream } from '../../services/genetec';
import type { GenetecPlayer } from '../../services/genetec';

interface CameraModalProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
  videoMode?: 'static' | 'category';
  source?: string;
}

interface TimelineLargeItem {
  date: string;
  image: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  camera,
  isOpen,
  onClose,
  videoMode = 'static',
  source = 'other'
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'playback'>('live');
  const [timestamp, setTimestamp] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('--:--');
  const videoRef = useRef<HTMLVideoElement>(null);
  const genetecContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<GenetecPlayer | null>(null);
  const timestampIntervalRef = useRef<number | null>(null);

  // Large timeline data for timelapse content section
  const timelineLargeItems: TimelineLargeItem[] = [
    { date: '08-01-2026', image: '/assets/media/img/timeline-1.jpg' },
    { date: '09-01-2026', image: '/assets/media/img/timeline-2.jpg' },
    { date: '10-01-2026', image: '/assets/media/img/timeline-3.jpg' },
    { date: '11-01-2026', image: '/assets/media/img/timeline-4.jpg' },
    { date: '12-01-2026', image: '/assets/media/img/timeline-5.jpg' },
    { date: '13-01-2026', image: '/assets/media/img/timeline-6.jpg' },
  ];

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === undefined) return '--:--';
    const secs = Math.floor(seconds);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const updateTimestamp = useCallback(() => {
    const now = new Date();
    setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }));
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateTimestamp();
      timestampIntervalRef.current = window.setInterval(updateTimestamp, 1000);
    } else {
      if (timestampIntervalRef.current) {
        clearInterval(timestampIntervalRef.current);
      }
    }

    return () => {
      if (timestampIntervalRef.current) {
        clearInterval(timestampIntervalRef.current);
      }
    };
  }, [isOpen, updateTimestamp]);

  useEffect(() => {
    const initializeCamera = async () => {
      if (!camera || !isOpen) return;

      // Determine if this camera should use Genetec streaming
      // Cameras from 'map' or 'grid' sources use Genetec (live streaming)
      // Cameras from 'timelapse' or 'drone' sources use static video
      const isLiveSource = source === 'map' || source === 'grid';
      const shouldUseGenetec = isLiveSource && camera.guid;

      if (shouldUseGenetec) {
        // Wait a tick for the ref to be attached after conditional render
        await new Promise(resolve => setTimeout(resolve, 0));

        if (!genetecContainerRef.current) {
          console.warn('[CameraModal] Genetec container ref not available');
          return;
        }

        try {
          if (playerRef.current) {
            stopGenetecStream(playerRef.current);
          }

          // Show loading state
          genetecContainerRef.current.innerHTML = '<div style="color: white; text-align: center; padding: 40px;">Loading stream...</div>';

          const streamInfo = await openGenetecCamera(camera.guid!);
          playerRef.current = await initGenetecStream(
            genetecContainerRef.current,
            camera.guid!,
            streamInfo
          );
        } catch (err) {
          console.error('Failed to initialize Genetec player:', err);
          if (genetecContainerRef.current) {
            genetecContainerRef.current.innerHTML = `
              <div style="color: #ff4444; text-align: center; padding: 40px;">
                <p style="font-size: 18px; margin-bottom: 10px;">Failed to load stream</p>
                <p style="font-size: 14px; color: #aaa;">${err instanceof Error ? err.message : 'Connection error'}</p>
              </div>
            `;
          }
        }
      } else if (videoRef.current && camera.videoFile) {
        // Use static video for timelapse/drone cameras
        const videoFile = videoMode === 'static' ? camera.liveVideoFile : camera.videoFile;
        videoRef.current.src = `/assets/videos/${videoFile}`;
        videoRef.current.load();
        videoRef.current.play().catch(err => console.log('Video autoplay prevented:', err));
      }
    };

    initializeCamera();

    return () => {
      if (playerRef.current) {
        stopGenetecStream(playerRef.current);
        playerRef.current = null;
      }
    };
  }, [camera, isOpen, videoMode, source]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(formatTime(video.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (playerRef.current) {
      stopGenetecStream(playerRef.current);
      playerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveTab('live');
    onClose();
  };

  const handleTabChange = (tab: 'live' | 'playback') => {
    setActiveTab(tab);
    if (videoRef.current && camera?.videoFile) {
      const videoFile = videoMode === 'static' ? camera.liveVideoFile : camera.videoFile;
      videoRef.current.src = `/assets/videos/${videoFile}`;
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log('Video autoplay prevented:', err));
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + seconds
      ));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = Math.abs(speed);
    }
  };

  // Direction mapping for PTZ
  const ptzDirectionMap: { [key: string]: { pan: number; tilt: number } } = {
    'up': { pan: 0, tilt: 1 },
    'down': { pan: 0, tilt: -1 },
    'left': { pan: -1, tilt: 0 },
    'right': { pan: 1, tilt: 0 },
    'upleft': { pan: -1, tilt: 1 },
    'upright': { pan: 1, tilt: 1 },
    'downleft': { pan: -1, tilt: -1 },
    'downright': { pan: 1, tilt: -1 }
  };

  // Start PTZ movement (called on mousedown/touchstart)
  const handlePTZStart = (direction: string) => {
    if (!playerRef.current) {
      console.warn('PTZ: No player instance available');
      return;
    }

    console.log('PTZ Start:', direction);

    if (direction === 'home') {
      playerRef.current.ptzGoHome();
    } else if (ptzDirectionMap[direction]) {
      const { pan, tilt } = ptzDirectionMap[direction];
      playerRef.current.ptzPanTilt(pan, tilt);
    }
  };

  // Stop PTZ movement (called on mouseup/mouseleave/touchend)
  const handlePTZStop = () => {
    if (!playerRef.current) return;
    console.log('PTZ Stop');
    playerRef.current.ptzStopPanTilt();
  };

  // For backwards compatibility with existing onClick handler
  const handlePTZCommand = (direction: string) => {
    handlePTZStart(direction);
  };

  // Start zoom (called on mousedown/touchstart)
  const handleZoomStart = (direction: 'in' | 'out') => {
    if (!playerRef.current) {
      console.warn('Zoom: No player instance available');
      return;
    }

    console.log('Zoom Start:', direction);
    const zoomValue = direction === 'in' ? 1 : -1;
    playerRef.current.ptzZoom(zoomValue);
  };

  // Stop zoom (called on mouseup/mouseleave/touchend)
  const handleZoomStop = () => {
    if (!playerRef.current) return;
    console.log('Zoom Stop');
    playerRef.current.ptzStopZoom();
  };

  // For backwards compatibility with existing onClick handler
  const handleZoom = (direction: 'in' | 'out') => {
    handleZoomStart(direction);
  };

  if (!isOpen || !camera) return null;

  const isTimelapseView = source === 'timelapse';
  const isLiveSource = source === 'map' || source === 'grid';
  const useGenetecStreaming = isLiveSource && camera.guid;
  const showPTZ = !isTimelapseView && camera.ptz;

  return (
    <div
      className={`modal camera-modal active ${activeTab === 'playback' ? 'playback-mode' : ''} ${isTimelapseView ? 'timelapse-view' : ''}`}
      id="playerModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal-content large">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title" id="modalCameraName">{camera.name}</h2>
            <span className={`badge-status ${camera.status}`}>
              <i className="fa-solid fa-circle"></i> {camera.status === 'online' ? 'Online' : 'Offline'}
            </span>
            {camera.ptz && (
              <span className="badge-tag" id="ptzBadge">
                <i className="fa-solid fa-arrows-rotate"></i> PTZ
              </span>
            )}
          </div>
          <button className="btn-close" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Live/Playback Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'live' ? 'active' : ''}`}
            id="liveTab"
            onClick={() => handleTabChange('live')}
          >
            <i className="ki-duotone ki-wifi live-dot">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i> {isTimelapseView ? 'Timeline' : 'Live'}
          </button>
          <button
            className={`modal-tab ${activeTab === 'playback' ? 'active' : ''}`}
            id="playbackTab"
            onClick={() => handleTabChange('playback')}
          >
            <i className="ki-duotone ki-time">
              <span className="path1"></span>
              <span className="path2"></span>
            </i> {isTimelapseView ? 'Video' : 'Playback'}
          </button>
        </div>

        <div className="modal-body">
          <div className="player-layout">
            {/* Video Player Section */}
            <div className="player-section">
              <div className="video-container">
                {/* Genetec Player Container - shown for map/grid sources with live streaming */}
                {useGenetecStreaming ? (
                  <div
                    ref={genetecContainerRef}
                    id="genetecPlayerContainer"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#000'
                    }}
                  />
                ) : (
                  /* Static Video - for timelapse/drone cameras */
                  <video
                    ref={videoRef}
                    id="testVideoPlayer"
                    className="test-video-player"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {/* Overlay Info */}
                <div className="video-overlay">
                  <div className="overlay-top">
                    <span className="player-mode-label" id="playerMode">
                      {activeTab === 'live' ? 'LIVE' : 'PLAYBACK'}
                    </span>
                    <span className="player-timestamp" id="playerTimestamp">{timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="video-controls" id="videoControls">
                {/* Timeline (Playback only) */}
                <div className="timeline-container playback-only">
                  <input
                    type="range"
                    className="timeline-slider"
                    id="timelineSlider"
                    min="0"
                    max={videoRef.current?.duration || 100}
                    value={videoRef.current?.currentTime || 0}
                    onChange={handleSliderChange}
                  />
                  <div className="timeline-labels">
                    <span id="timeStart">00:00</span>
                    <span id="currentTime">{currentTime}</span>
                    <span id="timeEnd">{duration}</span>
                  </div>
                </div>

                <div className="controls-row">
                  <div className="controls-left">
                    {/* Playback navigation (Playback only) */}
                    <button className="control-btn playback-only" id="btnBackward" onClick={() => handleSeek(-10)}>
                      <i className="fa-solid fa-backward"></i>
                    </button>
                    <button className="control-btn primary" id="btnPlayPause" onClick={handlePlayPause}>
                      <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`}></i>
                    </button>
                    <button className="control-btn playback-only" id="btnForward" onClick={() => handleSeek(10)}>
                      <i className="fa-solid fa-forward"></i>
                    </button>
                    <button className="control-btn playback-only" id="btnLive" onClick={() => handleTabChange('live')}>
                      <i className="fa-solid fa-circle"></i>
                      <span>Live</span>
                    </button>
                  </div>

                  <div className="controls-center playback-only">
                    <input type="datetime-local" className="date-input-compact" id="startDateTime" title="Start Time" />
                    <input type="datetime-local" className="date-input-compact" id="endDateTime" title="End Time" />
                    <span className="duration-display" id="durationText" title="Duration">24h</span>
                    <button className="btn-apply-compact" id="btnApplyDateFilter" title="Apply Filter">
                      <i className="fa-solid fa-filter"></i>
                    </button>
                  </div>

                  <div className="controls-right">
                    <select
                      className="speed-select playback-only"
                      id="speedSelect"
                      value={playbackSpeed}
                      onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    >
                      <option value="-100">-100x</option>
                      <option value="-50">-50x</option>
                      <option value="-10">-10x</option>
                      <option value="1">1x</option>
                      <option value="2">2x</option>
                      <option value="10">10x</option>
                      <option value="50">50x</option>
                      <option value="100">100x</option>
                    </select>
                    <button className="control-btn" id="btnAudio">
                      <i className="fa-solid fa-volume-high"></i>
                    </button>
                    <button className="control-btn" id="btnSnapshot">
                      <i className="fa-solid fa-camera"></i>
                    </button>
                    <button className="control-btn" id="btnFullscreen">
                      <i className="fa-solid fa-expand"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timelapse Content Section (shown when video is hidden in timelapse view) */}
            {isTimelapseView && activeTab === 'live' && (
              <div className="timelapse-content-section" style={{ display: 'flex' }}>
                {/* Timeline Card */}
                <div className="timeline-card-wrapper">
                  <h3 className="timelapse-title">
                    <i className="fa-solid fa-clock"></i>
                    Project Timeline
                  </h3>
                  <div className="timeline-large">
                    {timelineLargeItems.map((item, index) => (
                      <div key={index} className="timeline-item-large">
                        <span className="dot-large"></span>
                        <div className="content-large">
                          <img src={item.image} alt={item.date} className="timeline-img-clickable" />
                          <div className="info-large">
                            <strong>{item.date}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before/After Comparison Card */}
                <div className="before-after-card">
                  <div className="card-header-ba">
                    <h3 className="card-title-ba">
                      <i className="fa-solid fa-images"></i>
                      Before / After
                    </h3>
                  </div>
                  <div className="card-body-ba">
                    <div className="before-box">
                      <img src="/assets/media/img/before.jpg" alt="Before" />
                      <span className="label-ba">Before</span>
                    </div>
                    <div className="after-box">
                      <img src="/assets/media/img/after.jpg" alt="After" />
                      <span className="label-ba">After</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Panel */}
            <div className="side-panel">
              {/* PTZ Controls (Live mode only) */}
              {showPTZ && (
                <PTZControls
                  onPTZCommand={handlePTZCommand}
                  onPTZStop={handlePTZStop}
                  onZoom={handleZoom}
                  onZoomStop={handleZoomStop}
                />
              )}

              {/* Camera Info */}
              <div className="panel-card">
                <h4 className="panel-title">
                  <i className="fa-solid fa-circle-info"></i>
                  Camera Information
                </h4>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-video"></i>
                      Camera
                    </span>
                    <span className="info-value">{camera.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-folder"></i>
                      Project
                    </span>
                    <span className="info-value">{camera.project}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-location-dot"></i>
                      GPS
                    </span>
                    <span className="info-value">{camera.lat.toFixed(4)}°N, {Math.abs(camera.lng).toFixed(4)}°W</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-signal"></i>
                      Status
                    </span>
                    <span className="info-value">
                      <span className={`badge-status ${camera.status} small`}>
                        <i className="fa-solid fa-circle"></i> {camera.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-film"></i>
                      Resolution
                    </span>
                    <span className="info-value">{camera.resolution}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <i className="fa-solid fa-gauge"></i>
                      FPS
                    </span>
                    <span className="info-value">{camera.fps} fps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
