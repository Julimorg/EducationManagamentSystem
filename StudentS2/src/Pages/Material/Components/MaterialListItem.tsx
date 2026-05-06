import React from 'react'
import { Download } from 'lucide-react'
import type { Material } from '../data/mockData'
import { getFileTypeBadge, getMaterialTypeBadge } from './MaterialCard'

type Props = { material: Material }

export function MaterialListItem({ material }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-shadow">

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${material.iconColor}`}>
        {material.iconLetter}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {material.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getMaterialTypeBadge(material.materialType)}`}>
            {material.materialType}
          </span>
          <span className="text-xs text-gray-500">
            {material.category === 'All materials' ? 'General' : material.category}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-500">{material.unit}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold ${getFileTypeBadge(material.fileType)}`}>
          {material.fileType} · {material.fileSize}
        </span>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}