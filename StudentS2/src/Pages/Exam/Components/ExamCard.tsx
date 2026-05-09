import React from 'react'
import {
  Clock,
  Users,
  Headphones,
  BookOpen,
  PenLine,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Star,
} from 'lucide-react'
import { Category, Status, Exam, TAG_STYLE } from '../ExamData'


// ─── Category visual config ───────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, {
  icon:       React.ReactNode
  bannerFrom: string
  bannerTo:   string
  iconBg:     string
  iconColor:  string
}> = {
  listening: {
    icon:       <Headphones    className="w-8 h-8" />,
    bannerFrom: 'from-violet-100',
    bannerTo:   'to-violet-50',
    iconBg:     'bg-violet-500',
    iconColor:  'text-white',
  },
  reading: {
    icon:       <BookOpen      className="w-8 h-8" />,
    bannerFrom: 'from-blue-100',
    bannerTo:   'to-blue-50',
    iconBg:     'bg-blue-500',
    iconColor:  'text-white',
  },
  writing: {
    icon:       <PenLine       className="w-8 h-8" />,
    bannerFrom: 'from-green-100',
    bannerTo:   'to-green-50',
    iconBg:     'bg-green-500',
    iconColor:  'text-white',
  },
  speaking: {
    icon:       <MessageSquare className="w-8 h-8" />,
    bannerFrom: 'from-orange-100',
    bannerTo:   'to-orange-50',
    iconBg:     'bg-orange-500',
    iconColor:  'text-white',
  },
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<Status, { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label:     'Pending',
    className: 'bg-orange-500 text-white',
    icon:      <Hourglass    className="w-3 h-3" />,
  },
  submitted: {
    label:     'Submitted',
    className: 'bg-blue-500 text-white',
    icon:      <CheckCircle2 className="w-3 h-3" />,
  },
  graded: {
    label:     'Graded',
    className: 'bg-green-500 text-white',
    icon:      <Star         className="w-3 h-3" />,
  },
  late: {
    label:     'Overdue',
    className: 'bg-red-500 text-white',
    icon:      <AlertCircle  className="w-3 h-3" />,
  },
}

// ─── Entry button label per status ───────────────────────────────────────────

const ENTRY_LABEL: Record<Status, string> = {
  pending:   'Start Exam',
  submitted: 'View Result',
  graded:    'View Result',
  late:      'View Details',
}

const ENTRY_STYLE: Record<Status, string> = {
  pending:   'bg-slate-700 hover:bg-slate-800 text-white',
  submitted: 'bg-blue-500  hover:bg-blue-600  text-white',
  graded:    'bg-green-500 hover:bg-green-600 text-white',
  late:      'bg-red-500   hover:bg-red-600   text-white',
}

// ─── ExamCard ─────────────────────────────────────────────────────────────────

type Props = {
  exam:    Exam
  onClick: () => void
}

export function ExamCard({ exam, onClick }: Props) {
  const cat   = CATEGORY_CONFIG[exam.category]
  const badge = STATUS_BADGE[exam.status]
  const totalQ = exam.skillRows.reduce((s, r) => s + r.totalQuestions, 0)

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      {/* ── Banner ── */}
      <div className={`relative h-36 bg-gradient-to-br ${cat.bannerFrom} ${cat.bannerTo}
                       flex items-center justify-center overflow-hidden`}>

        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/30 pointer-events-none" />
        <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/20 pointer-events-none" />

        {/* Watermark icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-gray-500 scale-150">
          {cat.icon}
        </div>

        {/* Status badge — top right */}
        <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1
                         rounded-lg text-[11px] font-semibold shadow-sm ${badge.className}`}>
          {badge.icon}
          {badge.label}
        </div>

        {/* Score badge — top left */}
        {exam.score && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
            <span className="text-xs font-bold text-blue-600">{exam.score}</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-4 pt-4 pb-3 flex-1 space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2
                       group-hover:text-slate-600 transition-colors">
          {exam.title}
        </h3>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {exam.meta}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Users className="w-3 h-3 flex-shrink-0" />
            {exam.participants}
          </span>
        </div>

        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TAG_STYLE[exam.category]}`}>
          {exam.tag}
        </span>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-gray-100" />

      {/* ── Category icon + question count ── */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                         ${cat.iconBg} ${cat.iconColor} shadow-sm`}>
          <span className="scale-75">{cat.icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{totalQ} câu</p>
          <p className="text-[10px] text-gray-400">{exam.duration}</p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-gray-100" />

      {/* ── Footer — entry button only ── */}
      <div className="px-4 py-3">
        <button
          onClick={onClick}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
                      text-xs font-semibold transition-colors ${ENTRY_STYLE[exam.status]}`}
        >
          {ENTRY_LABEL[exam.status]}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}