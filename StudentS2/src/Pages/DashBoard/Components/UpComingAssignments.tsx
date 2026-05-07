import React from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────
type AssignmentStatus = 'pending' | 'in_progress' | 'submitted' | 'late' | 'not_started'

type Assignment = {
  id:          number
  name:        string
  category:    string
  createdDate: string
  status:      AssignmentStatus
  deadline:    string
}

// ─── Mock data ────────────────────────────────────────────
const ASSIGNMENTS: Assignment[] = [
  {
    id:          1,
    name:        'Essay on Photosynthesis',
    category:    'Biology',
    createdDate: 'Apr 14, 2026',
    status:      'pending',
    deadline:    'Apr 19, 23:59',
  },
  {
    id:          2,
    name:        'IELTS Writing Task 2',
    category:    'Writing',
    createdDate: 'Apr 15, 2026',
    status:      'in_progress',
    deadline:    'Apr 20, 23:59',
  },
  {
    id:          3,
    name:        'Literature Review',
    category:    'English',
    createdDate: 'Apr 16, 2026',
    status:      'not_started',
    deadline:    'Apr 22, 23:59',
  },
  {
    id:          4,
    name:        'Listening Practice Test 3',
    category:    'Listening',
    createdDate: 'Apr 17, 2026',
    status:      'late',
    deadline:    'Apr 18, 23:59',
  },
]

// ─── Status config ────────────────────────────────────────
const STATUS_MAP: Record<AssignmentStatus, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-orange-50 text-orange-600' },
  in_progress: { label: 'In Progress', className: 'bg-blue-50   text-blue-600'   },
  submitted:   { label: 'Submitted',   className: 'bg-green-50  text-green-600'  },
  late:        { label: 'Late',        className: 'bg-red-50    text-red-600'    },
  not_started: { label: 'Not Started', className: 'bg-gray-100  text-gray-500'   },
}

const HEADERS = ['Assignment Name', 'Category', 'Created Date', 'Status', 'Deadline']

// ─── Component ────────────────────────────────────────────
export function UpcomingAssignments() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming assignments</h3>
        <button
          onClick={() => navigate('/assignments')}
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
            {ASSIGNMENTS.map((item) => {
              const { label, className } = STATUS_MAP[item.status]
              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/assignments/${item.id}`)}
                >
                  {/* Assignment Name */}
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {item.name}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {item.category}
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                    {item.createdDate}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
                      {label}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                    {item.deadline}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}