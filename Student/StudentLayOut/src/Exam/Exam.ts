import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { ExamCard } from '../components/ExamCard'
import { Pagination } from '../components/Pagination'
import { SearchIcon } from 'lucide-react'
type ExamStatus = 'Pending' | 'Submitted' | 'Graded'
type ExamType = 'Listening' | 'Reading' | 'Writing'
type Exam = {
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
const mockExams: Exam[] = [
  {
    id: '1',
    name: 'IELTS Listening Practice Test 1',
    dateCreated: 'Apr 15',
    createdBy: 'Mr. Tran Long',
    duration: 30,
    status: 'Pending',
    examType: 'Listening',
    participants: 0,
  },
  {
    id: '2',
    name: 'Academic Reading Module - Part A',
    dateCreated: 'Apr 14',
    createdBy: 'Ms. Sarah Johnson',
    duration: 60,
    status: 'Submitted',
    examType: 'Reading',
    participants: 24,
  },
  {
    id: '3',
    name: 'Writing Task 2 - Opinion Essay',
    dateCreated: 'Apr 12',
    createdBy: 'Mr. David Chen',
    duration: 40,
    status: 'Graded',
    examType: 'Writing',
    participants: 18,
    score: 7.5,
    maxScore: 9,
  },
  {
    id: '4',
    name: 'Listening Section 1-4 Full Test',
    dateCreated: 'Apr 11',
    createdBy: 'Mr. Tran Long',
    duration: 30,
    status: 'Graded',
    examType: 'Listening',
    participants: 22,
    score: 8,
    maxScore: 9,
  },
  {
    id: '5',
    name: 'General Reading Practice',
    dateCreated: 'Apr 10',
    createdBy: 'Ms. Emily Watson',
    duration: 60,
    status: 'Pending',
    examType: 'Reading',
    participants: 0,
  },
  {
    id: '6',
    name: 'Writing Task 1 - Graph Description',
    dateCreated: 'Apr 9',
    createdBy: 'Mr. David Chen',
    duration: 20,
    status: 'Submitted',
    examType: 'Writing',
    participants: 15,
  },
  {
    id: '7',
    name: 'Listening Mock Exam - Academic',
    dateCreated: 'Apr 8',
    createdBy: 'Mr. Tran Long',
    duration: 30,
    status: 'Graded',
    examType: 'Listening',
    participants: 28,
    score: 6.5,
    maxScore: 9,
  },
  {
    id: '8',
    name: 'Reading Comprehension Test 3',
    dateCreated: 'Apr 7',
    createdBy: 'Ms. Sarah Johnson',
    duration: 45,
    status: 'Pending',
    examType: 'Reading',
    participants: 0,
  },
]
type FilterType =
  | 'All'
  | 'Submitted'
  | 'Pending'
  | 'Listening'
  | 'Reading'
  | 'Writing'
export function Exams() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const filters: FilterType[] = [
    'All',
    'Submitted',
    'Pending',
    'Listening',
    'Reading',
    'Writing',
  ]
  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch = exam.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    if (activeFilter === 'All') return matchesSearch
    if (activeFilter === 'Submitted' || activeFilter === 'Pending') {
      return matchesSearch && exam.status === activeFilter
    }
    return matchesSearch && exam.examType === activeFilter
  })
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedExams = filteredExams.slice(
    startIndex,
    startIndex + itemsPerPage,
  )
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title="Exams"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter and Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Exam Cards */}
            <div className="space-y-4 mb-6">
              {paginatedExams.length > 0 ? (
                paginatedExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">
                    No exams found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
