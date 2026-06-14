import { useState, useEffect, useCallback } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Search, X, Filter, Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

// Filter Types
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterState {
  [key: string]: any;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
}

// Advanced Filter Component
interface AdvancedFilterProps {
  filters: FilterConfig[];
  onFilterChange: (filters: FilterState) => void;
  onReset?: () => void;
  presets?: FilterPreset[];
  onSavePreset?: (name: string, filters: FilterState) => void;
  onLoadPreset?: (presetId: string) => void;
  className?: string;
  showPresets?: boolean;
  showSave?: boolean;
  collapsible?: boolean;
}

export function AdvancedFilter({
  filters,
  onFilterChange,
  onReset,
  presets = [],
  onSavePreset,
  onLoadPreset,
  className = '',
  showPresets = true,
  showSave = true,
  collapsible = true,
}: AdvancedFilterProps) {
  const [filterState, setFilterState] = useState<FilterState>({});
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Initialize filter state with default values
  useEffect(() => {
    const initialState: FilterState = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initialState[filter.id] = filter.defaultValue;
      }
    });
    setFilterState(initialState);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterId: string, value: any) => {
      const newState = { ...filterState, [filterId]: value };
      setFilterState(newState);
      onFilterChange(newState);
    },
    [filterState, onFilterChange]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    const initialState: FilterState = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initialState[filter.id] = filter.defaultValue;
      }
    });
    setFilterState(initialState);
    setActivePreset(null);
    onFilterChange(initialState);
    onReset?.();
  }, [filters, onFilterChange, onReset]);

  // Handle save preset
  const handleSavePreset = useCallback(() => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim(), filterState);
      setPresetName('');
      setShowSaveModal(false);
    }
  }, [presetName, filterState, onSavePreset]);

  // Handle load preset
  const handleLoadPreset = useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setFilterState(preset.filters);
        setActivePreset(presetId);
        onFilterChange(preset.filters);
        onLoadPreset?.(presetId);
      }
    },
    [presets, onFilterChange, onLoadPreset]
  );

  // Get active filter count
  const activeFilterCount = Object.values(filterState).filter(
    (value) => value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-recruiter-primary-light" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge className="bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {collapsible && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Presets */}
      {showPresets && presets.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleLoadPreset(preset.id)}
                className={
                  activePreset === preset.id
                    ? 'bg-recruiter-primary hover:bg-recruiter-primary-light text-white'
                    : 'border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary'
                }
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <FilterField
                key={filter.id}
                config={filter}
                value={filterState[filter.id]}
                onChange={(value) => handleFilterChange(filter.id, value)}
              />
            ))}
          </div>

          {/* Save Preset */}
          {showSave && onSavePreset && (
            <div className="flex items-center gap-2 pt-4 border-t border-recruiter-background-tertiary">
              {showSaveModal ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="text"
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
                  />
                  <Button
                    size="sm"
                    onClick={handleSavePreset}
                    className="bg-recruiter-primary hover:bg-recruiter-primary-light text-white"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowSaveModal(false);
                      setPresetName('');
                    }}
                    className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveModal(true)}
                  className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Preset
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// Filter Field Component
interface FilterFieldProps {
  config: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}

function FilterField({ config, value, onChange }: FilterFieldProps) {
  const handleClear = () => {
    onChange(config.defaultValue !== undefined ? config.defaultValue : '');
  };

  const renderField = () => {
    switch (config.type) {
      case 'text':
        return (
          <div className="relative">
            <Input
              type="text"
              placeholder={config.placeholder || `Search ${config.label}...`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
            />
            {value && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-recruiter-primary-light hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          >
            <option value="">All {config.label}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {config.options?.map((option) => (
                <Badge
                  key={option.value}
                  className={
                    Array.isArray(value) && value.includes(option.value)
                      ? 'bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30 cursor-pointer'
                      : 'bg-recruiter-background-tertiary text-recruiter-primary-light border-recruiter-background-tertiary cursor-pointer hover:bg-recruiter-background-tertiary/80'
                  }
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : [];
                    const newValue = currentValue.includes(option.value)
                      ? currentValue.filter((v) => v !== option.value)
                      : [...currentValue, option.value];
                    onChange(newValue);
                  }}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          />
        );

      case 'daterange':
        return (
          <div className="flex gap-2">
            <Input
              type="date"
              value={value?.start || ''}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              placeholder="Start date"
            />
            <Input
              type="date"
              value={value?.end || ''}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
              placeholder="End date"
            />
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={config.placeholder || `Enter ${config.label}...`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          />
        );

      case 'boolean':
        return (
          <Select
            value={value !== undefined ? String(value) : ''}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-recruiter-primary-light mb-2">
        {config.label}
      </label>
      {renderField()}
    </div>
  );
}

// Debounced Search Component
interface DebouncedSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

export function DebouncedSearch({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className = '',
}: DebouncedSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-recruiter-primary-light" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-recruiter-background-tertiary border-recruiter-background-tertiary text-white placeholder-recruiter-primary-light"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-recruiter-primary-light hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Active Filters Display Component
interface ActiveFiltersProps {
  filters: FilterState;
  filterConfigs: FilterConfig[];
  onClearFilter: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilters({
  filters,
  filterConfigs,
  onClearFilter,
  onClearAll,
  className = '',
}: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters).filter(
    ([_key, value]) => value !== undefined && value !== '' && value !== null
  );

  if (activeFilters.length === 0) {
    return null;
  }

  const getFilterLabel = (filterId: string, value: any): string => {
    const config = filterConfigs.find((f) => f.id === filterId);
    if (!config) return '';

    switch (config.type) {
      case 'select':
        const option = config.options?.find((o) => o.value === value);
        return option ? option.label : value;
      case 'multiselect':
        if (Array.isArray(value)) {
          const labels = value
            .map((v) => config.options?.find((o) => o.value === v)?.label || v)
            .join(', ');
          return labels;
        }
        return value;
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {activeFilters.map(([filterId, value]) => {
        const config = filterConfigs.find((f) => f.id === filterId);
        return (
          <Badge
            key={filterId}
            className="bg-recruiter-primary/20 text-recruiter-primary border-recruiter-primary/30 flex items-center gap-2"
          >
            <span>{config?.label}: {getFilterLabel(filterId, value)}</span>
            <button
              onClick={() => onClearFilter(filterId)}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="border-recruiter-background-tertiary text-recruiter-primary-light hover:text-white hover:bg-recruiter-background-tertiary"
      >
        Clear All
      </Button>
    </div>
  );
}

// Filter Persistence Hook
export function useFilterPersistence(
  key: string,
  defaultFilters: FilterState
): [FilterState, (filters: FilterState) => void] {
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultFilters;
    }
    return defaultFilters;
  });

  const setFiltersWithPersistence = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newFilters));
      }
    },
    [key]
  );

  return [filters, setFiltersWithPersistence];
}