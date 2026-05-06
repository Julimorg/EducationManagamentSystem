import React, { useState, useMemo } from 'react'
import { Search, LayoutGrid, List } from 'lucide-react'
import { MaterialCard } from './Components/MaterialCard'
import { MaterialListItem } from './Components/MaterialListItem'
import { MaterialCategory, mockMaterials, materialCategories, materialTypes, materialUnits } from './MaterialData'

export function MaterialsPage() {
  const [query, setQuery]               = useState('')
  const [selectedCategory, setCategory] = useState<MaterialCategory>('All materials')
  const [selectedType, setType]         = useState<string>('All types')
  const [selectedUnit, setUnit]         = useState<string>('All units')
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() =>
    mockMaterials.filter((m) => {
      const matchSearch =
        query === '' ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.materialType.toLowerCase().includes(query.toLowerCase())
      const matchCat  = selectedCategory === 'All materials' || m.category === selectedCategory
      const matchType = selectedType     === 'All types'     || m.materialType === selectedType
      const matchUnit = selectedUnit     === 'All units'     || m.unit === selectedUnit
      return matchSearch && matchCat && matchType && matchUnit
    }),
    [query, selectedCategory, selectedType, selectedUnit],
  )

  return (
    <div className="max-w-7xl mx-auto space-y-4">

      {/* ── Filter bar ── */}
      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials by title, type..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <Select
            value={selectedCategory}
            onChange={(v) => setCategory(v as MaterialCategory)}
            options={materialCategories}
          />
          <Select
            value={selectedType}
            onChange={setType}
            options={['All types', ...materialTypes]}
          />
          <Select
            value={selectedUnit}
            onChange={setUnit}
            options={['All units', ...materialUnits]}
          />
        </div>
      </div>

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {filtered.length} material{filtered.length !== 1 ? 's' : ''} found
        </p>

        <div className="flex items-center bg-gray-200/60 p-1 rounded-lg gap-1">
          <ViewBtn
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </ViewBtn>
          <ViewBtn
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </ViewBtn>
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => <MaterialCard key={m.id} material={m} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((m) => <MaterialListItem key={m.id} material={m} />)}
        </div>
      )}
    </div>
  )
}

// ─── Helper components ────────────────────────────────────
function Select({
  value,
  onChange,
  options,
}: {
  value:    string
  onChange: (v: string) => void
  options:  string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 sm:flex-none px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700
                 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function ViewBtn({
  active,
  onClick,
  children,
  ...rest
}: {
  active:   boolean
  onClick:  () => void
  children: React.ReactNode
  [k: string]: any
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all ${
        active ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
      }`}
      {...rest}
    >
      {children}
    </button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 mb-1">No materials found</h3>
      <p className="text-xs text-gray-400 max-w-xs">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  )
}