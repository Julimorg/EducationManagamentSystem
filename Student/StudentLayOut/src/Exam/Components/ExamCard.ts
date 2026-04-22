import React from 'react'
import { ClockIcon, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
export type ExamStatus = 'Pending' | 'Submitted' | 'Graded'
export type ExamType = 'Listening' | 'Reading' | 'Writing'
export type Exam = {
  id: string
  name: string
  dateCreated: string
  createdBy: string
  duration: number
  status: ExamStatus
  examType: ExamType
  participants: number
  score?: number
  maxScore?: number
}
type ExamCardProps = {
  exam: Exam
}
export function ExamCard({ exam }: ExamCardProps) {
  const getStatusStyles = (status: ExamStatus) => {
    switch (status) {
      case 'Pending':
        return 'text-orange-700 border-orange-200 bg-orange-50'
      case 'Submitted':
        return 'text-green-700 border-green-200 bg-green-50'
      case 'Graded':
        return 'text-blue-700 border-blue-200 bg-blue-50'
    }
  }
  const getExamTypeColor = (type: ExamType) => {
    switch (type) {
      case 'Listening':
        return 'bg-purple-50 text-purple-700'
      case 'Reading':
        return 'bg-blue-50 text-blue-700'
      case 'Writing':
        return 'bg-green-50 text-green-700'
    }
  }
  return (
    <Link
      to={`/exams/${exam.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {exam.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Created {exam.dateCreated}</span>
            <span>•</span>
            <span>by {exam.createdBy}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(exam.status)}`}
          >
            {exam.status}
          </span>
          {exam.status === 'Graded' && exam.score !== undefined && (
            <span className="text-lg font-bold text-blue-600">
              {exam.score}/{exam.maxScore}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4" />
          <span>{exam.duration} minutes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <UsersIcon className="w-4 h-4" />
          <span>{exam.participants} participants</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium ${getExamTypeColor(exam.examType)}`}
        >
          {exam.examType} Test
        </span>
      </div>
    </Link>
  )
}
