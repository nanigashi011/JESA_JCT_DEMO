import React from 'react';

interface NavTab {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

interface ActionBarProps {
  tabs: NavTab[];
  onTabClick: (tabId: string) => void;
  children?: React.ReactNode;
}

export const ActionBar: React.FC<ActionBarProps> = ({ tabs, onTabClick, children }) => {
  return (
    <aside className="action-bar">
      <nav className="nav-tabs">
        {tabs.map(tab => (
          <a
            key={tab.id}
            href="#"
            className={`nav-tab ${tab.active ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onTabClick(tab.id);
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </a>
        ))}
      </nav>

      <div className="filter-dropdowns">
        {children}
      </div>
    </aside>
  );
};
