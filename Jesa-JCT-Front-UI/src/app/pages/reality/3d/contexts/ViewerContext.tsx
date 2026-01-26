/**
 * Viewer Context - Global state for APS Viewer
 */

import { createContext, useContext, useReducer, useRef, type ReactNode } from 'react';
import type { SelectedElement, ElementStatus, ViewerStats, StatusFilter, ModelArea, ModelPhase, HierarchySelection } from '../types';

// State type
interface ViewerState {
  isViewerInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  currentUrn: string | null;
  currentModelName: string | null;
  selectedElement: SelectedElement | null;
  statusFilters: StatusFilter[];
  stats: ViewerStats;
  // Hierarchy navigation
  areas: ModelArea[];
  phases: ModelPhase[];
  hierarchySelection: HierarchySelection;
}

// Action types
type ViewerAction =
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_URN'; payload: { urn: string | null; name: string | null } }
  | { type: 'SET_SELECTED_ELEMENT'; payload: SelectedElement | null }
  | { type: 'TOGGLE_STATUS_FILTER'; payload: ElementStatus }
  | { type: 'SET_STATS'; payload: ViewerStats }
  | { type: 'UPDATE_FILTER_COUNTS'; payload: Record<ElementStatus, number> }
  | { type: 'SET_AREAS'; payload: ModelArea[] }
  | { type: 'SET_PHASES'; payload: ModelPhase[] }
  | { type: 'SET_HIERARCHY_SELECTION'; payload: HierarchySelection };

// Initial state
const initialFilters: StatusFilter[] = [
  { status: 'design', label: 'Under Design', color: '#3B82F6', count: 0, active: true },
  { status: 'issued', label: 'IFC Issued', color: '#10B981', count: 0, active: true },
  { status: 'construction', label: 'Under Construction', color: '#F59E0B', count: 0, active: true },
  { status: 'waiting', label: 'Waiting Material', color: '#EF4444', count: 0, active: true },
];

const initialState: ViewerState = {
  isViewerInitialized: false,
  isLoading: false,
  error: null,
  currentUrn: null,
  currentModelName: null,
  selectedElement: null,
  statusFilters: initialFilters,
  stats: { total: 0, displayed: 0, byStatus: { design: 0, issued: 0, construction: 0, waiting: 0 } },
  // Hierarchy navigation
  areas: [],
  phases: [],
  hierarchySelection: { area: null, phase: null },
};

// Reducer
function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isViewerInitialized: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_URN':
      return { ...state, currentUrn: action.payload.urn, currentModelName: action.payload.name };
    case 'SET_SELECTED_ELEMENT':
      return { ...state, selectedElement: action.payload };
    case 'TOGGLE_STATUS_FILTER':
      return {
        ...state,
        statusFilters: state.statusFilters.map((f) =>
          f.status === action.payload ? { ...f, active: !f.active } : f
        ),
      };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'UPDATE_FILTER_COUNTS':
      return {
        ...state,
        statusFilters: state.statusFilters.map((f) => ({
          ...f,
          count: action.payload[f.status] || 0,
        })),
      };
    case 'SET_AREAS':
      console.log('REDUCER: SET_AREAS called with', action.payload.length, 'areas');
      return { ...state, areas: action.payload };
    case 'SET_PHASES':
      console.log('REDUCER: SET_PHASES called with', action.payload.length, 'phases');
      return { ...state, phases: action.payload };
    case 'SET_HIERARCHY_SELECTION':
      return { ...state, hierarchySelection: action.payload };
    default:
      return state;
  }
}

// Element status mapping (dbId -> status)
type ElementStatusMap = Map<number, ElementStatus>;

// Context
interface ViewerContextType {
  state: ViewerState;
  viewerRef: React.MutableRefObject<Autodesk.Viewing.GuiViewer3D | null>;
  elementStatusMap: React.MutableRefObject<ElementStatusMap>;
  setInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  loadModel: (urn: string, name: string) => void;
  selectElement: (element: SelectedElement | null) => void;
  toggleStatusFilter: (status: ElementStatus) => void;
  setStats: (stats: ViewerStats) => void;
  isolateElement: (dbId: number) => void;
  isolateElements: (dbIds: number[]) => void;
  resetView: () => void;
  applyStatusFilters: () => void;
  initializeElementStatuses: () => void;
  extractModelHierarchy: () => void;
  selectArea: (areaId: string | null) => void;
  selectPhase: (phaseId: string | null) => void;
  searchElements: (query: string, attributeNames?: string[]) => Promise<number[]>;
  centerOnElements: (dbIds: number[]) => void;
}

const ViewerContext = createContext<ViewerContextType | null>(null);

// Status colors for 3D visualization
const STATUS_COLORS: Record<ElementStatus, { r: number; g: number; b: number }> = {
  design: { r: 59, g: 130, b: 246 },      // Blue
  issued: { r: 16, g: 185, b: 129 },      // Green
  construction: { r: 245, g: 158, b: 11 }, // Orange
  waiting: { r: 239, g: 68, b: 68 },      // Red
};

// Provider
export function ViewerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  const viewerRef = useRef<Autodesk.Viewing.GuiViewer3D | null>(null);
  const elementStatusMap = useRef<ElementStatusMap>(new Map());

  const setInitialized = (value: boolean) => {
    dispatch({ type: 'SET_INITIALIZED', payload: value });
  };

  const setLoading = (value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: value });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const loadModel = (urn: string, name: string) => {
    dispatch({ type: 'SET_CURRENT_URN', payload: { urn, name } });
  };

  const selectElement = (element: SelectedElement | null) => {
    dispatch({ type: 'SET_SELECTED_ELEMENT', payload: element });
  };

  const toggleStatusFilter = (status: ElementStatus) => {
    dispatch({ type: 'TOGGLE_STATUS_FILTER', payload: status });
  };

  const setStats = (stats: ViewerStats) => {
    dispatch({ type: 'SET_STATS', payload: stats });
  };

  const isolateElement = (dbId: number) => {
    if (viewerRef.current) {
      viewerRef.current.isolate(dbId);
      viewerRef.current.fitToView([dbId]);
    }
  };

  const isolateElements = (dbIds: number[]) => {
    if (viewerRef.current && dbIds.length > 0) {
      viewerRef.current.isolate(dbIds);
      viewerRef.current.fitToView(dbIds);
    }
  };

  const centerOnElements = (dbIds: number[]) => {
    if (viewerRef.current && dbIds.length > 0) {
      viewerRef.current.fitToView(dbIds);
    }
  };

  const resetView = () => {
    if (viewerRef.current) {
      // Clear any isolation first
      viewerRef.current.isolate([]);
      // Show all elements
      viewerRef.current.showAll();
      // Clear selection
      viewerRef.current.clearSelection();
      // Fit entire model in view (recenter)
      viewerRef.current.fitToView(undefined, undefined, true);
    }
  };

  // Search elements by query and optional attribute names
  const searchElements = (query: string, attributeNames?: string[]): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      const viewer = viewerRef.current;
      if (!viewer) {
        resolve([]);
        return;
      }

      viewer.search(
        query,
        (dbIds: number[]) => resolve(dbIds),
        (err: any) => {
          console.error('Search error:', err);
          reject(err);
        },
        attributeNames
      );
    });
  };

  // Extract areas and phases from model's instance tree structure
  // Uses the viewer's built-in hierarchy (always available in any model)
  const extractModelHierarchy = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.model) return;

    const instanceTree = viewer.model.getInstanceTree();
    if (!instanceTree) return;

    const areasMap = new Map<string, number[]>();
    const phasesMap = new Map<string, number[]>();

    const rootId = instanceTree.getRootId();

    console.log('=== EXTRACTING MODEL HIERARCHY FROM TREE ===');
    console.log('Root ID:', rootId);
    console.log('Root name:', instanceTree.getNodeName(rootId));

    // Helper to get all leaf node IDs under a node
    const getLeafIds = (nodeId: number): number[] => {
      const leaves: number[] = [];
      if (instanceTree.getChildCount(nodeId) === 0) {
        leaves.push(nodeId);
      } else {
        instanceTree.enumNodeChildren(nodeId, (childId: number) => {
          if (instanceTree.getChildCount(childId) === 0) {
            leaves.push(childId);
          }
        }, true);
      }
      return leaves;
    };

    // Get direct children of root (Level 1)
    const level1Ids: number[] = [];
    instanceTree.enumNodeChildren(rootId, (dbId: number) => {
      level1Ids.push(dbId);
    }, false);

    console.log('Level 1 nodes:', level1Ids.length);
    console.log('Level 1 names:', level1Ids.slice(0, 10).map(id => instanceTree.getNodeName(id)));

    // Process each Level 1 node as an "Area"
    level1Ids.forEach((level1Id) => {
      const level1Name = instanceTree.getNodeName(level1Id);
      if (!level1Name) return;

      // Get all leaf descendants of this Level 1 node
      const leafIds = getLeafIds(level1Id);

      if (leafIds.length > 0) {
        areasMap.set(level1Name, leafIds);
      }

      // Get Level 2 children (direct children of Level 1 = "Phases")
      const level2Ids: number[] = [];
      instanceTree.enumNodeChildren(level1Id, (childId: number) => {
        level2Ids.push(childId);
      }, false);

      // Process Level 2 as "Phases"
      level2Ids.forEach((level2Id) => {
        const level2Name = instanceTree.getNodeName(level2Id);
        if (!level2Name) return;

        const phaseLeafIds = getLeafIds(level2Id);

        if (phaseLeafIds.length > 0) {
          const existing = phasesMap.get(level2Name) || [];
          phasesMap.set(level2Name, [...existing, ...phaseLeafIds]);
        }
      });
    });

    // If no areas found from Level 1, the tree might be flat - use root's direct children as both
    if (areasMap.size === 0 && level1Ids.length > 0) {
      console.log('Tree appears flat, using Level 1 nodes as categories');
      level1Ids.forEach((nodeId) => {
        const nodeName = instanceTree.getNodeName(nodeId);
        if (nodeName) {
          const leafIds = getLeafIds(nodeId);
          if (leafIds.length > 0) {
            phasesMap.set(nodeName, leafIds);
          }
        }
      });
    }

    // Create unique IDs
    const createUniqueId = (name: string, index: number) => {
      const baseId = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      return `${baseId}_${index}`;
    };

    const areas: ModelArea[] = Array.from(areasMap.entries())
      .map(([name, dbIds], index) => ({
        id: createUniqueId(name, index),
        name,
        dbIds: [...new Set(dbIds)],
      }))
      .filter((a) => a.dbIds.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    const phases: ModelPhase[] = Array.from(phasesMap.entries())
      .map(([name, dbIds], index) => ({
        id: createUniqueId(name, index),
        name,
        dbIds: [...new Set(dbIds)],
      }))
      .filter((p) => p.dbIds.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('=== HIERARCHY EXTRACTION RESULTS ===');
    console.log('Areas found:', areas.length);
    console.log('Areas:', areas.slice(0, 10).map((a) => `${a.name} (${a.dbIds.length})`));
    console.log('Phases found:', phases.length);
    console.log('Phases:', phases.slice(0, 10).map((p) => `${p.name} (${p.dbIds.length})`));

    dispatch({ type: 'SET_AREAS', payload: areas });
    dispatch({ type: 'SET_PHASES', payload: phases });
  };

  // Select area and center view
  const selectArea = (areaId: string | null) => {
    const newSelection = { ...state.hierarchySelection, area: areaId };
    dispatch({ type: 'SET_HIERARCHY_SELECTION', payload: newSelection });

    if (areaId) {
      const area = state.areas.find((a) => a.id === areaId);
      if (area && area.dbIds.length > 0) {
        // Isolate and center on area elements
        if (viewerRef.current) {
          viewerRef.current.isolate(area.dbIds);
          viewerRef.current.fitToView(area.dbIds);
        }
      }
    } else {
      // Reset view when no area selected
      resetView();
    }
  };

  // Select phase and center view
  const selectPhase = (phaseId: string | null) => {
    const newSelection = { ...state.hierarchySelection, phase: phaseId };
    dispatch({ type: 'SET_HIERARCHY_SELECTION', payload: newSelection });

    if (phaseId) {
      const phase = state.phases.find((p) => p.id === phaseId);
      if (phase && phase.dbIds.length > 0) {
        // If area is also selected, intersect the sets
        if (state.hierarchySelection.area) {
          const area = state.areas.find((a) => a.id === state.hierarchySelection.area);
          if (area) {
            const intersectedIds = phase.dbIds.filter((id) => area.dbIds.includes(id));
            if (intersectedIds.length > 0) {
              if (viewerRef.current) {
                viewerRef.current.isolate(intersectedIds);
                viewerRef.current.fitToView(intersectedIds);
              }
            }
          }
        } else {
          // Just show phase elements
          if (viewerRef.current) {
            viewerRef.current.isolate(phase.dbIds);
            viewerRef.current.fitToView(phase.dbIds);
          }
        }
      }
    } else if (state.hierarchySelection.area) {
      // If phase cleared but area still selected, show area only
      selectArea(state.hierarchySelection.area);
    } else {
      // Reset view when nothing selected
      resetView();
    }
  };

  // Initialize element statuses (demo: random assignment)
  const initializeElementStatuses = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const model = viewer.model;
    if (!model) return;

    const instanceTree = model.getInstanceTree();
    if (!instanceTree) return;

    const statuses: ElementStatus[] = ['design', 'issued', 'construction', 'waiting'];
    const statusCounts: Record<ElementStatus, number> = { design: 0, issued: 0, construction: 0, waiting: 0 };
    const newMap = new Map<number, ElementStatus>();
    let totalElements = 0;

    // Traverse all leaf nodes and assign random status
    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      // Only assign status to leaf nodes (actual geometry)
      if (instanceTree.getChildCount(dbId) === 0) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        newMap.set(dbId, status);
        statusCounts[status]++;
        totalElements++;

        // Apply color to element
        const color = STATUS_COLORS[status];
        viewer.setThemingColor(dbId, new window.THREE.Vector4(color.r / 255, color.g / 255, color.b / 255, 1));
      }
    }, true);

    elementStatusMap.current = newMap;

    console.log('Initialized element statuses:', { totalElements, statusCounts });

    // Update stats
    dispatch({
      type: 'SET_STATS',
      payload: {
        total: totalElements,
        displayed: totalElements,
        byStatus: statusCounts,
      },
    });

    // Update filter counts properly via dispatch
    dispatch({
      type: 'UPDATE_FILTER_COUNTS',
      payload: statusCounts,
    });
  };

  // Apply status filters to show/hide elements
  const applyStatusFilters = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.model) {
      console.log('applyStatusFilters: No viewer or model');
      return;
    }

    if (elementStatusMap.current.size === 0) {
      console.log('applyStatusFilters: No element statuses initialized yet');
      return;
    }

    const activeStatuses = state.statusFilters.filter((f) => f.active).map((f) => f.status);
    const idsToShow: number[] = [];
    const idsToHide: number[] = [];

    elementStatusMap.current.forEach((status, dbId) => {
      if (activeStatuses.includes(status)) {
        idsToShow.push(dbId);
      } else {
        idsToHide.push(dbId);
      }
    });

    console.log('applyStatusFilters:', { activeStatuses, show: idsToShow.length, hide: idsToHide.length });

    // Show/hide elements
    if (idsToHide.length > 0) {
      viewer.hide(idsToHide);
    }
    if (idsToShow.length > 0) {
      viewer.show(idsToShow);
    }

    // Update displayed count
    dispatch({
      type: 'SET_STATS',
      payload: {
        ...state.stats,
        displayed: idsToShow.length,
      },
    });
  };

  return (
    <ViewerContext.Provider
      value={{
        state,
        viewerRef,
        elementStatusMap,
        setInitialized,
        setLoading,
        setError,
        loadModel,
        selectElement,
        toggleStatusFilter,
        setStats,
        isolateElement,
        isolateElements,
        resetView,
        applyStatusFilters,
        initializeElementStatuses,
        extractModelHierarchy,
        selectArea,
        selectPhase,
        searchElements,
        centerOnElements,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
}

// Hook
export function useViewer() {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within ViewerProvider');
  }
  return context;
}
