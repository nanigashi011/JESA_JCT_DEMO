/**
 * Type definitions for J-Control Tower 3D Viewer
 */

// Autodesk Viewer Types
declare global {
  interface Window {
    Autodesk: typeof Autodesk;
  }
}

// ACC API Types
export interface AccHub {
  id: string;
  name: string;
}

export interface AccProject {
  id: string;
  name: string;
}

export interface AccFolder {
  id: string;
  name: string;
}

export interface AccContent {
  id: string;
  name: string;
  type: 'folder' | 'item';
  tipVersionUrn?: string;
  fileType?: string;
}

export interface AccVersion {
  versionUrn: string;
  versionNumber: number;
  name: string;
  fileType: string;
  derivativeUrnBase64: string;
}

export interface AccTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'item';
  children?: AccTreeNode[];
  tipVersionUrn?: string;
  fileType?: string;
}

// Token Types
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Manifest Types
export interface ManifestStatus {
  urnBase64: string;
  status: 'success' | 'failed' | 'inprogress' | 'pending' | 'not_found' | 'unknown';
  progress?: string;
  rawManifestJson?: string;
}

// Element Status for construction tracking
export type ElementStatus = string;

export interface ElementProperty {
  label: string;
  value: string | number;
  category?: string;
}

export interface SelectedElement {
  dbId: number;
  name: string;
  type: string;
  properties: ElementProperty[];
  status?: ElementStatus;
}

// Statistics
export interface ViewerStats {
  total: number;
  displayed: number;
  byStatus: Record<string, number>;
}

// Status filter configuration
export interface StatusFilter {
  status: ElementStatus;
  label: string;
  color: string;
  count: number;
  active: boolean;
}

// ==================== 4D Timeline Types ====================

// 4D Project
export interface Project4D {
  id: string;
  name: string;
  modelUrn?: string;
  dataDate?: string;
  projectStart?: string;
  projectFinish?: string;
  totalActivities: number;
  mappedActivities: number;
}

// Activity from P6
export interface Activity {
  id: string;
  name: string;
  wbsCode?: string;
  plannedStart?: string;
  plannedFinish?: string;
  actualStart?: string;
  actualFinish?: string;
  percentComplete: number;
  plannedCost?: number;
  actualCost?: number;
  activityType?: string;
}

// WBS Node
export interface WbsNode {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  children?: WbsNode[];
}

// Schedule import result
export interface ScheduleImportResult {
  projectId: string;
  projectName: string;
  activityCount: number;
  wbsCount: number;
  projectStart?: string;
  projectFinish?: string;
  dataDate?: string;
  wbsHierarchy: WbsNode[];
  activities: Activity[];
}

// Activity-Element Mapping
export interface ActivityElementMapping {
  id: string;
  activityId: string;
  elementDbId: number;
  elementExternalId?: string;
  mappingType: 'manual' | 'auto';
}

// Timeline element state
export interface ElementTimelineState {
  dbId: number;
  status: TimelineStatus;
  progress: number;
  activityId?: string;
  activityName?: string;
}

// Timeline state for a date
export interface TimelineState {
  targetDate: string;
  elements: ElementTimelineState[];
}

// Timeline status (different from ElementStatus)
export type TimelineStatus = 'not_started' | 'in_progress' | 'completed' | 'completed_late' | 'delayed';

// ==================== Model Hierarchy Types ====================

// Model area/zone from 3D properties
export interface ModelArea {
  id: string;
  name: string;
  dbIds: number[];
}

// Model phase from 3D properties
export interface ModelPhase {
  id: string;
  name: string;
  dbIds: number[];
}

// Hierarchy selection state
export interface HierarchySelection {
  area: string | null;
  phase: string | null;
}
