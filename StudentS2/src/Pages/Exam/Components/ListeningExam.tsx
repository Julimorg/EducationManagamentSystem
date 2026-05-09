import React, { useState, useRef, useCallback } from 'react'
import { useNavigate }    from 'react-router-dom'
import { Play, Pause, Volume2 }    from 'lucide-react'
import { toast } from 'react-toastify'
import { Toaster } from 'sonner'
import { ExamHeader } from './ExamHeader'
import { SubmitModal } from './ExamModal'

// ─── Types ────────────────────────────────────────────────
type FillQuestion = {
  id:      number
  label:   string
  prefix?: string
}

type MCQuestion2 = {
  id:      number
  text:    string
  options: { label: string; text: string }[]
}

type QuestionGroup =
  | { type: 'form'; id: string; title: string; instruction: string; formTitle: string; questions: FillQuestion[] }
  | { type: 'mc';   id: string; title: string; instruction: string; questions: MCQuestion2[] }

type Section = {
  key:         string
  label:       string
  audioSrc?:   string
  description: string
  example?:    { label: string; answer: string }
  groups:      QuestionGroup[]
}

// ─── Mock data ────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    key:         '1',
    label:       'Section 1',
    description: 'Listen to the audio and answer questions 1–10. You will hear a telephone conversation between a customer and an agent at a car rental company.',
    example:     { label: "Customer's name", answer: 'John Smith' },
    groups: [
      {
        type:        'form',
        id:          's1g1',
        title:       'Questions 1–5',
        instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        formTitle:   'Car Rental Booking Form',
        questions: [
          { id: 1, label: 'Pick-up date'    },
          { id: 2, label: 'Car type'         },
          { id: 3, label: 'Extra features',  prefix: 'GPS and' },
          { id: 4, label: 'Duration'         },
          { id: 5, label: 'Total cost',      prefix: '$' },
        ],
      },
      {
        type:        'mc',
        id:          's1g2',
        title:       'Questions 6–8',
        instruction: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id:   6,
            text: 'The customer wants to pick up the car from:',
            options: [
              { label: 'A', text: 'The city centre branch' },
              { label: 'B', text: 'The airport branch' },
              { label: 'C', text: 'The train station branch' },
            ],
          },
          {
            id:   7,
            text: 'What additional insurance does the customer choose?',
            options: [
              { label: 'A', text: 'Basic cover only' },
              { label: 'B', text: 'Full comprehensive' },
              { label: 'C', text: 'Third-party liability' },
            ],
          },
          {
            id:   8,
            text: 'How will the customer pay?',
            options: [
              { label: 'A', text: 'Cash on collection' },
              { label: 'B', text: 'Online bank transfer' },
              { label: 'C', text: 'Credit card' },
            ],
          },
        ],
      },
    ],
  },
  {
    key:         '2',
    label:       'Section 2',
    description: 'Listen to a talk about a local community centre. Answer questions 11–20.',
    groups: [
      {
        type:        'mc',
        id:          's2g1',
        title:       'Questions 11–13',
        instruction: 'Choose the correct letter, A, B or C.',
        questions: [
          {
            id:   11,
            text: 'When was the community centre founded?',
            options: [
              { label: 'A', text: '1985' },
              { label: 'B', text: '1992' },
              { label: 'C', text: '2001' },
            ],
          },
          {
            id:   12,
            text: 'How many members does the centre currently have?',
            options: [
              { label: 'A', text: 'Over 500' },
              { label: 'B', text: 'Around 300' },
              { label: 'C', text: 'Exactly 450' },
            ],
          },
        ],
      },
    ],
  },
]

const SECTION_TABS = SECTIONS.map((s) => ({ key: s.key, label: s.label }))

// ─── Component ────────────────────────────────────────────
type Answers = Record<number, string>

export function ListeningExam({ duration = 30 }: { duration?: number }) {
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('1')
  const [answers, setAnswers]             = useState<Answers>({})
  const [isPlaying, setIsPlaying]         = useState(false)
  const [volume, setVolume]               = useState(80)
  const [showSubmit, setShowSubmit]       = useState(false)
  const audioRef                          = useRef<HTMLAudioElement>(null)

  const section = SECTIONS.find((s) => s.key === activeSection)!

  function togglePlay() {
    if (!audioRef.current) { setIsPlaying((v) => !v); return }
    if (isPlaying) { audioRef.current.pause() }
    else           { audioRef.current.play()  }
    setIsPlaying((v) => !v)
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v / 100
  }

  function handleAnswer(qId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSave = useCallback(() => toast.success('Answers saved'), [])

  function handleSubmit() {
    navigate('/exams')
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Toaster position="top-center" />

      {section.audioSrc && (
        <audio ref={audioRef} src={section.audioSrc} onEnded={() => setIsPlaying(false)} />
      )}

      <ExamHeader
        title="Listening Exam"
        parts={SECTION_TABS}
        activePart={activeSection}
        onChangePart={(key) => { setActiveSection(key); setIsPlaying(false) }}
        duration={duration}
        onSave={handleSave}
        onSubmit={() => setShowSubmit(true)}
        onTimeUp={() => setShowSubmit(true)}
      />

      {/* Audio control bar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center gap-3 px-5 flex-shrink-0">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-colors flex-shrink-0"
        >
          {isPlaying
            ? <Pause className="w-4 h-4 fill-white" />
            : <Play  className="w-4 h-4 fill-white" />}
        </button>
        <span className="text-xs text-gray-500 font-medium">
          Audio Track — {section.label}
        </span>

        <span className="ml-auto text-xs text-gray-400">Do not refresh the page</span>

        <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolume}
          className="w-24 accent-orange-500"
        />
      </div>

      {/* Split body */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left — section info + example */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 px-8 py-6 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{section.label}</h2>

          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800 leading-relaxed mb-5">
            {section.description}
          </div>

          {section.example && (
            <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              <p className="text-xs font-bold text-gray-700 mb-2">Example</p>
              <p className="text-xs text-gray-500">
                {section.example.label}:{' '}
                <span className="font-bold text-gray-800 underline">
                  {section.example.answer}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Right — question groups */}
        <div className="w-1/2 overflow-y-auto px-5 py-5 bg-gray-50 space-y-4">
          {section.groups.map((group) =>
            group.type === 'form' ? (
              <FormGroup key={group.id} group={group} answers={answers} onAnswer={handleAnswer} />
            ) : (
              <MCGroup key={group.id} group={group} answers={answers} onAnswer={handleAnswer} />
            ),
          )}
        </div>
      </main>

      <SubmitModal
        open={showSubmit}
        onCancel={() => setShowSubmit(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ─── FormGroup ────────────────────────────────────────────
function FormGroup({
  group, answers, onAnswer,
}: {
  group:    Extract<QuestionGroup, { type: 'form' }>
  answers:  Answers
  onAnswer: (id: number, v: string) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{group.title}</h3>
      <p className="text-xs text-gray-400 italic mb-4 leading-snug">{group.instruction}</p>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 py-2 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
          {group.formTitle}
        </div>
        <div className="divide-y divide-gray-100">
          {group.questions.map((q) => (
            <div key={q.id} className="grid grid-cols-[140px_1fr] items-center px-4 py-3 gap-3">
              <span className="text-xs text-gray-500">{q.label}</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <span className="font-semibold text-gray-500 flex-shrink-0">{q.id}.</span>
                {q.prefix && <span>{q.prefix}</span>}
                <input
                  type="text"
                  value={answers[q.id] ?? ''}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                  className="flex-1 border-b-2 border-gray-300 focus:border-orange-400 outline-none px-1 py-0.5 bg-transparent text-xs text-gray-900"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MCGroup ──────────────────────────────────────────────
function MCGroup({
  group, answers, onAnswer,
}: {
  group:    Extract<QuestionGroup, { type: 'mc' }>
  answers:  Answers
  onAnswer: (id: number, v: string) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{group.title}</h3>
      <p className="text-xs text-gray-400 italic mb-4 leading-snug">{group.instruction}</p>

      <div className="space-y-5">
        {group.questions.map((q) => (
          <div key={q.id}>
            <p className="text-xs font-medium text-gray-800 mb-2">
              <span className="text-gray-400 mr-1">{q.id}.</span>
              {q.text}
            </p>
            <div className="space-y-1.5">
              {q.options.map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    answers[q.id] === opt.label
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt.label}
                    checked={answers[q.id] === opt.label}
                    onChange={() => onAnswer(q.id, opt.label)}
                    className="mt-0.5 accent-orange-500 flex-shrink-0"
                  />
                  <span className="text-gray-700">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}