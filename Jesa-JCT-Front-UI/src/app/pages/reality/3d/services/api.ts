/**
 * API Service - Connects to .NET Backend
 */

import type {
  TokenResponse,
  AccHub,
  AccProject,
  AccContent,
  AccVersion,
  AccTreeNode,
  ManifestStatus,
} from '../types';

// Use relative path '/api' for Vite proxy to forward to backend
const API_BASE = '/api';

// ==================== Performance Caches ====================

// Token cache
let cachedToken: { token: string; expiresAt: number } | null = null;

// Manifest status cache (30 min TTL - translations rarely change)
const manifestCache = new Map<string, { status: ManifestStatus; timestamp: number }>();
const MANIFEST_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Promise for in-flight token request (prevents duplicate requests)
let tokenFetchPromise: Promise<TokenResponse> | null = null;

/**
 * Preload token on app startup - call this in main.tsx
 * Eliminates 200-500ms delay when viewer initializes
 */
export function preloadToken(): void {
  getAccessToken().catch((err) => {
    console.warn('Token preload failed (will retry on demand):', err);
  });
}

/**
 * Get access token for APS Viewer
 * Optimized with request deduplication to prevent multiple concurrent fetches
 */
export async function getAccessToken(): Promise<TokenResponse> {
  // Check cache first (with 5 min buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return {
      access_token: cachedToken.token,
      token_type: 'Bearer',
      expires_in: Math.floor((cachedToken.expiresAt - Date.now()) / 1000),
    };
  }

  // If a fetch is already in progress, wait for it (prevents duplicate requests)
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  // Start a new fetch and store the promise
  tokenFetchPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/autodesk/token`);
      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data: TokenResponse = await response.json();

      // Cache the token
      cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      return data;
    } finally {
      // Clear the promise so future calls can fetch again if needed
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
}

/**
 * List all ACC hubs
 */
export async function getHubs(): Promise<AccHub[]> {
  const response = await fetch(`${API_BASE}/acc/hubs`);
  if (!response.ok) {
    throw new Error('Failed to get hubs');
  }
  return response.json();
}

/**
 * List projects in a hub
 */
export async function getProjects(hubId: string): Promise<AccProject[]> {
  const response = await fetch(`${API_BASE}/acc/hubs/${hubId}/projects`);
  if (!response.ok) {
    throw new Error('Failed to get projects');
  }
  return response.json();
}

/**
 * Get folder contents
 */
export async function getFolderContents(
  projectId: string,
  folderId: string
): Promise<AccContent[]> {
  const response = await fetch(
    `${API_BASE}/acc/projects/${projectId}/folders/${encodeURIComponent(folderId)}/contents`
  );
  if (!response.ok) {
    throw new Error('Failed to get folder contents');
  }
  return response.json();
}

/**
 * Get item versions
 */
export async function getItemVersions(
  projectId: string,
  itemId: string
): Promise<AccVersion[]> {
  const response = await fetch(
    `${API_BASE}/acc/projects/${projectId}/items/${encodeURIComponent(itemId)}/versions`
  );
  if (!response.ok) {
    throw new Error('Failed to get item versions');
  }
  return response.json();
}

/**
 * Get project tree (recursive with 3D file filtering)
 */
export async function getProjectTree(
  hubId: string,
  projectId: string,
  maxDepth: number = 6,
  maxNodes: number = 5000
): Promise<AccTreeNode> {
  const response = await fetch(
    `${API_BASE}/acc/hubs/${hubId}/projects/${projectId}/tree?maxDepth=${maxDepth}&maxNodes=${maxNodes}`
  );
  if (!response.ok) {
    throw new Error('Failed to get project tree');
  }
  return response.json();
}

/**
 * Encode URN to base64url
 */
export async function encodeUrn(urn: string): Promise<{ urn: string; urnBase64: string }> {
  const response = await fetch(`${API_BASE}/derivative/encode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urn }),
  });
  if (!response.ok) {
    throw new Error('Failed to encode URN');
  }
  return response.json();
}

/**
 * Get manifest/translation status
 * Cached for 30 minutes since translations rarely change once complete
 */
export async function getManifestStatus(urnBase64: string): Promise<ManifestStatus> {
  // Check cache first
  const cached = manifestCache.get(urnBase64);
  if (cached && Date.now() - cached.timestamp < MANIFEST_CACHE_TTL) {
    // Only return cached success/failed states (not in-progress)
    if (cached.status.status === 'success' || cached.status.status === 'failed') {
      return cached.status;
    }
  }

  const response = await fetch(`${API_BASE}/derivative/${urnBase64}/manifest-status`);
  if (!response.ok) {
    throw new Error('Failed to get manifest status');
  }

  const status: ManifestStatus = await response.json();

  // Cache the result
  manifestCache.set(urnBase64, { status, timestamp: Date.now() });

  return status;
}

/**
 * Clear manifest cache for a specific URN (useful after translation completes)
 */
export function clearManifestCache(urnBase64?: string): void {
  if (urnBase64) {
    manifestCache.delete(urnBase64);
  } else {
    manifestCache.clear();
  }
}

/**
 * Start SVF2 translation
 */
export async function startTranslation(urnBase64: string): Promise<{ urn: string; status: string }> {
  const response = await fetch(`${API_BASE}/derivative/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urnBase64 }),
  });
  if (!response.ok) {
    throw new Error('Failed to start translation');
  }
  return response.json();
}

// ==================== 4D Schedule APIs ====================

import type {
  Project4D,
  Activity,
  WbsNode,
  TimelineState,
  ScheduleImportResult,
  ActivityElementMapping,
} from '../types';

/**
 * Get all 4D projects
 */
export async function get4DProjects(): Promise<Project4D[]> {
  const response = await fetch(`${API_BASE}/4d/projects`);
  if (!response.ok) {
    throw new Error('Failed to get 4D projects');
  }
  return response.json();
}

/**
 * Import P6 XML schedule
 */
export async function importSchedule(file: File, modelUrn?: string): Promise<{
  project: Project4D;
  parseResult: ScheduleImportResult;
}> {
  const formData = new FormData();
  formData.append('file', file);

  let url = `${API_BASE}/4d/import`;
  if (modelUrn) {
    url += `?modelUrn=${encodeURIComponent(modelUrn)}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to import schedule');
  }
  return response.json();
}

/**
 * Preview P6 XML without importing
 */
export async function previewSchedule(file: File): Promise<ScheduleImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/4d/preview`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to preview schedule');
  }
  return response.json();
}

/**
 * Get activities for a project
 */
export async function getActivities(projectId: string): Promise<Activity[]> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/activities`);
  if (!response.ok) {
    throw new Error('Failed to get activities');
  }
  return response.json();
}

/**
 * Get WBS hierarchy
 */
export async function getWbsHierarchy(projectId: string): Promise<WbsNode[]> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/wbs`);
  if (!response.ok) {
    throw new Error('Failed to get WBS hierarchy');
  }
  return response.json();
}

/**
 * Get timeline state for a date
 */
export async function getTimelineState(projectId: string, date: Date): Promise<TimelineState> {
  const dateStr = date.toISOString();
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/timeline?date=${dateStr}`);
  if (!response.ok) {
    throw new Error('Failed to get timeline state');
  }
  return response.json();
}

/**
 * Save activity-element mappings
 */
export async function saveMappings(
  projectId: string,
  mappings: ActivityElementMapping[]
): Promise<void> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mappings),
  });
  if (!response.ok) {
    throw new Error('Failed to save mappings');
  }
}

/**
 * Get mappings for a project
 */
export async function getMappings(projectId: string): Promise<ActivityElementMapping[]> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/mappings`);
  if (!response.ok) {
    throw new Error('Failed to get mappings');
  }
  return response.json();
}

/**
 * Add a single mapping
 */
export async function addMapping(
  projectId: string,
  activityId: string,
  elementDbId: number,
  elementExternalId?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/mappings/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, elementDbId, elementExternalId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add mapping');
  }
}

/**
 * Remove a mapping
 */
export async function removeMapping(projectId: string, elementDbId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/mappings/${elementDbId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove mapping');
  }
}

/**
 * Update the linked 3D model for a 4D project
 */
export async function update4DProjectModel(
  projectId: string,
  modelUrn: string
): Promise<Project4D> {
  const response = await fetch(`${API_BASE}/4d/projects/${projectId}/model`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelUrn }),
  });
  if (!response.ok) {
    throw new Error('Failed to update project model');
  }
  return response.json();
}
