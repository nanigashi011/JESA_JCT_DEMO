/**
 * Project Navigation Component - FIXED WITH VERSION SUPPORT
 * Hierarchical navigation: Hub → Project → Area → Phase
 * With integrated search and auto-centering
 */

import { useState, useEffect } from 'react';
import { getHubs, getProjects, getProjectTree, getItemVersions } from '../services/api';
import { useViewer } from '../contexts/ViewerContext';
import { SearchBar } from './SearchBar';
import type { AccHub, AccProject, AccTreeNode } from '../types';

export function ProjectNavigation() {
  const [hubs, setHubs] = useState<AccHub[]>([]);
  const [projects, setProjects] = useState<AccProject[]>([]);
  const [tree, setTree] = useState<AccTreeNode | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loadModel, state, selectArea, selectPhase, resetView } = useViewer();
  const { areas, phases, hierarchySelection } = state;

  // Debug: log when areas/phases change
  useEffect(() => {
    console.log('ProjectNavigation: areas updated:', areas.length, areas.slice(0, 3).map(a => a.name));
    console.log('ProjectNavigation: phases updated:', phases.length, phases.slice(0, 3).map(p => p.name));
  }, [areas, phases]);

  // Load hubs on mount
  useEffect(() => {
    loadHubs();
  }, []);

  const loadHubs = async () => {
    try {
      setLoading(true);
      const data = await getHubs();
      setHubs(data);
    } catch (err) {
      setError('Failed to load hubs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onHubChange = async (hubId: string) => {
    setSelectedHub(hubId);
    setSelectedProject('');
    setTree(null);
    setProjects([]);

    if (!hubId) return;

    try {
      setLoading(true);
      const data = await getProjects(hubId);
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onProjectChange = async (projectId: string) => {
    console.log('=== PROJECT SELECTED ===', projectId);
    setSelectedProject(projectId);
    setTree(null);

    if (!projectId || !selectedHub) return;

    try {
      setLoading(true);
      console.log('Fetching project tree for hub:', selectedHub, 'project:', projectId);
      const data = await getProjectTree(selectedHub, projectId);
      console.log('Project tree received:', data);
      console.log('Tree children count:', data?.children?.length);
      setTree(data);
    } catch (err) {
      setError('Failed to load project tree');
      console.error('Project tree error:', err);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Now fetches versions and passes all required parameters
  const onFileSelect = async (node: AccTreeNode) => {
    console.log('=== FILE SELECTED ===', node);
    console.log('node.type:', node.type);
    console.log('node.tipVersionUrn:', node.tipVersionUrn);

    if (node.type !== 'item' || !node.tipVersionUrn) {
      console.log('Skipping - not an item or no tipVersionUrn');
      return;
    }

    if (!selectedProject) {
      console.error('No project selected');
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all versions for this item
      console.log('Fetching versions for item:', node.id);
      const versions = await getItemVersions(selectedProject, node.id);
      
      if (versions.length === 0) {
        alert('No versions available for this model');
        return;
      }

      console.log('Found versions:', versions.length, 'versions');

      // Get the latest version (first in array)
      const latestVersion = versions[0];
      
      // Load model with ALL required parameters for version selector
      console.log('Loading model with version support:', {
        urn: latestVersion.derivativeUrnBase64,
        name: latestVersion.name,
        projectId: selectedProject,
        itemId: node.id,
        versionId: latestVersion.versionUrn,
        versionNumber: latestVersion.versionNumber
      });

      loadModel(
        latestVersion.derivativeUrnBase64,  // URN for viewer
        latestVersion.name,                  // Display name
        selectedProject,                     // ✅ Project ID - enables version selector
        node.id,                             // ✅ Item ID - enables version selector
        latestVersion.versionUrn             // ✅ Version URN - tracks current version
      );
    } catch (error) {
      console.error('Error loading model versions:', error);
      alert('Failed to load model: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = (areaId: string) => {
    selectArea(areaId || null);
  };

  const handlePhaseChange = (phaseId: string) => {
    selectPhase(phaseId || null);
  };

  const handleResetHierarchy = () => {
    selectArea(null);
    selectPhase(null);
    resetView();
  };

  return (
    <div className="card card-flush mb-5">
      <div className="card-body">
        {/* Row 1: ACC Navigation */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <label className="form-label fw-bold mb-3">
              <i className="fa-solid fa-cloud me-2"></i>
              ACC Project Selection
            </label>
            <div className="d-flex gap-3 align-items-center flex-wrap">
              {/* Hub Select */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-gray-600 fs-7">Portfolio:</span>
                <select
                  className="form-select form-select-sm"
                  value={selectedHub}
                  onChange={(e) => onHubChange(e.target.value)}
                  style={{ minWidth: '180px' }}
                >
                  <option value="">Select Hub</option>
                  {hubs.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-gray-400">
                <i className="fa-solid fa-chevron-right"></i>
              </span>

              {/* Project Select */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-gray-600 fs-7">Project:</span>
                <select
                  className="form-select form-select-sm"
                  value={selectedProject}
                  onChange={(e) => onProjectChange(e.target.value)}
                  disabled={!selectedHub}
                  style={{ minWidth: '200px' }}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {loading && (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>

            {error && (
              <div className="text-danger mt-2 fs-7">{error}</div>
            )}
          </div>
        </div>

        {/* Row 2: Model Navigation (Area/Phase) + Search */}
        {state.currentUrn && (
          <div className="row g-4">
            {/* Area & Phase Navigation */}
            <div className="col-lg-7">
              <label className="form-label fw-bold mb-3">
                <i className="fa-solid fa-layer-group me-2"></i>
                Model Navigation
                {(hierarchySelection.area || hierarchySelection.phase) && (
                  <button
                    className="btn btn-light-danger btn-sm ms-3 py-1 px-3"
                    onClick={handleResetHierarchy}
                  >
                    <i className="fa-solid fa-times me-1"></i>
                    Reset
                  </button>
                )}
              </label>
              <div className="d-flex gap-3 align-items-center flex-wrap">
                {/* Area/Zone Select */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-gray-600 fs-7">Area:</span>
                  <select
                    className="form-select form-select-sm"
                    value={hierarchySelection.area || ''}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    style={{ minWidth: '180px' }}
                    disabled={areas.length === 0}
                  >
                    <option value="">All Areas</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} ({area.dbIds.length})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-400">
                  <i className="fa-solid fa-chevron-right"></i>
                </span>

                {/* Phase Select */}
                <div className="d-flex align-items-center gap-2">
                  <span className="text-gray-600 fs-7">Phase:</span>
                  <select
                    className="form-select form-select-sm"
                    value={hierarchySelection.phase || ''}
                    onChange={(e) => handlePhaseChange(e.target.value)}
                    style={{ minWidth: '180px' }}
                    disabled={phases.length === 0}
                  >
                    <option value="">All Phases</option>
                    {phases.map((phase) => (
                      <option key={phase.id} value={phase.id}>
                        {phase.name} ({phase.dbIds.length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info badge */}
                {areas.length === 0 && phases.length === 0 && (
                  <span className="badge badge-light-warning fs-8">
                    <i className="fa-solid fa-info-circle me-1"></i>
                    No area/phase data in model
                  </span>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="col-lg-5">
              <label className="form-label fw-bold mb-3">
                <i className="fa-solid fa-magnifying-glass me-2"></i>
                Element Search
              </label>
              <SearchBar />
            </div>
          </div>
        )}

        {/* Project Tree */}
        {tree && tree.children && tree.children.length > 0 && (
          <div className="mt-5">
            <label className="form-label fw-bold mb-3">
              <i className="fa-solid fa-folder-tree me-2"></i>
              Project Files (3D Models Only)
            </label>
            <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <TreeView node={tree} onSelect={onFileSelect} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tree View Component
interface TreeViewProps {
  node: AccTreeNode;
  level?: number;
  onSelect: (node: AccTreeNode) => void;
}

function TreeView({ node, level = 0, onSelect }: TreeViewProps) {
  const [expanded, setExpanded] = useState(level < 2);

  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';
  const isFile = node.type === 'item';

  // Skip root node display
  if (node.id === 'root') {
    return (
      <>
        {node.children?.map((child) => (
          <TreeView key={child.id} node={child} level={0} onSelect={onSelect} />
        ))}
      </>
    );
  }

  return (
    <div style={{ paddingLeft: level * 16 }}>
      <div
        className={`d-flex align-items-center py-1 px-2 rounded cursor-pointer ${
          isFile ? 'hover-bg-light-primary' : ''
        }`}
        onClick={() => {
          if (isFolder && hasChildren) {
            setExpanded(!expanded);
          } else if (isFile) {
            onSelect(node);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* Expand icon */}
        {hasChildren && (
          <i
            className={`fa-solid fa-chevron-${expanded ? 'down' : 'right'} me-2 text-gray-500`}
            style={{ width: '12px', fontSize: '10px' }}
          />
        )}
        {!hasChildren && <span style={{ width: '20px' }} />}

        {/* Icon */}
        <i
          className={`me-2 ${
            isFolder ? 'fa-solid fa-folder text-warning' : 'fa-solid fa-cube text-primary'
          }`}
        />

        {/* Name */}
        <span className={`fs-7 ${isFile ? 'fw-semibold text-gray-800' : 'text-gray-700'}`}>
          {node.name}
        </span>

        {/* File type badge */}
        {isFile && node.fileType && (
          <span className="badge badge-light-primary ms-2 fs-8">{node.fileType}</span>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeView key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}