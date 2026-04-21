import React, { useMemo, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { MaterialCard } from '../components/MaterialCard'
import {
  mockMaterials,
  materialTypes,
  materialCategories,
  materialUnits,
  MaterialType,
  MaterialCategory,
} from '../data/mockData'
import { SearchIcon } from 'lucide-react'
export function Materials() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All types')
  const [selectedUnit, setSelectedUnit] = useState<string>('All units')
  const [selectedCategory, setSelectedCategory] =
    useState<MaterialCategory>('All materials')
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

        <main className="flex-1 overflow-hidden flex">
          {/* Left Filter Sidebar */}
          <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-6 hidden lg:block">
            {/* Categories */}
            <div className="mb-8">
              <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <nav className="space-y-0.5">
                {materialCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center px-6 py-2 text-sm transition-colors text-left ${selectedCategory === cat ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedCategory === cat ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></span>
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            {/* Material Type */}
            <div className="mb-8">
              <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Type
              </h3>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setSelectedType('All types')}
                  className={`w-full flex items-center px-6 py-2 text-sm transition-colors text-left ${selectedType === 'All types' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedType === 'All types' ? 'bg-blue-600' : 'bg-gray-300'}`}
                  ></span>
                  All types
                </button>
                {materialTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full flex items-center px-6 py-2 text-sm transition-colors text-left ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedType === type ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></span>
                    {type}
                  </button>
                ))}
              </nav>
            </div>

            {/* Unit */}
            <div>
              <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Unit
              </h3>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setSelectedUnit('All units')}
                  className={`w-full flex items-center px-6 py-2 text-sm transition-colors text-left ${selectedUnit === 'All units' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedUnit === 'All units' ? 'bg-blue-600' : 'bg-gray-300'}`}
                  ></span>
                  All units
                </button>
                {materialUnits.map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    className={`w-full flex items-center px-6 py-2 text-sm transition-colors text-left ${selectedUnit === unit ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedUnit === unit ? 'bg-blue-600' : 'bg-gray-300'}`}
                    ></span>
                    {unit}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {/* Search & Filters Row */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[240px]">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials by title, type, unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                />
              </div>

              {/* Mobile-visible dropdowns for type and unit */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 lg:block"
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
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 lg:block"
              >
                <option value="All units">All units</option>
                {materialUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              {filteredMaterials.length} material
              {filteredMaterials.length !== 1 ? 's' : ''} found
            </p>

            {/* Cards Grid */}
            {filteredMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No materials found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
