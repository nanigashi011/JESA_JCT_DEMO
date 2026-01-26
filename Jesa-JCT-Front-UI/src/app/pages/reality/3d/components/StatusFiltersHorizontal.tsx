/**
 * Status Filters - Horizontal Layout (IMPROVED)
 * Keeps filters on the right side, even in fullscreen
 */

import { useViewer } from '../contexts/ViewerContext';
import type { StatusFilter } from '../types';

export function StatusFiltersHorizontal() {
  const { state, toggleStatusFilter } = useViewer();

  return (
    <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
      {/* Left Side: Filter Label + Chips */}
      <div className="d-flex align-items-center gap-2 flex-wrap flex-grow-1">
        <span className="fs-7 fw-semibold text-gray-600 me-2">
          <i className="fa-solid fa-filter me-1"></i>
          Status:
        </span>

        {state.statusFilters.map((filter) => (
          <FilterChip
            key={filter.status}
            filter={filter}
            onToggle={() => toggleStatusFilter(filter.status)}
          />
        ))}
      </div>

      {/* Right Side: Statistics - Always stays on right */}
      <div className="d-flex align-items-center gap-3" style={{ minWidth: '200px' }}>
        <div style={{ width: '1px', height: '24px', background: '#e4e6ef' }} />
        <StatBadge
          icon="fa-layer-group"
          label="Total"
          value={state.stats.total}
          color="gray"
        />
        <StatBadge
          icon="fa-eye"
          label="Displayed"
          value={state.stats.displayed}
          color="primary"
        />
      </div>
    </div>
  );
}

interface FilterChipProps {
  filter: StatusFilter;
  onToggle: () => void;
}

function FilterChip({ filter, onToggle }: FilterChipProps) {
  return (
    <button
      className={`btn btn-sm d-flex align-items-center gap-2 transition-all ${
        filter.active
          ? 'btn-light-primary border border-primary'
          : 'btn-light border border-gray-300'
      }`}
      onClick={onToggle}
      style={{
        padding: '6px 12px',
        borderRadius: '20px',
        transition: 'all 0.2s ease',
        fontSize: '0.875rem',
        whiteSpace: 'nowrap', // Prevent text wrapping
      }}
    >
      {/* Color dot */}
      <span
        className="rounded-circle"
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: filter.color,
          flexShrink: 0,
          border: '2px solid white',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        }}
      />

      {/* Label */}
      <span className="fw-semibold">{filter.label}</span>

      {/* Count badge */}
      <span
        className={`badge ${
          filter.active ? 'badge-primary' : 'badge-secondary'
        }`}
        style={{ fontSize: '0.75rem', padding: '2px 6px' }}
      >
        {filter.count}
      </span>

      {/* Active indicator */}
      {filter.active && (
        <i className="fa-solid fa-check text-primary" style={{ fontSize: '10px' }}></i>
      )}
    </button>
  );
}

interface StatBadgeProps {
  icon: string;
  label: string;
  value: number;
  color: 'gray' | 'primary';
}

function StatBadge({ icon, label, value, color }: StatBadgeProps) {
  const colorClass = color === 'primary' ? 'text-primary' : 'text-gray-600';
  const bgClass = color === 'primary' ? 'bg-light-primary' : 'bg-light';

  return (
    <div
      className={`d-flex align-items-center gap-2 px-3 py-2 rounded ${bgClass}`}
      style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}
    >
      <i className={`fa-solid ${icon} ${colorClass}`}></i>
      <span className="text-gray-600 d-none d-lg-inline">{label}:</span>
      <span className={`fw-bold ${colorClass}`}>{value}</span>
    </div>
  );
}