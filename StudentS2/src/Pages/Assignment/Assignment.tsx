import React, { useState, useMemo } from 'react'
import { Search, Calendar, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Assignment, AssignmentCard } from './Components/AssignmentCard'

// ─── Mock data ────────────────────────────────────────────
const ASSIGNMENTS: Assignment[] = [
  {
    id:          '1',
    title:       'IELTS Writing Task 2 — Essay Practice',
    subtitle:    'Writing · Band 6.5 Target · Posted by Ms. Sarah · Apr 15',
    category:    'Writing',
    createdDate: 'Apr 15, 2026',
    status:      'pending',
    due:         'Apr 19, 23:59',
    urgent:      '24h remaining',
    body:        'Write a 250-word essay on the topic: Some people believe that technology has made our lives more complex. To what extent do you agree or disagree?',
    tags:        ['writing', 'task-2', 'opinion-essay'],
    showActions: true,
  },
  {
    id:          '2',
    title:       'IELTS Listening Practice Test 4',
    subtitle:    'Listening · Band 7.0 Target · Posted Apr 14',
    category:    'Listening',
    createdDate: 'Apr 14, 2026',
    status:      'submitted',
    submittedAt: 'Submitted Apr 16 at 14:32 · 2 files uploaded',
  },
  {
    id:          '3',
    title:       'IELTS Reading — Academic Passage Analysis',
    subtitle:    'Reading · Band 7.0 Target · Posted Apr 10',
    category:    'Reading',
    createdDate: 'Apr 10, 2026',
    status:      'graded',
    score:       '32 / 40',
    feedback:    'Good skimming technique but needs improvement on matching headings questions. Focus on identifying paraphrased keywords in the passage.',
  },
  {
    id:          '4',
    title:       'IELTS Speaking Part 2 — Cue Card Recording',
    subtitle:    'Speaking · Band 6.5 Target · Posted Apr 17',
    category:    'Speaking',
    createdDate: 'Apr 17, 2026',
    status:      'pending',
    due:         'Apr 22, 18:00',
    body:        'Record a 2-minute response to the cue card topic: Describe a time when you helped someone.',
    tags:        ['speaking', 'part-2', 'cue-card'],
  },
  {
    id:          '5',
    title:       'Vocabulary Builder — Academic Word List Set 3',
    subtitle:    'Vocabulary · All Skills · Posted Apr 8',
    category:    'Vocabulary',
    createdDate: 'Apr 08, 2026',
    status:      'late',
  },
]

const FILTERS = ['All', 'Pending', 'Submitted', 'Graded', 'Late'] as const
type FilterKey = typeof FILTERS[number]

// ─── Page ─────────────────────────────────────────────────
export function AssignmentsPage() {
  const navigate = useNavigate()

  const [activeFilter, setFilter] = useState<FilterKey>('All')
  const [query, setQuery]         = useState('')
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')

  // ── Normalise display date → ISO for comparison ──────────
  // createdDate stored as "Apr 15, 2026" — convert to YYYY-MM-DD for range comparison
  function toISO(displayDate: string): string {
    const d = new Date(displayDate)
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
  }

  const filtered = useMemo(() => {
    return ASSIGNMENTS.filter((a) => {
      const matchFilter =
        activeFilter === 'All' || a.status === activeFilter.toLowerCase()

      const matchSearch =
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())

      const iso = toISO(a.createdDate)
      const matchFrom = !dateFrom || iso >= dateFrom
      const matchTo   = !dateTo   || iso <= dateTo

      return matchFilter && matchSearch && matchFrom && matchTo
    })
  }, [activeFilter, query, dateFrom, dateTo])

  function clearDates() {
    setDateFrom('')
    setDateTo('')
  }

  const hasDateFilter = dateFrom || dateTo

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Row 1: Status filters + Search ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search — wider */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ── Row 2: Date range filter ── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          Created date
        </span>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
          <span className="text-xs text-gray-400">→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
        </div>

        {hasDateFilter && (
          <button
            onClick={clearDates}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 border border-gray-200
                       rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}

        {hasDateFilter && (
          <span className="text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Card list ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
            No assignments found.
          </div>
        ) : (
          filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onClick={() => navigate(`/assignments/${a.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}