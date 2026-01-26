/**
 * Properties Panel
 * Shows selected element properties from the 3D model
 */

import { useViewer } from '../contexts/ViewerContext';

export function PropertiesPanel() {
  const { state, isolateElement, resetView } = useViewer();
  const { selectedElement } = state;

  // Group properties by category
  const groupedProperties = selectedElement?.properties.reduce((acc, prop) => {
    const category = prop.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(prop);
    return acc;
  }, {} as Record<string, typeof selectedElement.properties>) || {};

  return (
    <div className="card card-flush h-100">
      <div className="card-header">
        <h3 className="card-title">
          <i className="fa-solid fa-list me-2"></i>
          Properties
        </h3>
      </div>
      <div className="card-body">
        {!selectedElement ? (
          <EmptyState />
        ) : (
          <ElementDetails
            element={selectedElement}
            groupedProperties={groupedProperties}
            onIsolate={() => isolateElement(selectedElement.dbId)}
            onReset={resetView}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-gray-500 py-10">
      <i className="fa-solid fa-mouse-pointer fs-3x mb-5 opacity-25"></i>
      <p className="mb-0">Select an element to view its properties</p>
    </div>
  );
}

import type { ElementProperty } from '../../types';

interface ElementDetailsProps {
  element: NonNullable<ReturnType<typeof useViewer>['state']['selectedElement']>;
  groupedProperties: Record<string, ElementProperty[]>;
  onIsolate: () => void;
  onReset: () => void;
}

function ElementDetails({ element, groupedProperties, onIsolate, onReset }: ElementDetailsProps) {
  // Copy all properties to clipboard as formatted text
  const handleCopyProperties = () => {
    const lines: string[] = [
      `Element: ${element.name}`,
      `Type: ${element.type}`,
      `ID: ${element.dbId}`,
      '',
    ];

    Object.entries(groupedProperties).forEach(([category, props]) => {
      lines.push(`--- ${category} ---`);
      props.forEach((prop) => {
        lines.push(`${prop.label}: ${prop.value}`);
      });
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      alert('Properties copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  // Export properties as JSON file
  const handleExportData = () => {
    const data = {
      element: {
        name: element.name,
        type: element.type,
        dbId: element.dbId,
        status: element.status,
      },
      properties: groupedProperties,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `element_${element.dbId}_properties.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      {/* Element Header */}
      <div className="d-flex align-items-center mb-5">
        <div className="symbol symbol-50px me-3">
          <span className="symbol-label bg-light-primary">
            <i className="fa-solid fa-cube fs-2x text-primary"></i>
          </span>
        </div>
        <div>
          <div className="fw-bold fs-5 text-gray-900">{element.name}</div>
          <div className="text-gray-600 fs-7">{element.type}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 mb-5">
        <button
          className="btn btn-sm btn-light-primary flex-grow-1"
          onClick={onIsolate}
        >
          <i className="fa-solid fa-eye me-2"></i>
          Isolate
        </button>
        <button
          className="btn btn-sm btn-light-secondary flex-grow-1"
          onClick={onReset}
        >
          <i className="fa-solid fa-rotate me-2"></i>
          Reset
        </button>
      </div>

      <div className="separator mb-5"></div>

      {/* Quick Info */}
      <div className="mb-5">
        <PropertyItem label="Element ID" value={element.dbId.toString()} />
        {element.status && (
          <PropertyItem
            label="Status"
            value={
              <StatusBadge status={element.status} />
            }
          />
        )}
      </div>

      {/* Properties by Category */}
      <div
        className="scroll-y"
        style={{ maxHeight: 'calc(100vh - 500px)', overflowY: 'auto' }}
      >
        {Object.entries(groupedProperties).map(([category, props]) => (
          <PropertyCategory key={category} name={category} properties={props} />
        ))}
      </div>

      {/* Export Buttons */}
      <div className="mt-5">
        <button className="btn btn-sm btn-light-primary w-100 mb-2" onClick={handleCopyProperties}>
          <i className="fa-solid fa-copy me-2"></i>
          Copy Properties
        </button>
        <button className="btn btn-sm btn-light-primary w-100" onClick={handleExportData}>
          <i className="fa-solid fa-download me-2"></i>
          Export Data
        </button>
      </div>
    </div>
  );
}

interface PropertyItemProps {
  label: string;
  value: React.ReactNode;
}

function PropertyItem({ label, value }: PropertyItemProps) {
  return (
    <div className="py-2 border-bottom border-gray-200">
      <div className="fs-7 text-gray-600 mb-1">{label}</div>
      <div className="fs-6 fw-semibold text-gray-900">
        {typeof value === 'string' || typeof value === 'number' ? value : value}
      </div>
    </div>
  );
}

interface PropertyCategoryProps {
  name: string;
  properties: Array<{ label: string; value: string | number }>;
}

function PropertyCategory({ name, properties }: PropertyCategoryProps) {
  return (
    <div className="mb-4">
      <div className="fs-7 fw-bold text-gray-500 text-uppercase mb-2">{name}</div>
      {properties.map((prop, idx) => (
        <PropertyItem key={idx} label={prop.label} value={String(prop.value)} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; class: string }> = {
    design: { label: 'Under Design', class: 'badge-light-primary' },
    issued: { label: 'IFC Issued', class: 'badge-light-success' },
    construction: { label: 'Under Construction', class: 'badge-light-warning' },
    waiting: { label: 'Waiting Material', class: 'badge-light-danger' },
  };

  const config = statusConfig[status] || { label: status, class: 'badge-light-secondary' };

  return <span className={`badge ${config.class}`}>{config.label}</span>;
}
