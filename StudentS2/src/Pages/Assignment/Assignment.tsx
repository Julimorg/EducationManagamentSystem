import React, { useState } from 'react'
import { Search, Download, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─── Types ───────────────────────────────────────────────
type Status = 'pending' | 'submitted' | 'graded' | 'late'

type Assignment = {
  id: string
  title: string
  subtitle: string
  status: Status
  due?: string
  urgent?: string 
  body?: string
  tags?: string[]
  submittedAt?: string
  score?: string
  feedback?: string
  showActions?: boolean
}

// ─── Mock data ───────────────────────────────────────────
const ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'IELTS Writing Task 2 — Essay Practice',
    subtitle: 'Writing · Band 6.5 Target · Posted by Ms. Sarah · Apr 15',
    status: 'pending',
    due: 'Apr 19, 23:59',
    urgent: '24h remaining',
    body: 'Write a 250-word essay on the topic: Some people believe that technology has made our lives more complex. To what extent do you agree or disagree?',
    tags: ['writing', 'task-2', 'opinion-essay'],
    showActions: true,
  },
  {
    id: '2',
    title: 'IELTS Listening Practice Test 4',
    subtitle: 'Listening · Band 7.0 Target · Posted Apr 14',
    status: 'submitted',
    submittedAt: 'Submitted Apr 16 at 14:32 · 2 files uploaded',
  },
  {
    id: '3',
    title: 'IELTS Reading — Academic Passage Analysis',
    subtitle: 'Reading · Band 7.0 Target · Posted Apr 10',
    status: 'graded',
    score: '32 / 40',
    feedback:
      'Good skimming technique but needs improvement on matching headings questions. Focus on identifying paraphrased keywords in the passage.',
  },
  {
    id: '4',
    title: 'IELTS Speaking Part 2 — Cue Card Recording',
    subtitle: 'Speaking · Band 6.5 Target · Posted Apr 17',
    status: 'pending',
    due: 'Apr 22, 18:00',
    body: 'Record a 2-minute response to the cue card topic: Describe a time when you helped someone.',
    tags: ['speaking', 'part-2', 'cue-card'],
  },
  {
    id: '5',
    title: 'Vocabulary Builder — Academic Word List Set 3',
    subtitle: 'Vocabulary · All Skills · Posted Apr 8',
    status: 'late',
  },
]

// ─── Status config ────────────────────────────────────────
const STATUS_STYLE: Record<Status, string> = {
  pending:   'bg-orange-50 text-orange-700',
  submitted: 'bg-blue-50   text-blue-700',
  graded:    'bg-green-50  text-green-700',
  late:      'bg-red-50    text-red-700',
}

const STATUS_LABEL: Record<Status, string> = {
  pending:   'Pending',
  submitted: 'Submitted',
  graded:    'Graded',
  late:      'Late',
}

const FILTERS = ['All', 'Pending', 'Submitted', 'Graded', 'Late'] as const

// ─── Component ────────────────────────────────────────────
export function AssignmentsPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [query, setQuery] = useState('')

  const filtered = ASSIGNMENTS.filter((a) => {
    const matchFilter =
      activeFilter === 'All' ||
      a.status === activeFilter.toLowerCase()
    const matchSearch = a.title.toLowerCase().includes(query.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
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

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ── Card list ── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
            No assignments found.
          </div>
        )}

        {filtered.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            onClick={() => navigate(`/assignments/${a.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── AssignmentCard ───────────────────────────────────────
function AssignmentCard({
  assignment: a,
  onClick,
}: {
  assignment: Assignment
  onClick: () => void
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Top row */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            {a.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{a.subtitle}</p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLE[a.status]}`}>
            {STATUS_LABEL[a.status]}
          </span>
          {a.due && <span className="text-[10px] text-gray-400">Due: {a.due}</span>}
          {a.urgent && <span className="text-[10px] font-semibold text-orange-600">{a.urgent}</span>}
          {a.score && <span className="text-base font-bold text-blue-600">{a.score}</span>}
          {a.status === 'late' && (
            <span className="text-xs font-medium text-red-600">Due was Apr 14 — Late</span>
          )}
        </div>
      </div>

      {/* Body */}
      {a.body && (
        <p className="mt-3 text-xs text-gray-600 leading-relaxed">{a.body}</p>
      )}

      {/* Tags */}
      {a.tags && a.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {a.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] border border-gray-200 text-gray-500 bg-gray-50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Submitted info */}
      {a.submittedAt && (
        <p className="mt-2 text-xs text-gray-400">{a.submittedAt}</p>
      )}

      {/* Feedback */}
      {a.feedback && (
        <div className="mt-3 border-l-4 border-blue-500 bg-gray-50 rounded-r-md px-3 py-2.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Teacher Feedback
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{a.feedback}</p>
        </div>
      )}

      {/* Actions (pending with showActions) */}
      {a.showActions && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download brief (PDF)
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <Send className="w-3.5 h-3.5" />
            Submit assignment
          </button>
          <span className="text-[10px] text-gray-400">Multiple files · Max 50MB</span>
        </div>
      )}
    </div>
  )
}