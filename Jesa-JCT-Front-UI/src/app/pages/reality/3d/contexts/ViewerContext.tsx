/**
 * Viewer Context - FIXED VERSION
 */

import { createContext, useContext, useReducer, useRef, type ReactNode } from 'react';
import type { SelectedElement, ElementStatus, ViewerStats, StatusFilter, ModelArea, ModelPhase, HierarchySelection } from '../types';

interface ViewerState {
  viewer: Autodesk.Viewing.GuiViewer3D | null; // Add this line
  isViewerInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  currentUrn: string | null;
  currentModelName: string | null;
  currentProjectId: string | null;
  currentItemId: string | null;
  currentVersionId: string | null;
  selectedElement: SelectedElement | null;
  statusFilters: StatusFilter[];
  stats: ViewerStats;
  areas: ModelArea[];
  phases: ModelPhase[];
  hierarchySelection: HierarchySelection;
}

type ViewerAction =
  | { type: 'SET_VIEWER'; payload: Autodesk.Viewing.GuiViewer3D | null } // Add this line
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_MODEL'; payload: { urn: string | null; name: string | null; projectId: string | null; itemId: string | null; versionId: string | null } }
  | { type: 'SET_SELECTED_ELEMENT'; payload: SelectedElement | null }
  | { type: 'SET_STATUS_FILTERS'; payload: StatusFilter[] }  // ← ADD THIS LINE
  | { type: 'TOGGLE_STATUS_FILTER'; payload: ElementStatus }
  | { type: 'SET_STATS'; payload: ViewerStats }
  | { type: 'UPDATE_FILTER_COUNTS'; payload: Record<ElementStatus, number> }
  | { type: 'SET_AREAS'; payload: ModelArea[] }
  | { type: 'SET_PHASES'; payload: ModelPhase[] }
  | { type: 'SET_HIERARCHY_SELECTION'; payload: HierarchySelection };


const initialState: ViewerState = {
  viewer: null, // Initialize viewer as null
  isViewerInitialized: false,
  isLoading: false,
  error: null,
  currentUrn: null,
  currentModelName: null,
  currentProjectId: null,
  currentItemId: null,
  currentVersionId: null,
  selectedElement: null,
  statusFilters: [],
  stats: { total: 0, displayed: 0, byStatus: { design: 0, issued: 0, construction: 0, waiting: 0 } },
  areas: [],
  phases: [],
  hierarchySelection: { area: null, phase: null },
};

function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case 'SET_VIEWER': // Add this case
      return { ...state, viewer: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isViewerInitialized: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_STATUS_FILTERS':  // ← ADD THIS CASE
      return { ...state, statusFilters: action.payload };  
    case 'SET_CURRENT_MODEL':
      return { 
        ...state, 
        currentUrn: action.payload.urn, 
        currentModelName: action.payload.name,
        currentProjectId: action.payload.projectId,
        currentItemId: action.payload.itemId,
        currentVersionId: action.payload.versionId,
      };
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
      return { ...state, areas: action.payload };
    case 'SET_PHASES':
      return { ...state, phases: action.payload };
    case 'SET_HIERARCHY_SELECTION':
      return { ...state, hierarchySelection: action.payload };
    default:
      return state;
  }
}

type ElementStatusMap = Map<number, ElementStatus>;

interface ViewerContextType {
  state: ViewerState;
  setViewer: (viewer: Autodesk.Viewing.GuiViewer3D | null) => void; // Add this line
  viewerRef: React.MutableRefObject<Autodesk.Viewing.GuiViewer3D | null>;
  elementStatusMap: React.MutableRefObject<ElementStatusMap>;
  setInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  loadModel: (urn: string, name: string, projectId?: string, itemId?: string, versionId?: string) => void;
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

const STATUS_COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Dark Orange
  '#14B8A6', // Teal
  '#EC4899', // Pink
  '#84CC16', // Lime
];

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  const viewerRef = useRef<Autodesk.Viewing.GuiViewer3D | null>(null);
  const elementStatusMap = useRef<ElementStatusMap>(new Map());

  const setViewer = (viewer: Autodesk.Viewing.GuiViewer3D | null) => {
    dispatch({ type: 'SET_VIEWER', payload: viewer });
  };

  const setInitialized = (value: boolean) => {
    dispatch({ type: 'SET_INITIALIZED', payload: value });
  };

  const setLoading = (value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: value });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const loadModel = (
    urn: string, 
    name: string, 
    projectId?: string, 
    itemId?: string, 
    versionId?: string
  ) => {
    dispatch({ 
      type: 'SET_CURRENT_MODEL', 
      payload: { 
        urn, 
        name, 
        projectId: projectId || null,
        itemId: itemId || null,
        versionId: versionId || null,
      } 
    });
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
      viewerRef.current.isolate([]);
      viewerRef.current.showAll();
      // Clear selection - TypeScript doesn't know about this method
      (viewerRef.current as any).clearSelection();  // ← Fixed
      viewerRef.current.fitToView();
    }
  };

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

  const extractModelHierarchy = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.model) return;

    const instanceTree = viewer.model.getInstanceTree();
    if (!instanceTree) return;

    const areasMap = new Map<string, number[]>();
    const phasesMap = new Map<string, number[]>();
    const rootId = instanceTree.getRootId();

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

    const level1Ids: number[] = [];
    instanceTree.enumNodeChildren(rootId, (dbId: number) => {
      level1Ids.push(dbId);
    }, false);

    level1Ids.forEach((level1Id) => {
      const level1Name = instanceTree.getNodeName(level1Id);
      if (!level1Name) return;

      const leafIds = getLeafIds(level1Id);
      if (leafIds.length > 0) {
        areasMap.set(level1Name, leafIds);
      }

      const level2Ids: number[] = [];
      instanceTree.enumNodeChildren(level1Id, (childId: number) => {
        level2Ids.push(childId);
      }, false);

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

    if (areasMap.size === 0 && level1Ids.length > 0) {
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

    dispatch({ type: 'SET_AREAS', payload: areas });
    dispatch({ type: 'SET_PHASES', payload: phases });
  };

  const selectArea = (areaId: string | null) => {
    const newSelection = { ...state.hierarchySelection, area: areaId };
    dispatch({ type: 'SET_HIERARCHY_SELECTION', payload: newSelection });

    if (areaId) {
      const area = state.areas.find((a) => a.id === areaId);
      if (area && area.dbIds.length > 0 && viewerRef.current) {
        viewerRef.current.isolate(area.dbIds);
        viewerRef.current.fitToView(area.dbIds);
      }
    } else {
      resetView();
    }
  };

  const selectPhase = (phaseId: string | null) => {
    const newSelection = { ...state.hierarchySelection, phase: phaseId };
    dispatch({ type: 'SET_HIERARCHY_SELECTION', payload: newSelection });

    if (phaseId) {
      const phase = state.phases.find((p) => p.id === phaseId);
      if (phase && phase.dbIds.length > 0) {
        if (state.hierarchySelection.area) {
          const area = state.areas.find((a) => a.id === state.hierarchySelection.area);
          if (area) {
            const intersectedIds = phase.dbIds.filter((id) => area.dbIds.includes(id));
            if (intersectedIds.length > 0 && viewerRef.current) {
              viewerRef.current.isolate(intersectedIds);
              viewerRef.current.fitToView(intersectedIds);
            }
          }
        } else {
          if (viewerRef.current) {
            viewerRef.current.isolate(phase.dbIds);
            viewerRef.current.fitToView(phase.dbIds);
          }
        }
      }
    } else if (state.hierarchySelection.area) {
      selectArea(state.hierarchySelection.area);
    } else {
      resetView();
    }
  };

  const initializeElementStatuses = () => {
    const viewer = viewerRef.current;
    if (!viewer?.model) return;

    const instanceTree = viewer.model.getInstanceTree();
    if (!instanceTree) return;

    console.log('🔍 Scanning model for status values...');

    // Step 1: Discover unique status values
    const statusValuesSet = new Set<string>();
    let totalElements = 0;
    let scannedElements = 0;

    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      if (instanceTree.getChildCount(dbId) === 0) totalElements++;
    }, true);

    console.log(`Found ${totalElements} elements to scan`);

    // Scan all elements
    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      if (instanceTree.getChildCount(dbId) === 0) {
        (viewer as any).getProperties(dbId, (result: any) => {
          const statusProp = result.properties.find((p: any) => 
            p.displayName === 'Status'
          );

          if (statusProp?.displayValue) {
            statusValuesSet.add(statusProp.displayValue);
          }

          scannedElements++;

          // When scan complete, create filters
          if (scannedElements === totalElements) {
            const uniqueStatuses = Array.from(statusValuesSet).sort();
            console.log('✅ Found unique status values:', uniqueStatuses);

            // Create dynamic filters
            const dynamicFilters: StatusFilter[] = uniqueStatuses.map((statusValue, index) => ({
              status: statusValue.toLowerCase().replace(/\s+/g, '_') as ElementStatus,
              label: statusValue,
              color: STATUS_COLOR_PALETTE[index % STATUS_COLOR_PALETTE.length],
              count: 0,
              active: true,
            }));

            dispatch({ type: 'SET_STATUS_FILTERS', payload: dynamicFilters });

            // Now process elements with these filters
            processElementStatuses(viewer, instanceTree, dynamicFilters);
          }
        });
      }
    }, true);
  };

  const processElementStatuses = (
    viewer: Autodesk.Viewing.GuiViewer3D,
    instanceTree: any,
    filters: StatusFilter[]
  ) => {
    console.log('🎨 Processing element statuses...');

    const statusCounts: Record<string, number> = {};
    filters.forEach(f => statusCounts[f.status] = 0);

    const newMap = new Map<number, ElementStatus>();
    let totalElements = 0;
    let processedElements = 0;

    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      if (instanceTree.getChildCount(dbId) === 0) totalElements++;
    }, true);

    const statusMap = new Map<string, StatusFilter>();
    filters.forEach(filter => {
      statusMap.set(filter.label.toLowerCase(), filter);
    });

    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      if (instanceTree.getChildCount(dbId) === 0) {
        (viewer as any).getProperties(dbId, (result: any) => {
          const statusProp = result.properties.find((p: any) => 
            p.displayName === 'Status'
          );

          let matchedFilter = filters[0]; // Default

          if (statusProp?.displayValue) {
            const found = statusMap.get(statusProp.displayValue.toLowerCase());
            if (found) matchedFilter = found;
          }

          newMap.set(dbId, matchedFilter.status);
          statusCounts[matchedFilter.status]++;
          processedElements++;

          // Apply color
          const colorHex = matchedFilter.color.replace('#', '');
          const r = parseInt(colorHex.substr(0, 2), 16);
          const g = parseInt(colorHex.substr(2, 2), 16);
          const b = parseInt(colorHex.substr(4, 2), 16);
          
          viewer.setThemingColor(
            dbId,
            new window.THREE.Vector4(r / 255, g / 255, b / 255, 1)
          );

          if (processedElements === totalElements) {
            elementStatusMap.current = newMap;

            console.log('✅ Complete:');
            filters.forEach(f => {
              console.log(`  ${f.label}: ${statusCounts[f.status]}`);
            });

            const updatedFilters = filters.map(f => ({
              ...f,
              count: statusCounts[f.status] || 0,
            }));

            dispatch({ type: 'SET_STATUS_FILTERS', payload: updatedFilters });

            dispatch({
              type: 'SET_STATS',
              payload: {
                total: processedElements,
                displayed: processedElements,
                byStatus: statusCounts,
              },
            });
          }
        });
      }
    }, true);
  };

  const applyStatusFilters = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.model) return;

    if (elementStatusMap.current.size === 0) return;

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

    if (idsToHide.length > 0) {
      viewer.hide(idsToHide);
    }
    if (idsToShow.length > 0) {
      viewer.show(idsToShow);
    }

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
        setViewer, // Add this here
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

export function useViewer() {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within ViewerProvider');
  }
  return context;
}