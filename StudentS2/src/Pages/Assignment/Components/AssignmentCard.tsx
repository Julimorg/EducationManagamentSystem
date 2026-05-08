import React from 'react'
import {
  Download,
  Send,
  Tag,
  Calendar,
  Clock,
  MessageSquareQuote,
  CheckCircle2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────
export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'late'

export type Assignment = {
  id:             string
  title:          string
  subtitle:       string
  assignmentType: string 
  createdDate:    string
  status:         AssignmentStatus
  due?:           string
  urgent?:        string 
  body?:          string
  tags?:          string[]
  score?:         string
  feedback?:      string
  showActions?:   boolean
}

// ─── Config Styles ────────────────────────────────────────
const STATUS_CONFIG: Record<AssignmentStatus, { label: string; style: string }> = {
  pending:   { label: 'Pending',   style: 'bg-orange-50 text-orange-700 border-orange-100' },
  submitted: { label: 'Submitted', style: 'bg-blue-50   text-blue-700   border-blue-100' },
  graded:    { label: 'Graded',    style: 'bg-green-50  text-green-700  border-green-100' },
  late:      { label: 'Late',      style: 'bg-red-50    text-red-700    border-red-100' },
}

// ─── Component ────────────────────────────────────────────
type Props = {
  assignment: Assignment
  onClick?:    () => void
}

export function AssignmentCard({ assignment: a, onClick }: Props) {
  const isGraded = a.status === 'graded'
  const isUrgent = !!a.urgent

  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm 
                 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Accent Line dựa trên trạng thái */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isGraded ? 'bg-green-500' : isUrgent ? 'bg-red-500' : 'bg-transparent'}`} />

      {/* ── Top Section ── */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
            {a.title}
          </h3>
          <p className="text-[11px] text-gray-400 font-medium">{a.subtitle}</p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[a.status].style}`}>
            {STATUS_CONFIG[a.status].label}
          </span>
          
          {/* Highlight Deadline - Cực kỳ nổi bật */}
          {isUrgent && (
            <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded shadow-sm animate-pulse">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-tight">
                {a.urgent}
              </span>
            </div>
          )}
          
          {a.score && (
            <div className="text-right">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Score</p>
              <p className="text-xl font-black text-blue-600 leading-none tracking-tighter">{a.score}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Assignment Type & Date ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
          <Tag className="w-3 h-3 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-700">{a.assignmentType}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span className="text-[11px]">Created {a.createdDate}</span>
        </div>
      </div>

      {/* ── Body (Đề bài) ── */}
      {a.body && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 pl-3 border-l-2 border-gray-100 italic">
            {a.body}
          </p>
        </div>
      )}

      {/* ── Teacher Feedback ── */}
      {isGraded && a.feedback && (
        <div className="mt-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 rounded-full p-1">
              <MessageSquareQuote className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Teacher Feedback
            </span>
          </div>
          <p className="text-[12px] text-gray-700 leading-snug font-medium pr-4">
            {a.feedback}
          </p>
          <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-blue-200" />
        </div>
      )}

      {/* ── Footer Actions ── */}
      {a.showActions && a.status === 'pending' && (
        <div 
          className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              PDF Brief
            </button>
            <button className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 rounded-lg text-[11px] font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-100 transition-transform active:scale-95">
              <Send className="w-3.5 h-3.5" />
              Submit now
            </button>
          </div>
          <span className="text-[10px] text-gray-400 italic">Max 50MB</span>
        </div>
      )}
    </div>
  )
}