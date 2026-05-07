import React from 'react'
import {
  Download,
  Send,
  Tag,
  Calendar,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────
export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'late'

export type Assignment = {
  id:          string
  title:       string
  subtitle:    string
  category:    string
  createdDate: string        // display string e.g. "Apr 15, 2026"
  status:      AssignmentStatus
  due?:        string
  urgent?:     string
  body?:       string
  tags?:       string[]
  submittedAt?: string
  score?:      string
  feedback?:   string
  showActions?: boolean
}

// ─── Status config ────────────────────────────────────────
export const STATUS_STYLE: Record<AssignmentStatus, string> = {
  pending:   'bg-orange-50 text-orange-700',
  submitted: 'bg-blue-50   text-blue-700',
  graded:    'bg-green-50  text-green-700',
  late:      'bg-red-50    text-red-700',
}

export const STATUS_LABEL: Record<AssignmentStatus, string> = {
  pending:   'Pending',
  submitted: 'Submitted',
  graded:    'Graded',
  late:      'Late',
}

// ─── Component ────────────────────────────────────────────
type Props = {
  assignment: Assignment
  onClick:    () => void
}

export function AssignmentCard({ assignment: a, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl px-5 py-5 shadow-sm
                 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      {/* ── Top row: title + status ── */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-900 leading-snug mb-1">
            {a.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">{a.subtitle}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${STATUS_STYLE[a.status]}`}>
            {STATUS_LABEL[a.status]}
          </span>
          {a.due     && <span className="text-[10.5px] text-gray-400">Due: {a.due}</span>}
          {a.urgent  && <span className="text-[10.5px] font-semibold text-orange-600">{a.urgent}</span>}
          {a.score   && <span className="text-base font-medium text-blue-600">{a.score}</span>}
          {a.status === 'late' && (
            <span className="text-xs font-medium text-red-600">Overdue</span>
          )}
        </div>
      </div>

      {/* ── Meta row: category + created date ── */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          {a.category}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          Created {a.createdDate}
        </span>
      </div>

      {/* ── Body ── */}
      {a.body && (
        <p className="text-xs text-gray-600 leading-relaxed mb-2">{a.body}</p>
      )}

      {/* ── Tags ── */}
      {a.tags && a.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {a.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10.5px] border border-gray-200 text-gray-500 bg-gray-50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Submitted info ── */}
      {a.submittedAt && (
        <p className="text-xs text-gray-400 mt-1">{a.submittedAt}</p>
      )}

      {/* ── Feedback ── */}
      {a.feedback && (
        <div className="mt-3 border-l-[3px] border-blue-500 bg-gray-50 rounded-r-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Teacher Feedback
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{a.feedback}</p>
        </div>
      )}

      {/* ── Actions ── */}
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
          <span className="text-[10.5px] text-gray-400">Multiple files · Max 50MB</span>
        </div>
      )}
    </div>
  )
}