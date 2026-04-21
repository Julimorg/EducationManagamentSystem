import React from 'react'
import { DownloadIcon } from 'lucide-react'
import { Material } from '../data/mockData'
type MaterialCardProps = {
  material: Material
}
function getFileTypeBadge(fileType: string) {
  switch (fileType) {
    case 'PDF':
      return 'bg-red-50 text-red-600'
    case 'PPTX':
      return 'bg-yellow-50 text-yellow-700'
    case 'DOC':
      return 'bg-green-50 text-green-700'
    case 'MP3':
      return 'bg-pink-50 text-pink-600'
    case 'MP4':
      return 'bg-violet-50 text-violet-600'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}
function getMaterialTypeBadge(type: string) {
  switch (type) {
    case 'Grammar':
      return 'bg-red-50 text-red-700 border-red-100'
    case 'Vocabulary':
      return 'bg-blue-50 text-blue-700 border-blue-100'
    case 'IeltsBook':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    case 'Listening Practice':
      return 'bg-purple-50 text-purple-700 border-purple-100'
    case 'Reading Practice':
      return 'bg-orange-50 text-orange-700 border-orange-100'
    case 'Writing Guide':
      return 'bg-amber-50 text-amber-700 border-amber-100'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}
export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${material.iconColor}`}
      >
        {material.iconLetter}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 leading-tight">
        {material.title}
      </h3>

      {/* Meta line */}
      <p className="text-sm text-gray-500">
        {material.materialType} ·{' '}
        {material.category === 'All materials' ? 'General' : material.category}{' '}
        · {material.unit}
      </p>

      {/* Material type badge */}
      <div>
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getMaterialTypeBadge(material.materialType)}`}
        >
          {material.materialType}
        </span>
      </div>

      {/* Bottom row: file badge + download */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span
          className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${getFileTypeBadge(material.fileType)}`}
        >
          {material.fileType} · {material.fileSize}
        </span>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <DownloadIcon className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}
