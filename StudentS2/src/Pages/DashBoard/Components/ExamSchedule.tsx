import React from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────
type ExamCategory = 'Listening' | 'Reading' | 'Writing' | 'Speaking'

type Exam = {
  id:          number
  name:        string
  category:    ExamCategory
  duration:    string
  createdDate: string
  createdBy:   string
}

// ─── Mock data ────────────────────────────────────────────
const EXAMS: Exam[] = [
  {
    id:          1,
    name:        'Listening Practice Test 1',
    category:    'Listening',
    duration:    '30 min',
    createdDate: 'Apr 15, 2026',
    createdBy:   'Mr. Tran Long',
  },
  {
    id:          2,
    name:        'Academic Reading Module - Part A',
    category:    'Reading',
    duration:    '60 min',
    createdDate: 'Apr 14, 2026',
    createdBy:   'Ms. Sarah Johnson',
  },
  {
    id:          3,
    name:        'Writing Task 2 - Opinion Essay',
    category:    'Writing',
    duration:    '40 min',
    createdDate: 'Apr 12, 2026',
    createdBy:   'Mr. David Chen',
  },
  {
    id:          4,
    name:        'IELTS Speaking Part 1 & 2',
    category:    'Speaking',
    duration:    '15 min',
    createdDate: 'Apr 18, 2026',
    createdBy:   'Ms. Sarah Johnson',
  },
]

// ─── Category badge style ─────────────────────────────────
const CATEGORY_STYLE: Record<ExamCategory, string> = {
  Listening: 'bg-violet-50 text-violet-700',
  Reading:   'bg-blue-50   text-blue-700',
  Writing:   'bg-green-50  text-green-700',
  Speaking:  'bg-orange-50 text-orange-700',
}

const HEADERS = ['Exam Name', 'Category', 'Duration', 'Created Date', 'Created By']

// ─── Component ────────────────────────────────────────────
export function ExamSchedule() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Exam schedule</h3>
        <button
          onClick={() => navigate('/exams')}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[580px]">
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {EXAMS.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/exams/${item.id}`)}
              >
                {/* Exam Name */}
                <td className="px-5 py-3.5 text-sm font-medium text-gray-800">
                  {item.name}
                </td>

                {/* Category badge */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_STYLE[item.category]}`}>
                    {item.category}
                  </span>
                </td>

                {/* Duration */}
                <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                  {item.duration}
                </td>

                {/* Created Date */}
                <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                  {item.createdDate}
                </td>

                {/* Created By */}
                <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                  {item.createdBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}