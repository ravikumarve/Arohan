import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FilterOption {
  id: string
  label: string
  type: "text" | "select" | "date" | "number"
  value?: string
  options?: { value: string; label: string }[]
}

interface FilterPanelProps {
  filters: FilterOption[]
  onFilterChange: (filterId: string, value: string) => void
  onClearAll: () => void
  onApply: () => void
  className?: string
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearAll,
  onApply,
  className,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = React.useState<
    Record<string, string>
  >(
    filters.reduce((acc, filter) => {
      if (filter.value) acc[filter.id] = filter.value
      return acc
    }, {} as Record<string, string>)
  )

  const handleFilterChange = (filterId: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const handleApply = () => {
    Object.entries(localFilters).forEach(([filterId, value]) => {
      onFilterChange(filterId, value)
    })
    onApply()
  }

  const handleClearAll = () => {
    setLocalFilters({})
    onClearAll()
  }

  const hasActiveFilters = Object.keys(localFilters).length > 0

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            {filter.type === "text" && (
              <Input
                placeholder={`Enter ${filter.label.toLowerCase()}...`}
                value={localFilters[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              />
            )}
            {filter.type === "number" && (
              <Input
                type="number"
                placeholder={`Enter ${filter.label.toLowerCase()}...`}
                value={localFilters[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              />
            )}
            {filter.type === "date" && (
              <Input
                type="date"
                value={localFilters[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              />
            )}
            {filter.type === "select" && (
              <select
                value={localFilters[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select {filter.label.toLowerCase()}...</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearAll}>
          Reset
        </Button>
      </div>
    </div>
  )
}
