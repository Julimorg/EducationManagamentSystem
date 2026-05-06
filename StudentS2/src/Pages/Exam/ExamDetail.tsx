import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Users, Zap, RotateCcw, BarChart2 } from 'lucide-react'
import {
  EXAMS,
  EXAM_STATUS_PILL,
  type SkillRow,
  type Category,
} from './examData'
import { SkillIcon } from './components/SkillIcon'

const CATEGORY_ROUTE: Record<Category, string> = {
  listening: 'listening',
  reading:   'reading',
  writing:   'writing',
  speaking:  'speaking',
}

export function ExamDetailPage() {
  const navigate = useNavigate()
  const { id }   = useParams<{ id: string }>()
  const exam     = EXAMS.find((e) => e.id === id) ?? EXAMS[0]

  // Navigate vào đúng exam layout theo category
  function handleAttempt() {
    navigate(`/exams/${exam.id}/${CATEGORY_ROUTE[exam.category]}`)
  }

  // Navigate sang trang kết quả
  function handleViewResult() {
    navigate(`/exams/${exam.id}/result`)
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exams
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{exam.title}</h1>
        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Posted: {exam.dateCreated}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {exam.numParticipants} Participants
          </span>
          <span>by {exam.createdBy}</span>
        </div>
      </div>

      {/* Skill table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  'Skill Test',
                  'Thời gian làm',
                  'Số Câu làm',
                  'Trạng thái làm',
                  'Số câu đúng',
                  'Score',
                  'Attempt',
                  'Attempt Again',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-xs font-semibold text-gray-600 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exam.skillRows.map((row, i) => (
                <SkillTableRow
                  key={i}
                  row={row}
                  onAttempt={handleAttempt}
                  onViewResult={handleViewResult}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── SkillTableRow ────────────────────────────────────────
/**
 * Button logic theo status:
 *
 * ┌───────────┬──────────────────────────┬─────────────────────────┐
 * │  Status   │   Cột "Attempt"          │   Cột "Attempt Again"   │
 * ├───────────┼──────────────────────────┼─────────────────────────┤
 * │ Pending   │ 🟠 Attempt (active)      │ ⬜ Attempt Again (dis.) │
 * │ Submitted │ ⬜ Attempt (disabled)    │ ⬜ Attempt Again (dis.) │
 * │ Graded    │ 🔵 View Result (active)  │ 🟠 Attempt Again (act.) │
 * └───────────┴──────────────────────────┴─────────────────────────┘
 */
function SkillTableRow({
  row,
  onAttempt,
  onViewResult,
}: {
  row:          SkillRow
  onAttempt:    () => void
  onViewResult: () => void
}) {
  const isPending   = row.status === 'Pending'
  const isSubmitted = row.status === 'Submitted'
  const isGraded    = row.status === 'Graded'

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">

      {/* Skill icon */}
      <td className="px-4 py-6 border-r border-gray-100">
        <SkillIcon category={row.skill} />
      </td>

      {/* Thời gian */}
      <td className="px-4 py-6 border-r border-gray-100 text-gray-700 font-medium">
        {row.duration} Phút
      </td>

      {/* Số câu làm */}
      <td className="px-4 py-6 border-r border-gray-100">
        <span className="text-blue-600 font-semibold">
          {row.answeredQuestions}/{row.totalQuestions}
        </span>
      </td>

      {/* Trạng thái */}
      <td className="px-4 py-6 border-r border-gray-100">
        <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${EXAM_STATUS_PILL[row.status]}`}>
          {row.status}
        </span>
      </td>

      {/* Số câu đúng */}
      <td className="px-4 py-6 border-r border-gray-100">
        {isGraded
          ? <span className="text-blue-600 font-semibold">{row.correctAnswers}/{row.totalQuestions}</span>
          : <span className="text-gray-400">--</span>
        }
      </td>

      {/* Score */}
      <td className="px-4 py-6 border-r border-gray-100">
        {isGraded
          ? <span className="text-gray-800 font-semibold text-base">{row.score}</span>
          : <span className="text-gray-400">--</span>
        }
      </td>

      {/* ── Cột Attempt ── */}
      <td className="px-4 py-6 border-r border-gray-100">
        {isPending && (
          <button
            onClick={onAttempt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Attempt
          </button>
        )}

        {isSubmitted && (
          <div className="flex flex-col items-center gap-1">
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" />
              Attempt
            </button>
            <span className="text-[10px] text-gray-400 italic">Awaiting grade</span>
          </div>
        )}

        {isGraded && (
          <button
            onClick={onViewResult}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-800 text-white transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            View Result
          </button>
        )}
      </td>

      {/* ── Cột Attempt Again ── */}
      <td className="px-4 py-6">
        {isGraded ? (
          <button
            onClick={onAttempt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-orange-400 text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Attempt Again
          </button>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Attempt Again
          </button>
        )}
      </td>
    </tr>
  )
}