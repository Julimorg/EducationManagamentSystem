import React, { useState, useMemo } from 'react'
import {
  BookOpen,
  ClipboardList,
  Headphones,
  BookMarked,
  PenLine,
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamCategory = 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Full'

type ActivityType = 'Assignment' | 'Exam'

type Status = 'Completed' | 'Pending' | 'Missed'

type ActivityRow = {
  id: string
  type: ActivityType
  title: string
  category?: ExamCategory
  submittedAt: string | null
  score: number | null
  maxScore: number
  status: Status
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACTIVITIES: ActivityRow[] = [
  // Assignments
  { id: 'a1',  type: 'Assignment', title: 'Grammar Exercise 01',          submittedAt: '2025-01-10', score: 88,  maxScore: 100, status: 'Completed' },
  { id: 'a2',  type: 'Assignment', title: 'Vocabulary Builder – Unit 3',  submittedAt: '2025-01-17', score: 74,  maxScore: 100, status: 'Completed' },
  { id: 'a3',  type: 'Assignment', title: 'Reading Comprehension Set A',  submittedAt: '2025-01-24', score: 91,  maxScore: 100, status: 'Completed' },
  { id: 'a4',  type: 'Assignment', title: 'Writing Task 1 – Bar Chart',   submittedAt: '2025-02-03', score: 65,  maxScore: 100, status: 'Completed' },
  { id: 'a5',  type: 'Assignment', title: 'Writing Task 2 – Opinion',     submittedAt: null,         score: null, maxScore: 100, status: 'Pending'   },
  { id: 'a6',  type: 'Assignment', title: 'Listening Practice Set B',     submittedAt: '2025-02-14', score: 82,  maxScore: 100, status: 'Completed' },
  { id: 'a7',  type: 'Assignment', title: 'Paraphrase Drill – Unit 5',    submittedAt: null,         score: null, maxScore: 100, status: 'Missed'    },
  { id: 'a8',  type: 'Assignment', title: 'Collocations Worksheet',       submittedAt: '2025-02-28', score: 79,  maxScore: 100, status: 'Completed' },
  // Exams
  { id: 'e1',  type: 'Exam', category: 'Listening', title: 'Listening Mock Test 1',   submittedAt: '2025-01-20', score: 32, maxScore: 40,  status: 'Completed' },
  { id: 'e2',  type: 'Exam', category: 'Reading',   title: 'Reading Mock Test 1',     submittedAt: '2025-01-20', score: 28, maxScore: 40,  status: 'Completed' },
  { id: 'e3',  type: 'Exam', category: 'Writing',   title: 'Writing Mock Test 1',     submittedAt: '2025-02-05', score: 6,  maxScore: 9,   status: 'Completed' },
  { id: 'e4',  type: 'Exam', category: 'Speaking',  title: 'Speaking Mock Test 1',    submittedAt: '2025-02-05', score: 6,  maxScore: 9,   status: 'Completed' },
  { id: 'e5',  type: 'Exam', category: 'Full',      title: 'Full IELTS Simulation 1', submittedAt: '2025-02-18', score: 65, maxScore: 90,  status: 'Completed' },
  { id: 'e6',  type: 'Exam', category: 'Listening', title: 'Listening Mock Test 2',   submittedAt: null,         score: null, maxScore: 40, status: 'Pending'  },
  { id: 'e7',  type: 'Exam', category: 'Reading',   title: 'Reading Mock Test 2',     submittedAt: null,         score: null, maxScore: 40, status: 'Pending'  },
  { id: 'e8',  type: 'Exam', category: 'Writing',   title: 'Writing Mock Test 2',     submittedAt: null,         score: null, maxScore: 9,  status: 'Missed'   },
  { id: 'e9',  type: 'Exam', category: 'Speaking',  title: 'Speaking Mock Test 2',    submittedAt: '2025-03-10', score: 7,   maxScore: 9,  status: 'Completed' },
  { id: 'e10', type: 'Exam', category: 'Full',      title: 'Full IELTS Simulation 2', submittedAt: null,         score: null, maxScore: 90, status: 'Pending'  },
]

const TOTAL_ASSIGNMENTS = 10
const TOTAL_EXAMS       = 12

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryIcon: Record<ExamCategory, React.ReactNode> = {
  Listening: <Headphones  className="w-3 h-3" />,
  Reading:   <BookMarked  className="w-3 h-3" />,
  Writing:   <PenLine     className="w-3 h-3" />,
  Speaking:  <MessageSquare className="w-3 h-3" />,
  Full:      <BookOpen    className="w-3 h-3" />,
}

const categoryColor: Record<ExamCategory, string> = {
  Listening: 'bg-sky-100 text-sky-700 border-sky-200',
  Reading:   'bg-violet-100 text-violet-700 border-violet-200',
  Writing:   'bg-amber-100 text-amber-700 border-amber-200',
  Speaking:  'bg-rose-100 text-rose-700 border-rose-200',
  Full:      'bg-slate-100 text-slate-700 border-slate-200',
}

const statusConfig: Record<Status, { icon: React.ReactNode; color: string }> = {
  Completed: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-green-600' },
  Pending:   { icon: <Clock        className="w-3.5 h-3.5" />, color: 'text-amber-500' },
  Missed:    { icon: <XCircle      className="w-3.5 h-3.5" />, color: 'text-red-400'   },
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, done, total, color,
}: {
  icon: React.ReactNode
  label: string
  done: number
  total: number
  color: string
}) {
  const pct = Math.round((done / total) * 100)
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-gray-400 font-medium">{pct}%</span>
      </div>
      <div>
        <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
        <p className="text-lg font-semibold text-gray-800 leading-none">
          {done}
          <span className="text-sm font-normal text-gray-400 ml-1">/ {total}</span>
        </p>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'currentColor' }}
        />
      </div>
    </div>
  )
}

// ─── Exam Category Mini Card ──────────────────────────────────────────────────

function ExamCategoryCard({ cat, done, total }: { cat: ExamCategory; done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-xs ${categoryColor[cat]}`}>
      <span className="opacity-70">{categoryIcon[cat]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-none mb-1">{cat}</p>
        <div className="h-1 w-full bg-black/10 rounded-full">
          <div className="h-full rounded-full bg-current transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="font-semibold tabular-nums whitespace-nowrap">{done}/{total}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 7

type FilterType = 'All' | 'Assignment' | 'Exam'
type FilterStatus = 'All' | Status

export function StudentReport() {
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState<FilterType>('All')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All')
  const [page,         setPage]         = useState(1)
  const [showFilters,  setShowFilters]  = useState(false)

  // ── Derived stats ──────────────────────────────────────────────────────────
  const doneAssignments = ACTIVITIES.filter(a => a.type === 'Assignment' && a.status === 'Completed').length
  const doneExams       = ACTIVITIES.filter(a => a.type === 'Exam'       && a.status === 'Completed').length

  const examCategories: ExamCategory[] = ['Listening', 'Reading', 'Writing', 'Speaking', 'Full']
  const catStats = useMemo(() =>
    examCategories.map(cat => ({
      cat,
      done:  ACTIVITIES.filter(a => a.type === 'Exam' && a.category === cat && a.status === 'Completed').length,
      total: ACTIVITIES.filter(a => a.type === 'Exam' && a.category === cat).length,
    })),
  [])

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return ACTIVITIES.filter(row => {
      const q = search.toLowerCase()
      if (q && !row.title.toLowerCase().includes(q) && !(row.category?.toLowerCase().includes(q))) return false
      if (filterType !== 'All' && row.type !== filterType) return false
      if (filterStatus !== 'All' && row.status !== filterStatus) return false
      return true
    })
  }, [search, filterType, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleType(v: FilterType)   { setFilterType(v);   setPage(1) }
  function handleStatus(v: FilterStatus) { setFilterStatus(v); setPage(1) }

  return (
    <div className="bg-white border border-t-0 border-gray-100 px-4 sm:px-6 py-6 space-y-6">

      {/* ── Section header ── */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Progress Report
        </p>
        <h2 className="text-sm font-semibold text-gray-700">Learning Activity Overview</h2>
      </div>

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
        <StatCard
          icon={<ClipboardList className="w-4 h-4 text-indigo-600" />}
          label="Assignments done"
          done={doneAssignments}
          total={TOTAL_ASSIGNMENTS}
          color="bg-indigo-50 text-indigo-400"
        />
        <StatCard
          icon={<BookOpen className="w-4 h-4 text-teal-600" />}
          label="Exams done"
          done={doneExams}
          total={TOTAL_EXAMS}
          color="bg-teal-50 text-teal-400"
        />
      </div>

      {/* ── Exam category breakdown ── */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Exam breakdown by skill
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {catStats.map(s => (
            <ExamCategoryCard key={s.cat} cat={s.cat} done={s.done} total={s.total} />
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          All activities
        </p>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search title or category…"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg transition-colors ${
              showFilters ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {(filterType !== 'All' || filterStatus !== 'All') && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-0.5" />
            )}
          </button>
        </div>

        {/* Expanded filter pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mr-1">Type:</span>
              {(['All', 'Assignment', 'Exam'] as FilterType[]).map(v => (
                <button
                  key={v}
                  onClick={() => handleType(v)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    filterType === v
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mr-1">Status:</span>
              {(['All', 'Completed', 'Pending', 'Missed'] as FilterStatus[]).map(v => (
                <button
                  key={v}
                  onClick={() => handleStatus(v)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    filterStatus === v
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Table – scrollable on mobile */}
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px] w-8">#</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px]">Title</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Type</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px]">Score</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Submitted</th>
                <th className="text-left px-3 py-2.5 font-semibold text-gray-400 uppercase tracking-wide text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                    No activities found.
                  </td>
                </tr>
              ) : pageRows.map((row, i) => {
                const st = statusConfig[row.status]
                const globalIdx = (safePage - 1) * PAGE_SIZE + i + 1
                return (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-300 font-medium">{globalIdx}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-gray-700 leading-snug">{row.title}</span>
                        {row.category && (
                          <span className={`inline-flex items-center gap-1 self-start px-1.5 py-0.5 rounded border text-[10px] font-medium ${categoryColor[row.category]}`}>
                            {categoryIcon[row.category]}
                            {row.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        row.type === 'Exam'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 tabular-nums text-gray-700">
                      {row.score !== null
                        ? <><span className="font-semibold">{row.score}</span><span className="text-gray-400">/{row.maxScore}</span></>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-3 py-3 text-gray-400 hidden md:table-cell">
                      {row.submittedAt ?? '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 font-medium ${st.color}`}>
                        {st.icon}
                        <span className="hidden sm:inline">{row.status}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
          <p className="text-xs text-gray-400">
            {filtered.length === 0 ? '0 results' : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} className="w-7 text-center text-gray-300 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
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
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}