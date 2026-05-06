import React, { useState, useCallback } from 'react'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useFullscreenGuard } from '@/Hook/useFullScreenGuard'
import { ExamHeader } from './ExamHeader'
import { SubmitModal, FullscreenModal } from './ExamModal'

type Props = {
  duration: number   // minutes
}

const PARTS = [
  { key: '1', label: 'Part 1' },
  { key: '2', label: 'Part 2' },
]

const MIN_WORDS = { '1': 150, '2': 250 }

export function WritingExam({ duration }: Props) {
  const navigate = useNavigate()

  const [activePart, setActivePart]         = useState('1')
  const [showSubmit, setShowSubmit]         = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [answers, setAnswers]               = useState<Record<string, string>>({ '1': '', '2': '' })

  // ── Fullscreen guard ──
  const { enterFullscreen, exitFullscreen } = useFullscreenGuard({
    onExit: () => setShowFullscreen(true),
  })

  function handleSubmit() {
    exitFullscreen()
    navigate('/exams')           // ← back to exam list after submit
  }

  const handleSave = useCallback(() => {
    toast.success('Answers saved successfully')
  }, [])

  const wordCount = answers[activePart].trim()
    ? answers[activePart].trim().split(/\s+/).length
    : 0

  const minWords = MIN_WORDS[activePart as '1' | '2']

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-center" />

      <ExamHeader
        title="Writing Exam"
        parts={PARTS}
        activePart={activePart}
        onChangePart={setActivePart}
        duration={duration}
        onSave={handleSave}
        onSubmit={() => setShowSubmit(true)}
        onTimeUp={() => setShowSubmit(true)}
      />

      {/* Split layout */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left — prompt */}
        <div className="w-1/2 bg-[#F9FAFB] border-r border-gray-200 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            {activePart === '1' ? <WritingPart1 /> : <WritingPart2 />}
          </div>
        </div>

        {/* Right — editor */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-1 bg-gray-50 flex-shrink-0">
            <ToolBtn label="B" className="font-bold" />
            <ToolBtn label="I" className="italic" />
            <ToolBtn label="U" className="underline" />
            <div className="w-px h-5 bg-gray-300 mx-2" />
            <span className="text-xs text-gray-500 ml-auto">
              Word count:{' '}
              <strong className={wordCount < minWords ? 'text-orange-500' : 'text-green-600'}>
                {wordCount}
              </strong>
              <span className="text-gray-400"> / {minWords} min</span>
            </span>
          </div>

          {/* Textarea */}
          <textarea
            value={answers[activePart]}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [activePart]: e.target.value }))
            }
            className="flex-1 w-full p-6 resize-none focus:outline-none text-gray-800 text-base leading-relaxed"
            placeholder="Start typing your answer here..."
          />
        </div>
      </main>

      {/* Modals */}
      <SubmitModal
        open={showSubmit}
        onCancel={() => setShowSubmit(false)}
        onSubmit={handleSubmit}
      />
      <FullscreenModal
        open={showFullscreen}
        onReturnFullscreen={() => {
          setShowFullscreen(false)
          enterFullscreen()
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────
function ToolBtn({ label, className = '' }: { label: string; className?: string }) {
  return (
    <button
      className={`p-1.5 px-2.5 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors ${className}`}
    >
      {label}
    </button>
  )
}

function WritingPart1() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Writing Task 1</h2>
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
        You should spend about 20 minutes on this task.
      </div>
      <p className="text-gray-800 text-base leading-relaxed">
        The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time.
      </p>
      <p className="text-gray-800 font-medium text-sm">
        Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
      </p>
      <p className="text-gray-500 text-sm">Write at least 150 words.</p>
      {/* Chart placeholder */}
      <div className="border border-gray-200 rounded-lg bg-white flex items-center justify-center min-h-[260px] text-gray-400 text-sm">
        📊 Chart image here
      </div>
    </div>
  )
}

function WritingPart2() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Writing Task 2</h2>
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
        You should spend about 40 minutes on this task.
      </div>
      <p className="text-gray-800 text-base leading-relaxed">
        Some people believe that unpaid community service should be a compulsory part of high school programmes (for example working for a charity, improving the neighbourhood or teaching sports to younger children).
      </p>
      <p className="text-gray-800 font-medium">To what extent do you agree or disagree?</p>
      <p className="text-gray-500 text-sm">
        Give reasons for your answer and include any relevant examples from your own knowledge or experience.
      </p>
      <p className="text-gray-500 text-sm">Write at least 250 words.</p>
    </div>
  )
}