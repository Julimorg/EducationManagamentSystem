import React, { useState, useMemo } from 'react'
import { Search, Clock, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────
type Status   = 'pending' | 'submitted' | 'graded' | 'late'
type Category = 'listening' | 'reading' | 'writing' | 'speaking'

type Exam = {
  id:           string
  title:        string
  meta:         string
  duration:     string
  participants: string
  tag:          string
  category:     Category
  status:       Status
  due?:         string
  urgent?:      string
  score?:       string
}

// ─── Mock data ────────────────────────────────────────────
const EXAMS: Exam[] = [
  {
    id:           '1',
    title:        'IELTS Listening Practice Test 1',
    meta:         'Created Apr 15 · by Mr. Tran Long',
    duration:     '30 minutes',
    participants: '0 participants',
    tag:          'Listening Test',
    category:     'listening',
    status:       'pending',
    due:          'Apr 25, 10:00',
    urgent:       '7 days left',
  },
  {
    id:           '2',
    title:        'Academic Reading Module - Part A',
    meta:         'Created Apr 14 · by Ms. Sarah Johnson',
    duration:     '60 minutes',
    participants: '24 participants',
    tag:          'Reading Test',
    category:     'reading',
    status:       'submitted',
  },
  {
    id:           '3',
    title:        'Writing Task 2 - Opinion Essay',
    meta:         'Created Apr 12 · by Mr. David Chen',
    duration:     '60 minutes',
    participants: '18 participants',
    tag:          'Writing Task',
    category:     'writing',
    status:       'graded',
    score:        '7.5 / 9',
  },
  {
    id:           '4',
    title:        'IELTS Speaking Part 1 & 2',
    meta:         'Created Apr 18 · by Ms. Sarah Johnson',
    duration:     '15 minutes',
    participants: '0 participants',
    tag:          'Speaking Test',
    category:     'speaking',
    status:       'pending',
    due:          'Apr 26, 14:00',
    urgent:       '8 days left',
  },
  {
    id:           '5',
    title:        'Academic Reading Module - Part B',
    meta:         'Created Apr 10 · by Mr. Tran Long',
    duration:     '60 minutes',
    participants: '22 participants',
    tag:          'Reading Test',
    category:     'reading',
    status:       'graded',
    score:        '32 / 40',
  },
  {
    id:           '6',
    title:        'IELTS Listening Practice Test 2',
    meta:         'Created Apr 8 · by Mr. Tran Long',
    duration:     '30 minutes',
    participants: '20 participants',
    tag:          'Listening Test',
    category:     'listening',
    status:       'submitted',
  },
  {
    id:           '7',
    title:        'Writing Task 1 - Graph Description',
    meta:         'Created Apr 5 · by Mr. David Chen',
    duration:     '20 minutes',
    participants: '19 participants',
    tag:          'Writing Task',
    category:     'writing',
    status:       'late',
  },
]

// ─── Config maps ──────────────────────────────────────────
const STATUS_PILL: Record<Status, string> = {
  pending:   'bg-orange-50 text-orange-700 border border-orange-200',
  submitted: 'bg-green-50  text-green-700  border border-green-200',
  graded:    'bg-blue-50   text-blue-700   border border-blue-200',
  late:      'bg-red-50    text-red-700    border border-red-200',
}

const STATUS_LABEL: Record<Status, string> = {
  pending:   'Pending',
  submitted: 'Submitted',
  graded:    'Graded',
  late:      'Late',
}

const TAG_STYLE: Record<Category, string> = {
  listening: 'bg-violet-50 text-violet-700 border border-violet-200',
  reading:   'bg-blue-50   text-blue-700   border border-blue-200',
  writing:   'bg-green-50  text-green-700  border border-green-200',
  speaking:  'bg-orange-50 text-orange-700 border border-orange-200',
}

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
  const navigate                    = useNavigate()
  const [activeFilter, setFilter]   = useState<FilterKey>('all')
  const [query, setQuery]           = useState('')

  const filtered = useMemo(() => {
    return EXAMS.filter((e) => {
      const matchFilter =
        activeFilter === 'all' ||
        e.status   === activeFilter ||
        e.category === activeFilter
      const matchSearch = e.title.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [activeFilter, query])

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Filter bar ── */}
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
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      {/* ── Card list ── */}
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
function ExamCard({
  exam,
  onClick,
}: {
  exam: Exam
  onClick: () => void
}) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4">

        {/* Left */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 leading-snug">
            {exam.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{exam.meta}</p>

          {/* Stats row */}
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

          {/* Tag */}
          <span
            className={`inline-flex mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
              TAG_STYLE[exam.category]
            }`}
          >
            {exam.tag}
          </span>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
              STATUS_PILL[exam.status]
            }`}
          >
            {STATUS_LABEL[exam.status]}
          </span>

          {exam.score && (
            <span className="text-base font-medium text-blue-600">
              {exam.score}
            </span>
          )}
          {exam.due && (
            <span className="text-[10px] text-gray-400">Due: {exam.due}</span>
          )}
          {exam.urgent && (
            <span className="text-[10px] font-semibold text-red-500">
              {exam.urgent}
            </span>
          )}
          {exam.status === 'late' && (
            <span className="text-xs font-medium text-red-600">Overdue</span>
          )}
        </div>
      </div>
    </div>
  )
}