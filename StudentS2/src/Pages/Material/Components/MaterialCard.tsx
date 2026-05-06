import React from 'react'
import { Download } from 'lucide-react'
import type { Material, FileType, MaterialType } from '../data/mockData'

// ─── Badge helpers (shared with MaterialListItem) ─────────
export function getFileTypeBadge(fileType: FileType): string {
  const map: Record<FileType, string> = {
    PDF:  'bg-red-50    text-red-600',
    MP3:  'bg-pink-50   text-pink-600',
    MP4:  'bg-violet-50 text-violet-600',
    DOC:  'bg-green-50  text-green-700',
    PPTX: 'bg-yellow-50 text-yellow-700',
  }
  return map[fileType] ?? 'bg-gray-50 text-gray-600'
}

export function getMaterialTypeBadge(type: MaterialType): string {
  const map: Record<MaterialType, string> = {
    'Grammar':           'bg-red-50    text-red-700    border-red-100',
    'Vocabulary':        'bg-blue-50   text-blue-700   border-blue-100',
    'IeltsBook':         'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Listening Practice':'bg-purple-50 text-purple-700 border-purple-100',
    'Reading Practice':  'bg-orange-50 text-orange-700 border-orange-100',
    'Writing Guide':     'bg-amber-50  text-amber-700  border-amber-100',
  }
  return map[type] ?? 'bg-gray-50 text-gray-700 border-gray-100'
}

// ─── MaterialCard ─────────────────────────────────────────
type Props = { material: Material }

export function MaterialCard({ material }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${material.iconColor}`}>
        {material.iconLetter}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
        {material.title}
      </h3>

      {/* Meta */}
      <p className="text-xs text-gray-500">
        {material.category === 'All materials' ? 'General' : material.category}
        {' · '}{material.unit}
      </p>

      {/* Type badge */}
      <div>
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getMaterialTypeBadge(material.materialType)}`}>
          {material.materialType}
        </span>
      </div>

      {/* Bottom: file badge + download */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold ${getFileTypeBadge(material.fileType)}`}>
          {material.fileType} · {material.fileSize}
        </span>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}