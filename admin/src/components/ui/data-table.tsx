import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type ColumnDef<T> = {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (props: { row: T }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string | null
    direction: "asc" | "desc" | null
  }>({ key: null, direction: null })

  const [filters, setFilters] = React.useState<Record<string, string>>({})

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" }
        if (prev.direction === "desc") return { key: null, direction: null }
        return { key, direction: "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ChevronsUpDown className="w-4 h-4 opacity-50" />
    if (sortConfig.direction === "asc") return <ChevronUp className="w-4 h-4" />
    if (sortConfig.direction === "desc") return <ChevronDown className="w-4 h-4" />
    return <ChevronsUpDown className="w-4 h-4 opacity-50" />
  }

  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data]

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        )
      }
    })

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, filters, sortConfig])

  return (
    <div className={cn("w-full", className)}>
      {/* Filter Row */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {columns
          .filter((col) => col.filterable)
          .map((col) => (
            <input
              key={col.id}
              type="text"
              placeholder={`Filter by ${col.header}...`}
              value={filters[col.id] || ""}
              onChange={(e) => handleFilter(col.id, e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium",
                    col.sortable && "cursor-pointer hover:bg-muted/80"
                  )}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && getSortIcon(col.id)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-t hover:bg-muted/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.id} className="px-4 py-3 text-sm">
                      {col.cell
                        ? col.cell({ row })
                        : String(row[col.accessorKey!] || "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredAndSortedData.length} of {data.length} entries
      </div>
    </div>
  )
}
