import { GENETEC_CONFIG } from '../data/camerasData';

export interface StreamInfo {
  endpoint: string;
  playerJsUrl: string;
  tokenApiUrl: string;
}

export interface GenetecPlayer {
  container: HTMLElement;
  cameraGuid: string;
  streamInfo: StreamInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playerInstance?: any;
  stop: () => void;
  // PTZ Control methods
  ptzPanTilt: (pan: number, tilt: number) => void;
  ptzStopPanTilt: () => void;
  ptzZoom: (direction: number) => void;
  ptzStopZoom: () => void;
  ptzGoHome: () => void;
  ptzStopAll: () => void;
}

/**
 * Dynamically loads the Genetec Web Player (gwp.js) script
 */
async function loadGenetecScript(playerJsUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.gwp || win.GWP || win.Genetec) {
      console.log('[Genetec] gwp.js already loaded');
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(`script[src="${playerJsUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    // Create and load script
    console.log('[Genetec] Loading gwp.js from:', playerJsUrl);
    const script = document.createElement('script');
    script.src = playerJsUrl;
    script.async = true;

    script.onload = () => {
      console.log('[Genetec] gwp.js loaded successfully');
      resolve();
    };

    script.onerror = (err) => {
      console.error('[Genetec] Failed to load gwp.js:', err);
      reject(new Error(`Failed to load Genetec player script from ${playerJsUrl}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Derives the Media Gateway base endpoint from playerJsUrl
 * Example: https://host/media/v2/files/gwp.js => https://host/media
 */
function deriveMediaGatewayEndpoint(playerJsUrl: string): string {
  try {
    const url = new URL(playerJsUrl);
    return `${url.origin}/media`;
  } catch (err) {
    console.error('[Genetec] Invalid playerJsUrl:', playerJsUrl, err);
    throw new Error('Invalid playerJsUrl - cannot derive Media Gateway endpoint');
  }
}

/**
 * Creates a token retriever function for the Genetec player
 */
function createTokenRetriever(cameraGuid: string): () => Promise<string> {
  return async () => {
    try {
      console.log('[Genetec] Token retriever called for camera:', cameraGuid);
      const response = await fetch(GENETEC_CONFIG.endpoints.token(cameraGuid));

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Genetec] Token received:', data.token ? `${data.token.slice(0, 12)}...` : 'null');
      return data.token;
    } catch (err) {
      console.error('[Genetec] Token retrieval failed:', err);
      throw err;
    }
  };
}

/**
 * Fetches stream information from the /open endpoint
 */
export const openGenetecCamera = async (cameraGuid: string): Promise<StreamInfo> => {
  try {
    console.log('[Genetec] Opening camera:', cameraGuid);
    const response = await fetch(GENETEC_CONFIG.endpoints.open(cameraGuid));

    if (!response.ok) {
      throw new Error(`Open camera request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Genetec] Camera opened successfully:', data);
    return data;
  } catch (err) {
    console.error('[Genetec] Failed to open camera:', err);
    throw err;
  }
};

/**
 * Initializes and starts a Genetec streaming session
 */
export const initGenetecStream = async (
  container: HTMLElement,
  cameraGuid: string,
  streamInfo: StreamInfo
): Promise<GenetecPlayer> => {
  try {
    console.log('[Genetec] Initializing stream for camera:', cameraGuid);
    console.log('[Genetec] Stream info:', streamInfo);

    // 1. Load gwp.js
    await loadGenetecScript(streamInfo.playerJsUrl);

    // 2. Derive Media Gateway endpoint
    const mediaGatewayEndpoint = deriveMediaGatewayEndpoint(streamInfo.playerJsUrl);
    console.log('[Genetec] Media Gateway endpoint:', mediaGatewayEndpoint);

    // 3. Get gwp object from window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const gwp = win.gwp || win.GWP || win.Genetec || win.GenetecWebPlayer;
    if (!gwp) {
      throw new Error('Genetec Web Player (gwp) not found on window object');
    }

    if (typeof gwp.buildPlayer !== 'function') {
      throw new Error('gwp.buildPlayer() function not found');
    }

    // 4. Create player
    console.log('[Genetec] Creating player instance');
    // Clear any loading message before building player
    container.innerHTML = '';
    const playerInstance = gwp.buildPlayer(container);

    if (!playerInstance || typeof playerInstance.start !== 'function') {
      throw new Error('Player created but start() method not found');
    }

    // 5. Create token retriever
    const tokenRetriever = createTokenRetriever(cameraGuid);

    // 6. Start session
    console.log('[Genetec] Starting player session');
    await playerInstance.start(cameraGuid, mediaGatewayEndpoint, tokenRetriever);
    console.log('[Genetec] Player session started');

    // 7. Play live stream
    if (typeof playerInstance.playLive === 'function') {
      console.log('[Genetec] Starting live playback');
      playerInstance.playLive();
      console.log('[Genetec] Live playback started successfully');
    } else {
      console.warn('[Genetec] playLive() method not found on player');
    }

    // Get PTZ control from player instance
    const ptzControl = playerInstance.ptzControl || playerInstance.getPtzControl?.() || null;
    if (ptzControl) {
      console.log('[Genetec] PTZ control available');
    } else {
      console.warn('[Genetec] PTZ control not available on player instance');
    }

    // Create player object with PTZ controls
    const player: GenetecPlayer = {
      container,
      cameraGuid,
      streamInfo,
      playerInstance,
      stop: () => {
        try {
          console.log('[Genetec] Stopping and cleaning up player');
          if (typeof playerInstance.stop === 'function') {
            playerInstance.stop();
          }
          if (typeof playerInstance.destroy === 'function') {
            playerInstance.destroy();
          }
          if (typeof playerInstance.dispose === 'function') {
            playerInstance.dispose();
          }
          container.innerHTML = '';
          console.log('[Genetec] Player cleanup complete');
        } catch (err) {
          console.warn('[Genetec] Error during player cleanup:', err);
        }
      },
      // PTZ Controls
      ptzPanTilt: (pan: number, tilt: number) => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.startPanTilt === 'function') {
            console.log('[Genetec] PTZ startPanTilt:', pan, tilt);
            ctrl.startPanTilt(pan, tilt);
          } else {
            console.warn('[Genetec] PTZ startPanTilt not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ panTilt error:', err);
        }
      },
      ptzStopPanTilt: () => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.stopPanTilt === 'function') {
            console.log('[Genetec] PTZ stopPanTilt');
            ctrl.stopPanTilt();
          } else {
            console.warn('[Genetec] PTZ stopPanTilt not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ stopPanTilt error:', err);
        }
      },
      ptzZoom: (direction: number) => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.startZoom === 'function') {
            console.log('[Genetec] PTZ startZoom:', direction);
            ctrl.startZoom(direction);
          } else {
            console.warn('[Genetec] PTZ startZoom not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ zoom error:', err);
        }
      },
      ptzStopZoom: () => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.stopZoom === 'function') {
            console.log('[Genetec] PTZ stopZoom');
            ctrl.stopZoom();
          } else {
            console.warn('[Genetec] PTZ stopZoom not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ stopZoom error:', err);
        }
      },
      ptzGoHome: () => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.goHome === 'function') {
            console.log('[Genetec] PTZ goHome');
            ctrl.goHome();
          } else {
            console.warn('[Genetec] PTZ goHome not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ goHome error:', err);
        }
      },
      ptzStopAll: () => {
        try {
          const ctrl = playerInstance.ptzControl || playerInstance.getPtzControl?.();
          if (ctrl && typeof ctrl.stop === 'function') {
            console.log('[Genetec] PTZ stop all');
            ctrl.stop();
          } else {
            console.warn('[Genetec] PTZ stop not available');
          }
        } catch (err) {
          console.error('[Genetec] PTZ stopAll error:', err);
        }
      }
    };

    return player;
  } catch (err) {
    console.error('[Genetec] Stream initialization failed:', err);

    // Show error in container
    container.innerHTML = `
      <div style="color: #ff4444; text-align: center; padding: 40px;">
        <p style="font-size: 18px; margin-bottom: 10px;">Failed to load stream</p>
        <p style="font-size: 14px; color: #aaa;">${err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    `;

    throw err;
  }
};

/**
 * Stops and cleans up a Genetec player instance
 */
export const stopGenetecStream = (player: GenetecPlayer | null): void => {
  if (player) {
    player.stop();
  }
};

/**
 * Get camera token (for authentication)
 */
export const getCameraToken = async (cameraGuid: string): Promise<string> => {
  try {
    const response = await fetch(GENETEC_CONFIG.endpoints.token(cameraGuid));
    if (!response.ok) {
      throw new Error(`Failed to get camera token: ${response.status}`);
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('[Genetec] Error getting token:', error);
    throw error;
  }
};
