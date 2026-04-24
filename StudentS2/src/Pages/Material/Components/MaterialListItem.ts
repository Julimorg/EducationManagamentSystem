import React from 'react'
import { DownloadIcon } from 'lucide-react'
import { Material } from '../data/mockData'
import { getFileTypeBadge, getMaterialTypeBadge } from './MaterialCard'
type MaterialListItemProps = {
  material: Material
}
export function MaterialListItem({ material }: MaterialListItemProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow">
      {/* Icon */}
      <div
        className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-base font-bold ${material.iconColor}`}
      >
        {material.iconLetter}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {material.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getMaterialTypeBadge(material.materialType)}`}
          >
            {material.materialType}
          </span>
          <span className="text-sm text-gray-500">
            {material.category === 'All materials'
              ? 'General'
              : material.category}
          </span>
          <span className="text-sm text-gray-300">•</span>
          <span className="text-sm text-gray-500">{material.unit}</span>
        </div>
      </div>

      {/* Actions & Meta */}
      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        <span
          className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${getFileTypeBadge(material.fileType)}`}
        >
          {material.fileType} · {material.fileSize}
        </span>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
          <DownloadIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  )
}
