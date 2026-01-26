import React, { useState, useRef, useEffect } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterDropdownProps {
  id: string;
  icon: string;
  label: string;
  options: FilterOption[];
  type: 'checkbox' | 'select';
  selectedValues?: string[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  onCheckboxChange?: (values: string[]) => void;
  showCount?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  id,
  icon,
  label,
  options,
  type,
  selectedValues = [],
  selectedValue,
  onSelect,
  onCheckboxChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showCount = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCheckboxChange = (value: string) => {
    if (onCheckboxChange) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onCheckboxChange(newValues);
    }
  };

  const handleSelectClick = (value: string) => {
    if (onSelect) {
      onSelect(value);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (type === 'checkbox') {
      return selectedValues.length;
    } else {
      const selected = options.find(o => o.value === selectedValue);
      return selected?.label || 'All';
    }
  };

  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`} id={id} ref={dropdownRef}>
      <button
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fa-solid ${icon}`}></i>
        <span>{label}</span>
        {type === 'checkbox' ? (
          <span className="dropdown-count">{getDisplayValue()}</span>
        ) : (
          <span className="dropdown-value">{getDisplayValue()}</span>
        )}
        <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
      </button>
      <div className="dropdown-menu">
        {type === 'checkbox' ? (
          options.map(option => (
            <label key={option.value} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
              <span className="checkbox-custom"></span>
              <span className="item-label">{option.label}</span>
              {option.count !== undefined && (
                <span className="item-count">{option.count}</span>
              )}
            </label>
          ))
        ) : (
          options.map(option => (
            <button
              key={option.value}
              className={`dropdown-item ${selectedValue === option.value ? 'active' : ''}`}
              onClick={() => handleSelectClick(option.value)}
            >
              <i className={`fa-solid ${option.value === 'all' ? 'fa-layer-group' : 'fa-folder'}`}></i>
              <span className="item-label">{option.label}</span>
              {option.count !== undefined && (
                <span className="item-count">{option.count}</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
