import React, { useMemo, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { MaterialCard } from '../components/MaterialCard'
import { MaterialListItem } from '../components/MaterialListItem'
import {
  mockMaterials,
  materialTypes,
  materialCategories,
  materialUnits,
  MaterialCategory,
} from '../data/mockData'
import { SearchIcon, LayoutGridIcon, ListIcon } from 'lucide-react'
export function Materials() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All types')
  const [selectedUnit, setSelectedUnit] = useState<string>('All units')
  const [selectedCategory, setSelectedCategory] =
    useState<MaterialCategory>('All materials')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.materialType.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType =
        selectedType === 'All types' || m.materialType === selectedType
      const matchesUnit =
        selectedUnit === 'All units' || m.unit === selectedUnit
      const matchesCategory =
        selectedCategory === 'All materials' || m.category === selectedCategory
      return matchesSearch && matchesType && matchesUnit && matchesCategory
    })
  }, [searchQuery, selectedType, selectedUnit, selectedCategory])
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title="Learning Materials"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Search & Filters Row */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials by title, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as MaterialCategory)
                  }
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                >
                  {materialCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                >
                  <option value="All types">All types</option>
                  {materialTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                >
                  <option value="All units">All units</option>
                  {materialUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count and View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredMaterials.length} material
                {filteredMaterials.length !== 1 ? 's' : ''} found
              </p>

              <div className="flex items-center bg-gray-200/60 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <LayoutGridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="List view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {filteredMaterials.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredMaterials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredMaterials.map((material) => (
                    <MaterialListItem key={material.id} material={material} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200 border-dashed mt-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No materials found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
