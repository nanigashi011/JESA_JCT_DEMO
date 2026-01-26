/**
 * Autodesk Viewer SDK Lazy Loader
 * Loads the ~2MB viewer SDK on-demand instead of blocking initial page load
 */

// Track loading state
let loadPromise: Promise<void> | null = null;
let isLoaded = false;

// Viewer SDK URL
const VIEWER_JS_URL = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js';
const VIEWER_CSS_URL = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css';

/**
 * Check if Autodesk Viewer SDK is already loaded
 */
export function isViewerSDKLoaded(): boolean {
  return isLoaded || (typeof window !== 'undefined' && !!window.Autodesk?.Viewing);
}

/**
 * Load the Autodesk Viewer SDK dynamically
 * Returns immediately if already loaded, otherwise loads asynchronously
 */
export async function loadViewerSDK(): Promise<void> {
  // Already loaded
  if (isViewerSDKLoaded()) {
    isLoaded = true;
    return;
  }

  // Loading in progress - return existing promise
  if (loadPromise) {
    return loadPromise;
  }

  // Start loading
  loadPromise = (async () => {
    try {
      // Load CSS first (non-blocking)
      loadCSS(VIEWER_CSS_URL);

      // Load JS (blocking until complete)
      await loadScript(VIEWER_JS_URL);

      // Verify it loaded
      if (!window.Autodesk?.Viewing) {
        throw new Error('Autodesk Viewer SDK failed to initialize');
      }

      isLoaded = true;
      console.log('Autodesk Viewer SDK loaded successfully');
    } catch (error) {
      loadPromise = null; // Allow retry on failure
      throw error;
    }
  })();

  return loadPromise;
}

/**
 * Preload the viewer SDK (call early but don't block)
 */
export function preloadViewerSDK(): void {
  loadViewerSDK().catch((err) => {
    console.warn('Viewer SDK preload failed (will retry on demand):', err);
  });
}

/**
 * Load a script dynamically
 */
function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Load a CSS file dynamically
 */
function loadCSS(url: string): void {
  // Check if CSS already exists
  if (document.querySelector(`link[href="${url}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}
