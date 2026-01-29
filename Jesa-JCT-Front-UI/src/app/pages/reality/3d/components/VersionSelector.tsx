/**
 * Version Selector Component - ALIGNED VERSION
 */

import { useState, useEffect } from 'react';

interface AccVersion {
  versionUrn: string;
  versionNumber: number;
  name: string;
  fileType: string;
  derivativeUrnBase64: string;
}

interface VersionSelectorProps {
  projectId: string | null;
  itemId: string | null;
  currentVersionId: string | null;
  onVersionSelect: (version: AccVersion) => void;
  isLoading?: boolean;
}

export function VersionSelector({
  projectId,
  itemId,
  currentVersionId,
  onVersionSelect,
  isLoading = false,
}: VersionSelectorProps) {
  const [versions, setVersions] = useState<AccVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!projectId || !itemId) {
      setVersions([]);
      return;
    }

    const fetchVersions = async () => {
      setLoadingVersions(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/acc/projects/${projectId}/items/${encodeURIComponent(itemId)}/versions`
        );
        if (!response.ok) throw new Error('Failed to load versions');
        const data: AccVersion[] = await response.json();
        
        const sortedVersions = data.sort((a, b) => b.versionNumber - a.versionNumber);
        setVersions(sortedVersions);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load versions');
      } finally {
        setLoadingVersions(false);
      }
    };

    fetchVersions();
  }, [projectId, itemId]);

  const currentVersion = versions.find((v) => v.versionUrn === currentVersionId);
  const hasMultipleVersions = versions.length > 1;

  if (!projectId || !itemId) {
    return null;
  }

  return (
    <div className="position-relative">
      <button
        className={`btn btn-sm ${hasMultipleVersions ? 'btn-light-primary' : 'btn-light'} d-flex align-items-center gap-2`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loadingVersions || isLoading || !hasMultipleVersions}
        title={hasMultipleVersions ? `Switch version (${versions.length - 1} older available)` : 'Only one version available'}
      >
        <i className="fa-solid fa-code-branch"></i>
        <span className="fw-semibold">
          {loadingVersions ? (
            'Loading...'
          ) : currentVersion ? (
            `v${currentVersion.versionNumber}`
          ) : versions.length > 0 ? (
            `v${versions[0].versionNumber}`
          ) : (
            'No versions'
          )}
        </span>
        {hasMultipleVersions && (
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} fs-8`}></i>
        )}
      </button>

      {isOpen && hasMultipleVersions && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1049 }}
            onClick={() => setIsOpen(false)}
          />

          <div
            className="card position-absolute mt-2 shadow-lg"
            style={{
              zIndex: 1050,
              minWidth: '350px',
              maxHeight: '400px',
              overflow: 'auto',
              right: 0,
            }}
          >
            <div className="card-header py-3">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-clock-rotate-left me-2 text-primary"></i>
                Version History
              </h5>
              <p className="text-gray-600 fs-7 mb-0 mt-1">
                {versions.length} version{versions.length !== 1 ? 's' : ''} available
                {hasMultipleVersions && (
                  <span className="text-primary ms-2">
                    • {versions.length - 1} older
                  </span>
                )}
              </p>
            </div>

            <div className="card-body p-0">
              {error && (
                <div className="alert alert-danger m-3">
                  <i className="fa-solid fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <div className="list-group list-group-flush">
                {versions.map((version) => {
                  const isCurrent = version.versionUrn === currentVersionId;
                  const isLatest = version.versionNumber === versions[0].versionNumber;

                  return (
                    <button
                      key={version.versionUrn}
                      className={`list-group-item list-group-item-action ${
                        isCurrent ? 'active' : ''
                      }`}
                      onClick={() => {
                        onVersionSelect(version);
                        setIsOpen(false);
                      }}
                      disabled={isCurrent}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge badge-light-primary fw-bold">
                              v{version.versionNumber}
                            </span>
                            {isLatest && (
                              <span className="badge badge-success">
                                <i className="fa-solid fa-star fs-8 me-1"></i>
                                Latest
                              </span>
                            )}
                            {isCurrent && (
                              <span className="badge badge-primary">
                                <i className="fa-solid fa-check fs-8 me-1"></i>
                                Current
                              </span>
                            )}
                          </div>
                          <p className="mb-1 text-gray-800 fw-semibold fs-7">
                            {version.name}
                          </p>
                          <div className="text-gray-600 fs-8">
                            <i className="fa-solid fa-file me-1"></i>
                            {version.fileType.toUpperCase()} file
                          </div>
                        </div>
                        {!isCurrent && (
                          <div>
                            <i className="fa-solid fa-arrow-right text-primary"></i>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}