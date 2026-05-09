import React, { useState, useCallback } from 'react'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ExamHeader } from './ExamHeader'
import { SubmitModal } from './ExamModal'

type Props = {
  duration: number   // minutes
}

const PARTS = [
  { key: '1', label: 'Part 1' },
  { key: '2', label: 'Part 2' },
]

const MIN_WORDS: Record<string, number> = {
  '1': 150,
  '2': 250,
}

export function WritingExam({ duration }: Props) {
  const navigate = useNavigate()

  const [activePart, setActivePart] = useState('1')
  const [showSubmit, setShowSubmit] = useState(false)
  const [answers, setAnswers]       = useState<Record<string, string>>({ '1': '', '2': '' })

  function handleSubmit() {
    navigate('/exams')
  }

  const handleSave = useCallback(() => {
    toast.success('Answers saved successfully')
  }, [])

  const wordCount = answers[activePart].trim()
    ? answers[activePart].trim().split(/\s+/).length
    : 0

  const minWords  = MIN_WORDS[activePart]
  const isEnough  = wordCount >= minWords

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

        {/* Right — plain text editor */}
        <div className="w-1/2 bg-white flex flex-col">

          {/* Word count bar */}
          <div className="border-b border-gray-200 px-5 py-2.5 flex items-center justify-between bg-gray-50 flex-shrink-0">
            <span className="text-xs text-gray-400">
              Type your answer below. Press <kbd className="px-1 py-0.5 text-[10px] bg-gray-200 rounded">Enter</kbd> twice to start a new paragraph.
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
              Words:{' '}
              <strong className={isEnough ? 'text-green-600' : 'text-orange-500'}>
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
            spellCheck
            className="flex-1 w-full px-6 py-5 resize-none focus:outline-none
                       text-gray-800 text-[15px] leading-7 font-normal
                       placeholder:text-gray-300"
            placeholder={`Start writing your Task ${activePart} response here…\n\nTip: Press Enter twice to create a new paragraph (e.g. Overview, Body 1, Body 2, Conclusion).`}
          />

          {/* Bottom hint */}
          <div className="border-t border-gray-100 px-5 py-2 bg-gray-50 flex-shrink-0">
            <p className="text-[11px] text-gray-400">
              Your text is saved as plain text. Paragraphs are separated by blank lines and will display correctly when reviewed.
            </p>
          </div>
        </div>
      </main>

      {/* Submit modal only — no fullscreen modal */}
      <SubmitModal
        open={showSubmit}
        onCancel={() => setShowSubmit(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ── Prompt components ─────────────────────────────────────────────────────────

function WritingPart1() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Writing Task 1</h2>
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
        You should spend about 20 minutes on this task.
      </div>
      <p className="text-gray-800 text-base leading-relaxed">
        The chart below shows the number of men and women in further education in Britain
        in three periods and whether they were studying full-time or part-time.
      </p>
      <p className="text-gray-800 font-medium text-sm">
        Summarise the information by selecting and reporting the main features,
        and make comparisons where relevant.
      </p>
      <p className="text-gray-500 text-sm">Write at least 150 words.</p>
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
        Some people believe that unpaid community service should be a compulsory part
        of high school programmes (for example working for a charity, improving the
        neighbourhood or teaching sports to younger children).
      </p>
      <p className="text-gray-800 font-medium">To what extent do you agree or disagree?</p>
      <p className="text-gray-500 text-sm">
        Give reasons for your answer and include any relevant examples from your own
        knowledge or experience.
      </p>
      <p className="text-gray-500 text-sm">Write at least 250 words.</p>
    </div>
  )
}