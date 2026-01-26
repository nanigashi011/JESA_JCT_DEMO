/**
 * Status Filters Panel
 * Filter elements by construction status with color coding
 */

import { useViewer } from '../contexts/ViewerContext';
import type { StatusFilter } from '../types';

export function StatusFilters() {
  const { state, toggleStatusFilter } = useViewer();

  return (
    <div className="card card-flush h-100">
      <div className="card-header">
        <h3 className="card-title">
          <i className="fa-solid fa-filter me-2"></i>
          Filters & Legend
        </h3>
      </div>
      <div className="card-body">
        {/* Status Filters */}
        <div className="mb-8">
          <h4 className="fs-6 fw-bold mb-4">Filter by Status</h4>

          {state.statusFilters.map((filter) => (
            <StatusFilterCard
              key={filter.status}
              filter={filter}
              onToggle={() => toggleStatusFilter(filter.status)}
            />
          ))}
        </div>

        {/* Statistics */}
        <div>
          <h4 className="fs-6 fw-bold mb-4">Statistics</h4>
          <div className="row g-3">
            <div className="col-6">
              <div className="stat-mini-card text-center p-3 border rounded">
                <div className="fs-2x fw-bold text-gray-900">{state.stats.total}</div>
                <div className="fs-7 text-gray-600">Total Elements</div>
              </div>
            </div>
            <div className="col-6">
              <div className="stat-mini-card text-center p-3 border rounded">
                <div className="fs-2x fw-bold text-gray-900">{state.stats.displayed}</div>
                <div className="fs-7 text-gray-600">Displayed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusFilterCardProps {
  filter: StatusFilter;
  onToggle: () => void;
}

function StatusFilterCard({ filter, onToggle }: StatusFilterCardProps) {
  return (
    <div
      className={`d-flex align-items-center gap-3 p-3 mb-3 border rounded cursor-pointer transition-all ${
        filter.active ? 'border-primary bg-light-primary' : 'border-gray-300'
      }`}
      onClick={onToggle}
      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
    >
      {/* Color indicator */}
      <div
        className="rounded-circle"
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: filter.color,
          flexShrink: 0,
        }}
      />

      {/* Label and count */}
      <div className="flex-grow-1">
        <div className="fw-semibold text-gray-800">{filter.label}</div>
        <div className="fs-7 text-gray-600">{filter.count} elements</div>
      </div>

      {/* Check/X icon */}
      <i
        className={`fa-solid ${
          filter.active ? 'fa-check text-primary' : 'fa-xmark text-gray-400'
        }`}
      />
    </div>
  );
}

