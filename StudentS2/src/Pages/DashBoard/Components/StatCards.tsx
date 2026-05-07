import React from 'react'
import { FileText, ClipboardList, CalendarCheck } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────
type StatCardData = {
  icon:       React.ReactNode
  label:      string
  done:       number
  total:      number
  unit?:      string        // e.g. '%' for attendance
  accentClass: string
}

// ─── Mock data (thay bằng API data sau) ──────────────────
const STATS: StatCardData[] = [
  {
    icon:        <FileText className="w-4 h-4" />,
    label:       'Assignments',
    done:        5,
    total:       8,
    accentClass: 'text-orange-500',
  },
  {
    icon:        <ClipboardList className="w-4 h-4" />,
    label:       'Exams',
    done:        3,
    total:       6,
    accentClass: 'text-blue-600',
  },
  {
    icon:        <CalendarCheck className="w-4 h-4" />,
    label:       'Attendance rate',
    done:        92,
    total:       100,
    unit:        '%',
    accentClass: 'text-green-600',
  },
]

// ─── Component ────────────────────────────────────────────
export function StatCards() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  )
}

function StatCard({ stat }: { stat: StatCardData }) {
  const pct = Math.round((stat.done / stat.total) * 100)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-4 sm:px-5 sm:py-5">

      {/* Label + icon */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-gray-400">{stat.icon}</span>
        <p className="text-xs text-gray-400 truncate">{stat.label}</p>
      </div>

      {/* Value */}
      {stat.unit ? (
        // Attendance: hiện % lớn
        <p className={`text-2xl sm:text-3xl font-bold ${stat.accentClass}`}>
          {stat.done}{stat.unit}
        </p>
      ) : (
        // Assignment / Exam: hiện done / total
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl sm:text-3xl font-bold ${stat.accentClass}`}>
            {stat.done}
          </span>
          <span className="text-sm text-gray-400 font-medium">
            / {stat.total}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor(stat.accentClass)}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Sub-label */}
      <p className="text-[10px] text-gray-400 mt-1.5">
        {stat.unit
          ? `${stat.done} / ${stat.total} sessions attended`
          : `${stat.done} completed · ${stat.total - stat.done} remaining`}
      </p>
    </div>
  )
}

// Map accent class → progress bar fill
function progressColor(accentClass: string): string {
  if (accentClass.includes('orange')) return 'bg-orange-400'
  if (accentClass.includes('blue'))   return 'bg-blue-500'
  if (accentClass.includes('green'))  return 'bg-green-500'
  return 'bg-gray-400'
}