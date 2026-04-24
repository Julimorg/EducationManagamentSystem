import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
type AssignmentsProps = {
  onSelectAssignment?: (id: string) => void
}
export function Assignments({ onSelectAssignment }: AssignmentsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Top Bar: Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white shadow-sm">
                  All
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  Pending
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  Submitted
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  Graded
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  Late
                </button>
              </div>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                  placeholder="Search assignments..."
                />
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {/* Card 1: Pending, Expanded */}
              <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectAssignment?.('1')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      IELTS Writing Task 2 — Essay Practice
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Writing · Band 6.5 Target · Posted by Ms. Sarah · Apr 15
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                      Pending
                    </span>
                    <div className="text-right mt-2">
                      <p className="text-xs text-gray-500">
                        Due: Apr 19, 23:59
                      </p>
                      <p className="text-xs font-semibold text-orange-600 mt-0.5">
                        24h remaining
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    Write a 250-word essay on the topic: Some people believe
                    that technology has made our lives more complex. To what
                    extent do you agree or disagree?
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      writing
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      task-2
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      opinion-essay
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download brief (PDF)
                  </button>
                  <button
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Submit assignment
                  </button>
                  <span className="text-xs text-gray-400 ml-2">
                    Multiple files allowed · Max 50MB each
                  </span>
                </div>
              </div>

              {/* Card 2: Submitted, Compact */}
              <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectAssignment?.('2')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      IELTS Listening Practice Test 4
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Listening · Band 7.0 Target · Posted Apr 14
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Submitted
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    Submitted Apr 16 at 14:32 · 2 files uploaded
                  </p>
                </div>
              </div>

              {/* Card 3: Graded, with feedback */}
              <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectAssignment?.('3')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      IELTS Reading — Academic Passage Analysis
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Reading · Band 7.0 Target · Posted Apr 10
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Graded
                    </span>
                    <div className="mt-2 text-right">
                      <span className="text-xl font-bold text-blue-600">
                        32 / 40
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-md p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Teacher Feedback
                  </h4>
                  <p className="text-sm text-gray-700">
                    Good skimming technique but needs improvement on matching
                    headings questions. Focus on identifying paraphrased
                    keywords in the passage.
                  </p>
                </div>
              </div>

              {/* Card 4: Pending */}
              <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectAssignment?.('4')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      IELTS Speaking Part 2 — Cue Card Recording
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Speaking · Band 6.5 Target · Posted Apr 17
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                      Pending
                    </span>
                    <div className="text-right mt-2">
                      <p className="text-xs text-gray-500">
                        Due: Apr 22, 18:00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    Record a 2-minute response to the cue card topic: Describe a
                    time when you helped someone.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      speaking
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      part-2
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-gray-50">
                      cue-card
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5: Late */}
              <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectAssignment?.('5')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Vocabulary Builder — Academic Word List Set 3
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Vocabulary · All Skills · Posted Apr 8
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      Late
                    </span>
                    <div className="text-right mt-2">
                      <p className="text-sm font-medium text-red-600">
                        Due was Apr 14 — Late
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
