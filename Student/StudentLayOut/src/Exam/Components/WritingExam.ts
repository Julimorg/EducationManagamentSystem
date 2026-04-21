import React, { useState, useRef } from 'react'
import { ExamTimer } from './ExamTimer'
import { SaveIcon, SendIcon, AlertCircleIcon } from 'lucide-react'
import { Toaster, toast } from 'sonner'
type WritingExamProps = {
  duration: number
  onSubmit: () => void
}
export function WritingExam({ duration, onSubmit }: WritingExamProps) {
  const [activePart, setActivePart] = useState<1 | 2>(1)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  // Simple state for answers
  const [answers, setAnswers] = useState({
    1: '',
    2: '',
  })
  const handleSave = () => {
    toast.success('Answers saved successfully')
  }
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers((prev) => ({
      ...prev,
      [activePart]: e.target.value,
    }))
  }
  const wordCount = answers[activePart].trim()
    ? answers[activePart].trim().split(/\s+/).length
    : 0
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Writing Exam</h1>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActivePart(1)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Part 1
            </button>
            <button
              onClick={() => setActivePart(2)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activePart === 2 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Part 2
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ExamTimer durationMinutes={duration} onTimeUp={onSubmit} />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <SaveIcon className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 font-medium transition-colors"
          >
            <SendIcon className="w-4 h-4" />
            Submit
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Prompt */}
        <div className="w-1/2 bg-[#F9FAFB] border-r border-gray-200 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            {activePart === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Writing Task 1
                </h2>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm">
                  You should spend about 20 minutes on this task.
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  The chart below shows the number of men and women in further
                  education in Britain in three periods and whether they were
                  studying full-time or part-time.
                </p>
                <p className="text-gray-800 font-medium">
                  Summarise the information by selecting and reporting the main
                  features, and make comparisons where relevant.
                </p>
                <p className="text-gray-600 text-sm">
                  Write at least 150 words.
                </p>

                <div className="mt-8 border border-gray-200 rounded-lg bg-white p-4 flex items-center justify-center min-h-[300px]">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500"
                    alt="Mock Bar Chart"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Writing Task 2
                </h2>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm">
                  You should spend about 40 minutes on this task.
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  Some people believe that unpaid community service should be a
                  compulsory part of high school programmes (for example working
                  for a charity, improving the neighbourhood or teaching sports
                  to younger children).
                </p>
                <p className="text-gray-800 font-medium">
                  To what extent do you agree or disagree?
                </p>
                <p className="text-gray-600 text-sm">
                  Give reasons for your answer and include any relevant examples
                  from your own knowledge or experience.
                </p>
                <p className="text-gray-600 text-sm">
                  Write at least 250 words.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="w-1/2 bg-white flex flex-col">
          <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
            {/* Simple mock toolbar */}
            <button className="p-2 hover:bg-gray-200 rounded text-gray-700 font-bold">
              B
            </button>
            <button className="p-2 hover:bg-gray-200 rounded text-gray-700 italic">
              I
            </button>
            <button className="p-2 hover:bg-gray-200 rounded text-gray-700 underline">
              U
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <span className="text-sm text-gray-500 ml-auto mr-4">
              Word count:{' '}
              <strong
                className={
                  wordCount < (activePart === 1 ? 150 : 250)
                    ? 'text-orange-600'
                    : 'text-green-600'
                }
              >
                {wordCount}
              </strong>
            </span>
          </div>
          <textarea
            value={answers[activePart]}
            onChange={handleTextChange}
            className="flex-1 w-full p-6 resize-none focus:outline-none text-gray-800 text-lg leading-relaxed"
            placeholder="Start typing your answer here..."
          />
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircleIcon className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">Submit Exam?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You will not be able to
              change your answers after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
