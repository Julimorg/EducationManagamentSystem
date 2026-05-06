import { useFullscreenGuard } from '@/Hook/useFullScreenGuard';
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ExamHeader } from './ExamHeader';
import { SubmitModal, FullscreenModal } from './ExamModal';
import { Toaster } from 'sonner';

// ─── Types ────────────────────────────────────────────────
type QuestionType = 'multiple_choice' | 'fill_blank'

type MCOption = { label: string; text: string }

type Question = {
  id:      number
  type:    QuestionType
  text:    string
  options?: MCOption[]          // multiple_choice
  prefix?: string               // fill_blank — text before input
  suffix?: string               // fill_blank — text after input
}

type QuestionGroup = {
  id:           string
  title:        string
  instruction:  string
  questions:    Question[]
}

type Passage = {
  key:      string
  label:    string
  title:    string
  paragraphs: { label: string; text: string }[]
  groups:   QuestionGroup[]
}

// ─── Mock data ────────────────────────────────────────────
const PASSAGES: Passage[] = [
  {
    key:   '1',
    label: 'Passage 1',
    title: 'The Future of Urban Agriculture',
    paragraphs: [
      { label: 'A', text: 'As the world\'s population continues to urbanize, the challenge of feeding cities has become increasingly pressing. Traditional agriculture, which relies on vast tracts of rural land, is facing unprecedented pressures from climate change, soil degradation, and water scarcity. In response, a new paradigm is emerging: urban agriculture. This approach brings food production directly into the heart of our cities, utilizing rooftops, abandoned buildings, and even underground bunkers.' },
      { label: 'B', text: 'One of the most promising developments in this field is vertical farming. By stacking crops in vertically inclined surfaces or integrating them into other structures, vertical farms can produce significantly more food per square meter than traditional farming methods. These facilities often employ hydroponic or aeroponic systems, which use nutrient-rich water solutions instead of soil. This not only conserves water—using up to 95% less than conventional agriculture—but also eliminates the need for harmful pesticides.' },
      { label: 'C', text: 'However, the transition to urban agriculture is not without its hurdles. The initial capital required to set up a high-tech vertical farm can be prohibitive. Specialized LED lighting, climate control systems, and automated nutrient delivery mechanisms demand significant investment. Furthermore, the energy consumption of these facilities, particularly for lighting, remains a major concern, potentially offsetting the environmental benefits if the energy is not sourced renewably.' },
    ],
    groups: [
      {
        id:          'g1',
        title:       'Questions 1–3',
        instruction: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id:   1,
            type: 'multiple_choice',
            text: 'According to paragraph B, vertical farming uses less water because:',
            options: [
              { label: 'A', text: 'It relies on rainfall' },
              { label: 'B', text: 'It uses nutrient-rich water solutions instead of soil' },
              { label: 'C', text: 'It only grows drought-resistant crops' },
              { label: 'D', text: 'It recycles water from urban waste' },
            ],
          },
          {
            id:   2,
            type: 'multiple_choice',
            text: 'What is the main challenge mentioned in paragraph C?',
            options: [
              { label: 'A', text: 'Lack of skilled workers' },
              { label: 'B', text: 'High initial capital cost' },
              { label: 'C', text: 'Limited crop variety' },
              { label: 'D', text: 'Water availability' },
            ],
          },
          {
            id:   3,
            type: 'multiple_choice',
            text: 'The phrase "unprecedented pressures" in paragraph A suggests the challenges are:',
            options: [
              { label: 'A', text: 'Well-documented and expected' },
              { label: 'B', text: 'New and had not occurred before at this scale' },
              { label: 'C', text: 'Easily manageable with current technology' },
              { label: 'D', text: 'Limited to developing countries' },
            ],
          },
        ],
      },
      {
        id:          'g2',
        title:       'Questions 4–6',
        instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        questions: [
          {
            id:     4,
            type:   'fill_blank',
            text:   '',
            prefix: 'The high cost of setting up vertical farms is partly due to specialized',
            suffix: 'and climate control.',
          },
          {
            id:     5,
            type:   'fill_blank',
            text:   '',
            prefix: 'Vertical farming uses',
            suffix: 'instead of soil for nutrients.',
          },
          {
            id:     6,
            type:   'fill_blank',
            text:   '',
            prefix: 'Urban agriculture is seen as a response to',
            suffix: 'pressures.',
          },
        ],
      },
    ],
  },
  {
    key:   '2',
    label: 'Passage 2',
    title: 'Electroreception in Aquatic Animals',
    paragraphs: [
      { label: 'A', text: 'Open your eyes in sea water and it is difficult to see much more than a murky, bleary green colour. Sounds, too, are garbled and difficult to comprehend. Without specialised equipment humans would be lost in these deep-sea habitats, so how do fish make it seem so easy? Much of this is due to a biological phenomenon known as electroreception—the ability to perceive and act upon electrical stimuli as part of the overall senses.' },
      { label: 'B', text: 'Electroreception comes in two variants. While all animals (including humans) generate electric signals, because they are emitted by the nervous system, some animals have the ability—known as passive electroreception—to receive and decode electric signals generated by other animals in order to sense their location.' },
      { label: 'C', text: 'Other creatures can go further still, however. Animals with active electroreception possess bodily organs that generate special electric signals on cue. These can be used for mating signals and territorial displays as well as locating objects in the water.' },
    ],
    groups: [
      {
        id:          'g3',
        title:       'Questions 7–9',
        instruction: 'Choose the correct letter, A, B, C or D.',
        questions: [
          {
            id:   7,
            type: 'multiple_choice',
            text: 'The term "passive electroreception" refers to the ability to:',
            options: [
              { label: 'A', text: 'Generate electric signals' },
              { label: 'B', text: 'Receive and decode signals from other animals' },
              { label: 'C', text: 'See in murky water' },
              { label: 'D', text: 'Emit territorial displays' },
            ],
          },
          {
            id:   8,
            type: 'multiple_choice',
            text: 'According to paragraph C, active electroreception is used for:',
            options: [
              { label: 'A', text: 'Only mating purposes' },
              { label: 'B', text: 'Decoding human signals' },
              { label: 'C', text: 'Mating, territorial displays and locating objects' },
              { label: 'D', text: 'Filtering water' },
            ],
          },
          {
            id:   9,
            type: 'multiple_choice',
            text: 'Why is it difficult for humans to navigate deep-sea habitats without equipment?',
            options: [
              { label: 'A', text: 'Because of extreme cold temperatures' },
              { label: 'B', text: 'Because vision and hearing are limited underwater' },
              { label: 'C', text: 'Because of high water pressure' },
              { label: 'D', text: 'Because fish are territorial' },
            ],
          },
        ],
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────
const PASSAGE_TABS = PASSAGES.map((p) => ({ key: p.key, label: p.label }))

// ─── Component ────────────────────────────────────────────
type Answers = Record<number, string>

export function ReadingExam({ duration = 60 }: { duration?: number }) {
  const navigate = useNavigate()

  const [activePassage, setActivePassage]   = useState('1')
  const [answers, setAnswers]               = useState<Answers>({})
  const [showSubmit, setShowSubmit]         = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const { enterFullscreen, exitFullscreen } = useFullscreenGuard({
    onExit: () => setShowFullscreen(true),
  })

  const passage = PASSAGES.find((p) => p.key === activePassage)!

  function handleAnswer(qId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSave = useCallback(() => toast.success('Answers saved'), [])

  function handleSubmit() {
    exitFullscreen()
    navigate('/exams')
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Toaster position="top-center" />

      <ExamHeader
        title="Reading Exam"
        parts={PASSAGE_TABS}
        activePart={activePassage}
        onChangePart={setActivePassage}
        duration={duration}
        onSave={handleSave}
        onSubmit={() => setShowSubmit(true)}
        onTimeUp={() => setShowSubmit(true)}
      />

      {/* Split body */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left — passage */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 px-8 py-6 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{passage.title}</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {passage.paragraphs.map((para) => (
              <p key={para.label}>
                <span className="font-bold text-gray-900">{para.label}.</span>{' '}
                {para.text}
              </p>
            ))}
          </div>
        </div>

        {/* Right — questions */}
        <div className="w-1/2 overflow-y-auto px-5 py-5 bg-gray-50 space-y-4">
          {passage.groups.map((group) => (
            <QuestionGroupCard
              key={group.id}
              group={group}
              answers={answers}
              onAnswer={handleAnswer}
            />
          ))}
        </div>
      </main>

      <SubmitModal
        open={showSubmit}
        onCancel={() => setShowSubmit(false)}
        onSubmit={handleSubmit}
      />
      <FullscreenModal
        open={showFullscreen}
        onReturnFullscreen={() => { setShowFullscreen(false); enterFullscreen() }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ─── QuestionGroupCard ────────────────────────────────────
function QuestionGroupCard({
  group, answers, onAnswer,
}: {
  group:    QuestionGroup
  answers:  Answers
  onAnswer: (id: number, val: string) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{group.title}</h3>
      <p className="text-xs text-gray-400 italic mb-4 leading-snug">{group.instruction}</p>

      <div className="space-y-5">
        {group.questions.map((q) =>
          q.type === 'multiple_choice' ? (
            <MCQuestion key={q.id} q={q} selected={answers[q.id] ?? ''} onSelect={(v) => onAnswer(q.id, v)} />
          ) : (
            <FillBlankQuestion key={q.id} q={q} value={answers[q.id] ?? ''} onChange={(v) => onAnswer(q.id, v)} />
          ),
        )}
      </div>
    </div>
  )
}

// ── Multiple choice ──
function MCQuestion({
  q, selected, onSelect,
}: { q: Question; selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-800 mb-2.5 leading-snug">
        <span className="text-gray-400 mr-1">{q.id}.</span>
        {q.text}
      </p>
      <div className="space-y-1.5">
        {q.options?.map((opt) => (
          <label
            key={opt.label}
            className={`flex items-start gap-2.5 text-xs cursor-pointer px-3 py-2 rounded-lg transition-colors ${
              selected === opt.label ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt.label}
              checked={selected === opt.label}
              onChange={() => onSelect(opt.label)}
              className="mt-0.5 accent-orange-500 flex-shrink-0"
            />
            <span className="text-gray-700 leading-relaxed">{opt.text}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ── Fill blank ──
function FillBlankQuestion({
  q, value, onChange,
}: { q: Question; value: string; onChange: (v: string) => void }) {
  return (
    <div className="text-xs text-gray-700 leading-relaxed flex flex-wrap items-center gap-1.5">
      <span className="font-semibold text-gray-500">{q.id}.</span>
      {q.prefix && <span>{q.prefix}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b-2 border-gray-300 focus:border-orange-400 outline-none px-1 py-0.5 min-w-[100px] text-gray-900 bg-transparent text-xs"
        placeholder="answer"
      />
      {q.suffix && <span>{q.suffix}</span>}
    </div>
  )
}