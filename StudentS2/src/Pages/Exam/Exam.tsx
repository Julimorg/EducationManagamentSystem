import React, { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Category, Status, EXAMS } from './ExamData'
import { ExamCard } from './Components/ExamCard'


// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | Status | Category

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'submitted', label: 'Submitted' },
  { key: 'pending',   label: 'Pending'   },
  { key: 'graded',    label: 'Graded'    },
  { key: 'late',      label: 'Late'      },
  { key: 'listening', label: 'Listening' },
  { key: 'reading',   label: 'Reading'   },
  { key: 'writing',   label: 'Writing'   },
  { key: 'speaking',  label: 'Speaking'  },
]

// ─── Pagination helper ────────────────────────────────────────────────────────

function buildPages(current: number, total: number): (number | '…')[] {
  const out: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) {
      out.push(p)
    } else if (out[out.length - 1] !== '…') {
      out.push('…')
    }
  }
  return out
}

const PAGE_SIZE = 6   // 2 rows × 3 cols on desktop

// ─── ExamsPage ────────────────────────────────────────────────────────────────

export function ExamsPage() {
  const navigate                  = useNavigate()
  const [activeFilter, setFilter] = useState<FilterKey>('all')
  const [query,        setQuery]  = useState('')
  const [page,         setPage]   = useState(1)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return EXAMS.filter(e => {
      const matchFilter =
        activeFilter === 'all' ||
        e.status   === activeFilter ||
        e.category === activeFilter
      return matchFilter && e.title.toLowerCase().includes(q)
    })
  }, [activeFilter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilter(key: FilterKey) { setFilter(key); setPage(1) }
  function handleSearch(val: string)    { setQuery(val);  setPage(1) }

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Filter + Search bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

        {/* Filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search exams…"
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white
                       focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      {/* ── Result count ── */}
      <p className="text-[11px] text-gray-400">
        {filtered.length === 0
          ? 'No exams found'
          : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} exam${filtered.length !== 1 ? 's' : ''}`
        }
      </p>

      {/* ── Grid ── */}
      {pageItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          No exams match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onClick={() => navigate(`/exams/${exam.id}`)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                       text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {buildPages(safePage, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="w-8 text-center text-xs text-gray-300 select-none">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-8 h-8 text-xs rounded-lg border transition-colors ${
                  safePage === p
                    ? 'bg-slate-700 text-white border-slate-700 font-semibold'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200
                       text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}