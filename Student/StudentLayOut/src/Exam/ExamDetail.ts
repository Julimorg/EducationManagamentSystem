import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import {
  ClockIcon,
  UsersIcon,
  BookOpenIcon,
  HeadphonesIcon,
  PenToolIcon,
  ArrowLeftIcon,
  ZapIcon,
  RotateCcwIcon,
} from 'lucide-react'
type ExamStatus = 'Pending' | 'Submitted' | 'Graded'
type ExamType = 'Listening' | 'Reading' | 'Writing'
type SkillRow = {
  skill: ExamType
  duration: number
  totalQuestions: number
  answeredQuestions: number
  status: ExamStatus
  correctAnswers: number
  score: string
}
type ExamDetailData = {
  id: string
  name: string
  dateCreated: string
  createdBy: string
  participants: number
  skillRows: SkillRow[]
}
const examDetails: Record<string, ExamDetailData> = {
  '1': {
    id: '1',
    name: 'IELTS Listening Practice Test 1',
    dateCreated: '10:30 · 15/04/2026',
    createdBy: 'Mr. Tran Long',
    participants: 0,
    skillRows: [
      {
        skill: 'Listening',
        duration: 30,
        totalQuestions: 40,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Academic Reading Module - Part A',
    dateCreated: '14:00 · 14/04/2026',
    createdBy: 'Ms. Sarah Johnson',
    participants: 24,
    skillRows: [
      {
        skill: 'Reading',
        duration: 60,
        totalQuestions: 40,
        answeredQuestions: 35,
        status: 'Submitted',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Writing Task 2 - Opinion Essay',
    dateCreated: '09:15 · 12/04/2026',
    createdBy: 'Mr. David Chen',
    participants: 18,
    skillRows: [
      {
        skill: 'Writing',
        duration: 40,
        totalQuestions: 2,
        answeredQuestions: 2,
        status: 'Graded',
        correctAnswers: 2,
        score: '7.5',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Listening Section 1-4 Full Test',
    dateCreated: '11:00 · 11/04/2026',
    createdBy: 'Mr. Tran Long',
    participants: 22,
    skillRows: [
      {
        skill: 'Listening',
        duration: 30,
        totalQuestions: 40,
        answeredQuestions: 40,
        status: 'Graded',
        correctAnswers: 35,
        score: '8.0',
      },
    ],
  },
  '5': {
    id: '5',
    name: 'General Reading Practice',
    dateCreated: '16:45 · 10/04/2026',
    createdBy: 'Ms. Emily Watson',
    participants: 0,
    skillRows: [
      {
        skill: 'Reading',
        duration: 60,
        totalQuestions: 40,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  '6': {
    id: '6',
    name: 'Writing Task 1 - Graph Description',
    dateCreated: '08:30 · 09/04/2026',
    createdBy: 'Mr. David Chen',
    participants: 15,
    skillRows: [
      {
        skill: 'Writing',
        duration: 20,
        totalQuestions: 1,
        answeredQuestions: 1,
        status: 'Submitted',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  '7': {
    id: '7',
    name: 'Listening Mock Exam - Academic',
    dateCreated: '13:20 · 08/04/2026',
    createdBy: 'Mr. Tran Long',
    participants: 28,
    skillRows: [
      {
        skill: 'Listening',
        duration: 30,
        totalQuestions: 40,
        answeredQuestions: 40,
        status: 'Graded',
        correctAnswers: 28,
        score: '6.5',
      },
    ],
  },
  '8': {
    id: '8',
    name: 'Reading Comprehension Test 3',
    dateCreated: '15:00 · 07/04/2026',
    createdBy: 'Ms. Sarah Johnson',
    participants: 0,
    skillRows: [
      {
        skill: 'Reading',
        duration: 45,
        totalQuestions: 40,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
}
function getSkillIcon(skill: ExamType) {
  switch (skill) {
    case 'Listening':
      return <HeadphonesIcon className="w-7 h-7" />
    case 'Reading':
      return <BookOpenIcon className="w-7 h-7" />
    case 'Writing':
      return <PenToolIcon className="w-7 h-7" />
  }
}
function getSkillColor(skill: ExamType) {
  switch (skill) {
    case 'Listening':
      return 'bg-purple-100 text-purple-600'
    case 'Reading':
      return 'bg-emerald-100 text-emerald-600'
    case 'Writing':
      return 'bg-blue-100 text-blue-600'
  }
}
function getStatusBadge(status: ExamStatus) {
  switch (status) {
    case 'Pending':
      return 'text-orange-700 bg-orange-50'
    case 'Submitted':
      return 'text-green-700 bg-green-50'
    case 'Graded':
      return 'text-blue-700 bg-blue-50'
  }
}
export function ExamDetail() {
  const { id } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const exam = examDetails[id || '1'] || examDetails['1']
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title="Exam Detail"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back link */}
            <Link
              to="/exams"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
              Back to Exams
            </Link>

            {/* Exam Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {exam.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4" />
                  <span>Posted: {exam.dateCreated}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="w-4 h-4" />
                  <span>{exam.participants} Participants</span>
                </div>
                <span>by {exam.createdBy}</span>
              </div>
            </div>

            {/* Skill Test Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Skill Test
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Thời gian làm
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Số Câu làm
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Trạng thái làm
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Số câu đúng
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Score
                      </th>
                      <th className="px-4 py-4 border-r border-gray-200 whitespace-nowrap">
                        Attempt
                      </th>
                      <th className="px-4 py-4 whitespace-nowrap">
                        Attempt Again
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.skillRows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-4 py-6 border-r border-gray-200">
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center ${getSkillColor(row.skill)}`}
                            >
                              {getSkillIcon(row.skill)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {row.skill}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200 text-gray-700">
                          {row.duration} Phút
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200 text-blue-600 font-medium">
                          {row.answeredQuestions}/{row.totalQuestions}
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200 text-blue-600 font-medium">
                          {row.correctAnswers}/{row.totalQuestions}
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200 text-gray-700 font-medium">
                          {row.score}
                        </td>
                        <td className="px-4 py-6 border-r border-gray-200">
                          <button className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                            <ZapIcon className="w-4 h-4 mr-1.5 fill-current" />
                            Attempt
                          </button>
                        </td>
                        <td className="px-4 py-6">
                          {row.status === 'Graded' ? (
                            <button className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                              <RotateCcwIcon className="w-4 h-4 mr-1.5" />
                              Attempt Again
                            </button>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 text-gray-300 bg-gray-50 rounded-lg font-medium cursor-not-allowed"
                            >
                              <RotateCcwIcon className="w-4 h-4 mr-1.5" />
                              Attempt Again
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
