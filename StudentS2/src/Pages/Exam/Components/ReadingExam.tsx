import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Toaster } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ExamHeader } from './ExamHeader'
import { SubmitModal } from './ExamModal'

// ─── Types ────────────────────────────────────────────────
type QuestionType = 'multiple_choice' | 'fill_blank'
type MCOption     = { label: string; text: string }

type Question = {
  id:       number
  type:     QuestionType
  text:     string
  options?: MCOption[]
  prefix?:  string
  suffix?:  string
}

type QuestionGroup = {
  id:          string
  title:       string
  instruction: string
  questions:   Question[]
}

type Passage = {
  key:        string
  label:      string
  title:      string
  paragraphs: { label: string; text: string }[]
  groups:     QuestionGroup[]
  // question range for the nav bar
  qStart:     number
  qEnd:       number
}

// ─── Mock data ────────────────────────────────────────────
const PASSAGES: Passage[] = [
  {
    key:    '1',
    label:  'Part 1',
    title:  'The Future of Urban Agriculture',
    qStart: 1,
    qEnd:   13,
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
          { id: 1, type: 'multiple_choice', text: 'According to paragraph B, vertical farming uses less water because:', options: [{ label: 'A', text: 'It relies on rainfall' }, { label: 'B', text: 'It uses nutrient-rich water solutions instead of soil' }, { label: 'C', text: 'It only grows drought-resistant crops' }, { label: 'D', text: 'It recycles water from urban waste' }] },
          { id: 2, type: 'multiple_choice', text: 'What is the main challenge mentioned in paragraph C?', options: [{ label: 'A', text: 'Lack of skilled workers' }, { label: 'B', text: 'High initial capital cost' }, { label: 'C', text: 'Limited crop variety' }, { label: 'D', text: 'Water availability' }] },
          { id: 3, type: 'multiple_choice', text: 'The phrase "unprecedented pressures" in paragraph A suggests the challenges are:', options: [{ label: 'A', text: 'Well-documented and expected' }, { label: 'B', text: 'New and had not occurred before at this scale' }, { label: 'C', text: 'Easily manageable with current technology' }, { label: 'D', text: 'Limited to developing countries' }] },
        ],
      },
      {
        id:          'g2',
        title:       'Questions 4–6',
        instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
        questions: [
          { id: 4, type: 'fill_blank', text: '', prefix: 'The high cost of setting up vertical farms is partly due to specialized', suffix: 'and climate control.' },
          { id: 5, type: 'fill_blank', text: '', prefix: 'Vertical farming uses', suffix: 'instead of soil for nutrients.' },
          { id: 6, type: 'fill_blank', text: '', prefix: 'Urban agriculture is seen as a response to', suffix: 'pressures.' },
        ],
      },
      {
        id:          'g3',
        title:       'Questions 7–13',
        instruction: 'Do the following statements agree with the information? Write TRUE, FALSE or NOT GIVEN.',
        questions: [
          { id: 7,  type: 'multiple_choice', text: 'Vertical farms require less land than traditional farms.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 8,  type: 'multiple_choice', text: 'Hydroponic systems eliminate the use of pesticides entirely.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 9,  type: 'multiple_choice', text: 'Energy consumption is a significant drawback of vertical farming.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 10, type: 'multiple_choice', text: 'Urban farms have already replaced rural agriculture in most cities.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 11, type: 'multiple_choice', text: 'The use of renewable energy can offset the environmental cost of vertical farming.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 12, type: 'multiple_choice', text: 'Soil degradation is one reason traditional agriculture is under pressure.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 13, type: 'multiple_choice', text: 'Urban agriculture has been widely adopted by governments globally.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
        ],
      },
    ],
  },
  {
    key:    '2',
    label:  'Part 2',
    title:  'Electroreception in Aquatic Animals',
    qStart: 14,
    qEnd:   27,
    paragraphs: [
      { label: 'A', text: 'Open your eyes in sea water and it is difficult to see much more than a murky, bleary green colour. Sounds, too, are garbled and difficult to comprehend. Without specialised equipment humans would be lost in these deep-sea habitats, so how do fish make it seem so easy? Much of this is due to a biological phenomenon known as electroreception—the ability to perceive and act upon electrical stimuli as part of the overall senses.' },
      { label: 'B', text: 'Electroreception comes in two variants. While all animals (including humans) generate electric signals, because they are emitted by the nervous system, some animals have the ability—known as passive electroreception—to receive and decode electric signals generated by other animals in order to sense their location.' },
      { label: 'C', text: 'Other creatures can go further still, however. Animals with active electroreception possess bodily organs that generate special electric signals on cue. These can be used for mating signals and territorial displays as well as locating objects in the water.' },
    ],
    groups: [
      {
        id:          'g4',
        title:       'Questions 14–16',
        instruction: 'Choose the correct letter, A, B, C or D.',
        questions: [
          { id: 14, type: 'multiple_choice', text: 'The term "passive electroreception" refers to the ability to:', options: [{ label: 'A', text: 'Generate electric signals' }, { label: 'B', text: 'Receive and decode signals from other animals' }, { label: 'C', text: 'See in murky water' }, { label: 'D', text: 'Emit territorial displays' }] },
          { id: 15, type: 'multiple_choice', text: 'According to paragraph C, active electroreception is used for:', options: [{ label: 'A', text: 'Only mating purposes' }, { label: 'B', text: 'Decoding human signals' }, { label: 'C', text: 'Mating, territorial displays and locating objects' }, { label: 'D', text: 'Filtering water' }] },
          { id: 16, type: 'multiple_choice', text: 'Why is it difficult for humans to navigate deep-sea habitats without equipment?', options: [{ label: 'A', text: 'Because of extreme cold temperatures' }, { label: 'B', text: 'Because vision and hearing are limited underwater' }, { label: 'C', text: 'Because of high water pressure' }, { label: 'D', text: 'Because fish are territorial' }] },
        ],
      },
      {
        id:          'g5',
        title:       'Questions 17–27',
        instruction: 'Complete the sentences. Write NO MORE THAN TWO WORDS for each answer.',
        questions: [
          { id: 17, type: 'fill_blank', text: '', prefix: 'Fish navigate murky waters using a sense called', suffix: '.' },
          { id: 18, type: 'fill_blank', text: '', prefix: 'All animals produce electric signals via the', suffix: '.' },
          { id: 19, type: 'fill_blank', text: '', prefix: 'Animals with active electroreception have special', suffix: 'that generate signals.' },
          { id: 20, type: 'multiple_choice', text: 'Which statement best describes passive electroreception?', options: [{ label: 'A', text: 'It involves generating signals' }, { label: 'B', text: 'It only works in fresh water' }, { label: 'C', text: 'It detects signals from other animals' }, { label: 'D', text: 'It is unique to mammals' }] },
          { id: 21, type: 'multiple_choice', text: 'Electroreception helps fish to:', options: [{ label: 'A', text: 'Breathe underwater' }, { label: 'B', text: 'Sense the location of other animals' }, { label: 'C', text: 'Change colour' }, { label: 'D', text: 'Communicate with humans' }] },
          { id: 22, type: 'multiple_choice', text: 'The opening paragraph mainly serves to:', options: [{ label: 'A', text: 'Criticise humans for poor underwater vision' }, { label: 'B', text: 'Compare fish intelligence to human intelligence' }, { label: 'C', text: 'Introduce the difficulty humans face and contrast with fish' }, { label: 'D', text: 'Explain the science of light underwater' }] },
          { id: 23, type: 'multiple_choice', text: 'Active electroreception differs from passive in that it:', options: [{ label: 'A', text: 'Only receives signals' }, { label: 'B', text: 'Generates its own electric signals' }, { label: 'C', text: 'Is found in land animals' }, { label: 'D', text: 'Requires specialised eyes' }] },
          { id: 24, type: 'fill_blank', text: '', prefix: 'Territorial displays by some fish are powered by', suffix: '.' },
          { id: 25, type: 'fill_blank', text: '', prefix: 'Electroreception is described as a biological', suffix: '.' },
          { id: 26, type: 'fill_blank', text: '', prefix: 'Without equipment, humans would be', suffix: 'in deep-sea habitats.' },
          { id: 27, type: 'fill_blank', text: '', prefix: 'Neutrinos can penetrate the human form', suffix: '.' },
        ],
      },
    ],
  },
  {
    key:    '3',
    label:  'Part 3',
    title:  'Time Travel',
    qStart: 28,
    qEnd:   40,
    paragraphs: [
      { label: 'A', text: 'Time travel took a small step away from science fiction and toward science recently when physicists discovered that sub-atomic particles known as neutrinos – progeny of the sun\'s radioactive debris – can exceed the speed of light. The unassuming particle – it is electrically neutral, small but with a "non-zero mass" and able to penetrate the human form undetected – is on its way to becoming a rock star of the scientific world.' },
      { label: 'B', text: 'Researchers from the European Organisation for Nuclear Research (CERN) in Geneva sent the neutrinos hurtling through an underground corridor toward their colleagues at the Oscillation Project with Emulsion-Tracing Apparatus (OPERA) team 730 kilometres away in Gran Sasso, Italy. The neutrinos arrived promptly – so promptly, in fact, that they triggered what scientists are calling the unthinkable – that everything they have learnt, known or taught stemming from the last one hundred years of the physics discipline may need to be reconsidered.' },
      { label: 'C', text: 'The issue at stake is a tiny segment of time – precisely sixty nanoseconds. This is how much faster than the speed of light the neutrinos managed to go in their underground travels and at a consistent rate. Even allowing for a margin of error of ten billionths of a second, this stands as proof that it is possible to race against light and win.' },
    ],
    groups: [
      {
        id:          'g6',
        title:       'Questions 28–33',
        instruction: 'Do the following statements agree with the information given in Reading Passage 3? Write TRUE, FALSE or NOT GIVEN.',
        questions: [
          { id: 28, type: 'multiple_choice', text: 'It is unclear where neutrinos come from.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 29, type: 'multiple_choice', text: 'Neutrinos can pass through a person\'s body without causing harm.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 30, type: 'multiple_choice', text: 'It took scientists between 50–70 nanoseconds to send the neutrinos from Geneva to Italy.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 31, type: 'multiple_choice', text: 'CERN is located in Italy.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 32, type: 'multiple_choice', text: 'The findings challenge over a century of physics knowledge.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
          { id: 33, type: 'multiple_choice', text: 'The neutrinos travelled faster than the speed of light consistently.', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }, { label: 'C', text: 'Not given' }] },
        ],
      },
      {
        id:          'g7',
        title:       'Questions 34–40',
        instruction: 'Complete the sentences. Write NO MORE THAN TWO WORDS for each answer.',
        questions: [
          { id: 34, type: 'fill_blank', text: '', prefix: 'Neutrinos are described as progeny of the sun\'s radioactive', suffix: '.' },
          { id: 35, type: 'fill_blank', text: '', prefix: 'The OPERA team was located in', suffix: ', Italy.' },
          { id: 36, type: 'fill_blank', text: '', prefix: 'Neutrinos arrived sixty nanoseconds', suffix: 'than the speed of light.' },
          { id: 37, type: 'fill_blank', text: '', prefix: 'The experiment allowed for a margin of error of ten', suffix: 'of a second.' },
          { id: 38, type: 'multiple_choice', text: 'What does the author mean by neutrinos becoming a "rock star"?', options: [{ label: 'A', text: 'They are loud and disruptive' }, { label: 'B', text: 'They are becoming very famous in science' }, { label: 'C', text: 'They travel like sound waves' }, { label: 'D', text: 'They are made of rock' }] },
          { id: 39, type: 'multiple_choice', text: 'Which word best describes the neutrino according to the passage?', options: [{ label: 'A', text: 'Massive' }, { label: 'B', text: 'Charged' }, { label: 'C', text: 'Undetectable' }, { label: 'D', text: 'Slow' }] },
          { id: 40, type: 'multiple_choice', text: 'The CERN experiment mainly shows that:', options: [{ label: 'A', text: 'Time travel is now possible' }, { label: 'B', text: 'Neutrinos are harmless' }, { label: 'C', text: 'Particles can exceed the speed of light' }, { label: 'D', text: 'Einstein\'s theory is correct' }] },
        ],
      },
    ],
  },
]

const PASSAGE_TABS = PASSAGES.map((p) => ({ key: p.key, label: p.label }))

// ─── Helpers ──────────────────────────────────────────────
// Flatten all questions across all groups of a passage
function allQIds(passage: Passage): number[] {
  return passage.groups.flatMap(g => g.questions.map(q => q.id))
}

// ─── Component ────────────────────────────────────────────
type Answers = Record<number, string>

export function ReadingExam({ duration = 60 }: { duration?: number }) {
  const navigate = useNavigate()

  const [activePassage, setActivePassage] = useState('1')
  const [answers, setAnswers]             = useState<Answers>({})
  const [showSubmit, setShowSubmit]       = useState(false)

  // Ref map: questionId → DOM element
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const passage = PASSAGES.find((p) => p.key === activePassage)!

  function handleAnswer(qId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSave = useCallback(() => toast.success('Answers saved'), [])

  function handleSubmit() {
    navigate('/exams')
  }

  // Scroll right panel to a question
  function scrollToQuestion(qId: number) {
    const el = questionRefs.current[qId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
            {passage.label}: READING PASSAGE
          </p>
          <p className="text-xs text-gray-500 mb-4">
            You should spend about 20 minutes on Questions {passage.qStart}–{passage.qEnd}.
          </p>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-5">{passage.title}</h2>
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
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
            {passage.label}:
          </p>
          {passage.groups.map((group) => (
            <QuestionGroupCard
              key={group.id}
              group={group}
              answers={answers}
              onAnswer={handleAnswer}
              questionRefs={questionRefs}
            />
          ))}
        </div>
      </main>

      {/* ── Question navigator bar ── */}
      <QuestionNavBar
        passages={PASSAGES}
        activePassageKey={activePassage}
        answers={answers}
        onSelectPassage={setActivePassage}
        onSelectQuestion={scrollToQuestion}
      />

      <SubmitModal
        open={showSubmit}
        onCancel={() => setShowSubmit(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ─── Question Navigator Bar ───────────────────────────────
function QuestionNavBar({
  passages,
  activePassageKey,
  answers,
  onSelectPassage,
  onSelectQuestion,
}: {
  passages:         Passage[]
  activePassageKey: string
  answers:          Answers
  onSelectPassage:  (key: string) => void
  onSelectQuestion: (qId: number) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollNav(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' })
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white flex-shrink-0 flex items-center h-12 px-2 gap-2 select-none">

      {/* Prev arrow */}
      <button
        onClick={() => scrollNav('left')}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {passages.map((p) => (
          <div key={p.key} className="flex items-center gap-1.5 flex-shrink-0">

            {/* Part label */}
            <span
              onClick={() => onSelectPassage(p.key)}
              className={`text-[11px] font-bold cursor-pointer whitespace-nowrap px-1 ${
                activePassageKey === p.key ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}:
            </span>

            {/* Question number buttons */}
            {Array.from({ length: p.qEnd - p.qStart + 1 }, (_, i) => {
              const qId      = p.qStart + i
              const answered = !!answers[qId]
              const isActive = activePassageKey === p.key

              return (
                <button
                  key={qId}
                  onClick={() => {
                    if (activePassageKey !== p.key) onSelectPassage(p.key)
                    // slight delay so passage switch renders before scroll
                    setTimeout(() => onSelectQuestion(qId), 50)
                  }}
                  className={`
                    w-7 h-7 rounded-full text-[11px] font-medium flex-shrink-0 transition-all
                    flex items-center justify-center border
                    ${answered
                      ? 'bg-green-500 text-white border-green-500'
                      : isActive
                        ? 'bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                    }
                  `}
                >
                  {qId}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Next arrow */}
      <button
        onClick={() => scrollNav('right')}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── QuestionGroupCard ────────────────────────────────────
function QuestionGroupCard({
  group, answers, onAnswer, questionRefs,
}: {
  group:         QuestionGroup
  answers:       Answers
  onAnswer:      (id: number, val: string) => void
  questionRefs:  React.MutableRefObject<Record<number, HTMLDivElement | null>>
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{group.title}</h3>
      <p className="text-xs text-gray-400 italic mb-4 leading-snug">{group.instruction}</p>

      <div className="space-y-5">
        {group.questions.map((q) =>
          q.type === 'multiple_choice' ? (
            <div key={q.id} ref={(el) => { questionRefs.current[q.id] = el }}>
              <MCQuestion
                q={q}
                selected={answers[q.id] ?? ''}
                onSelect={(v) => onAnswer(q.id, v)}
              />
            </div>
          ) : (
            <div key={q.id} ref={(el) => { questionRefs.current[q.id] = el }}>
              <FillBlankQuestion
                q={q}
                value={answers[q.id] ?? ''}
                onChange={(v) => onAnswer(q.id, v)}
              />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

// ── Multiple choice ───────────────────────────────────────
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
              selected === opt.label
                ? 'bg-orange-50 border border-orange-200'
                : 'hover:bg-gray-50'
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

// ── Fill blank ────────────────────────────────────────────
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