import React from 'react'

const stats = [
  { label: 'Assignments due', value: '3', valueClass: 'text-orange-500' },
  { label: 'Target Band', value: '7.0', valueClass: 'text-orange-500' },
  { label: 'Attendance rate', value: '92%', valueClass: 'text-green-600' },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-4 sm:px-5 sm:py-5"
        >
          <p className="text-xs text-gray-400 mb-1 truncate">{stat.label}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${stat.valueClass}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}