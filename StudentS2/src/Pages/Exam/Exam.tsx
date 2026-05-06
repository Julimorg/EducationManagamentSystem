import React, { useState, useMemo } from 'react'
import { Search, Clock, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Category, Exam, EXAMS, Status, STATUS_LABEL, STATUS_PILL, TAG_STYLE } from './ExamData'



// re-export FilterKey nếu cần dùng ngoài
type FilterKey = 'all' | Status | Category

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'submitted', label: 'Submitted' },
  { key: 'pending',   label: 'Pending'   },
  { key: 'listening', label: 'Listening' },
  { key: 'reading',   label: 'Reading'   },
  { key: 'writing',   label: 'Writing'   },
  { key: 'speaking',  label: 'Speaking'  },
]

// ─── Page ─────────────────────────────────────────────────
export function ExamsPage() {
  const navigate                  = useNavigate()
  const [activeFilter, setFilter] = useState<FilterKey>('all')
  const [query, setQuery]         = useState('')

  const filtered = useMemo(() =>
    EXAMS.filter((e) => {
      const matchFilter =
        activeFilter === 'all' ||
        e.status   === activeFilter ||
        e.category === activeFilter
      return matchFilter && e.title.toLowerCase().includes(query.toLowerCase())
    }),
    [activeFilter, query],
  )

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exams..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white
                       focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      {/* Card list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">
            No exams found.
          </div>
        ) : (
          filtered.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onClick={() => navigate(`/exams/${exam.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── ExamCard ─────────────────────────────────────────────
function ExamCard({ exam, onClick }: { exam: Exam; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm
                 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">

        {/* Left */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 leading-snug">
            {exam.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{exam.meta}</p>

          <div className="flex items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3 h-3 text-gray-400" />
              {exam.duration}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="w-3 h-3 text-gray-400" />
              {exam.participants}
            </span>
          </div>

          <span className={`inline-flex mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${TAG_STYLE[exam.category]}`}>
            {exam.tag}
          </span>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_PILL[exam.status]}`}>
            {STATUS_LABEL[exam.status]}
          </span>
          {exam.score && (
            <span className="text-base font-medium text-blue-600">{exam.score}</span>
          )}
          {exam.due && (
            <span className="text-[10px] text-gray-400">Due: {exam.due}</span>
          )}
          {exam.urgent && (
            <span className="text-[10px] font-semibold text-red-500">{exam.urgent}</span>
          )}
          {exam.status === 'late' && (
            <span className="text-xs font-medium text-red-600">Overdue</span>
          )}
        </div>
      </div>
    </div>
  )
}