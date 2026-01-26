import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  label: string;
  value: string | number;
  badge: {
    type: 'positive' | 'negative';
    value: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBgClass,
  label,
  value,
  badge
}) => {
  return (
    <div className="stat-card">
      <div className="symbol symbol-50px me-2">
        <span className={`symbol-label ${iconBgClass}`}>
          {icon}
        </span>
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <h2 className="stat-value">{value}</h2>
        <span className={`stat-badge ${badge.type}`}>
          <i className={`fa-solid fa-arrow-${badge.type === 'positive' ? 'up' : 'down'}`}></i> {badge.value}
        </span>
      </div>
    </div>
  );
};
