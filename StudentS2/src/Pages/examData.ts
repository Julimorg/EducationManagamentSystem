// ─── Types ────────────────────────────────────────────────
export type Status   = 'pending' | 'submitted' | 'graded' | 'late'
export type Category = 'listening' | 'reading' | 'writing' | 'speaking'
export type ExamStatus = 'Pending' | 'Submitted' | 'Graded'

export type SkillRow = {
  skill:             Category
  duration:          number      // minutes
  totalQuestions:    number
  answeredQuestions: number
  status:            ExamStatus
  correctAnswers:    number
  score:             string      // e.g. '7.5' or '--'
}

export type Exam = {
  id:           string
  title:        string
  meta:         string           // "Created Apr 15 · by Mr. Tran Long"
  duration:     string           // "30 minutes"
  participants: string           // "24 participants"
  tag:          string
  category:     Category
  status:       Status
  due?:         string
  urgent?:      string
  score?:       string
  // detail-level fields
  dateCreated:  string           // "10:30 · 15/04/2026"
  createdBy:    string
  numParticipants: number
  skillRows:    SkillRow[]
}

// ─── Mock data ────────────────────────────────────────────
export const EXAMS: Exam[] = [
  {
    id: '1',
    title: 'IELTS Listening Practice Test 1',
    meta: 'Created Apr 15 · by Mr. Tran Long',
    duration: '30 minutes',
    participants: '0 participants',
    tag: 'Listening Test',
    category: 'listening',
    status: 'pending',
    due: 'Apr 25, 10:00',
    urgent: '7 days left',
    dateCreated: '10:30 · 15/04/2026',
    createdBy: 'Mr. Tran Long',
    numParticipants: 0,
    skillRows: [
      {
        skill: 'listening',
        duration: 30,
        totalQuestions: 40,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  {
    id: '2',
    title: 'Academic Reading Module - Part A',
    meta: 'Created Apr 14 · by Ms. Sarah Johnson',
    duration: '60 minutes',
    participants: '24 participants',
    tag: 'Reading Test',
    category: 'reading',
    status: 'submitted',
    dateCreated: '14:00 · 14/04/2026',
    createdBy: 'Ms. Sarah Johnson',
    numParticipants: 24,
    skillRows: [
      {
        skill: 'reading',
        duration: 60,
        totalQuestions: 40,
        answeredQuestions: 35,
        status: 'Submitted',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  {
    id: '3',
    title: 'Writing Task 2 - Opinion Essay',
    meta: 'Created Apr 12 · by Mr. David Chen',
    duration: '60 minutes',
    participants: '18 participants',
    tag: 'Writing Task',
    category: 'writing',
    status: 'graded',
    score: '7.5 / 9',
    dateCreated: '09:15 · 12/04/2026',
    createdBy: 'Mr. David Chen',
    numParticipants: 18,
    skillRows: [
      {
        skill: 'writing',
        duration: 40,
        totalQuestions: 2,
        answeredQuestions: 2,
        status: 'Graded',
        correctAnswers: 2,
        score: '7.5',
      },
    ],
  },
  {
    id: '4',
    title: 'IELTS Speaking Part 1 & 2',
    meta: 'Created Apr 18 · by Ms. Sarah Johnson',
    duration: '15 minutes',
    participants: '0 participants',
    tag: 'Speaking Test',
    category: 'speaking',
    status: 'pending',
    due: 'Apr 26, 14:00',
    urgent: '8 days left',
    dateCreated: '11:00 · 18/04/2026',
    createdBy: 'Ms. Sarah Johnson',
    numParticipants: 0,
    skillRows: [
      {
        skill: 'speaking',
        duration: 15,
        totalQuestions: 3,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  {
    id: '5',
    title: 'Academic Reading Module - Part B',
    meta: 'Created Apr 10 · by Mr. Tran Long',
    duration: '60 minutes',
    participants: '22 participants',
    tag: 'Reading Test',
    category: 'reading',
    status: 'graded',
    score: '32 / 40',
    dateCreated: '16:45 · 10/04/2026',
    createdBy: 'Mr. Tran Long',
    numParticipants: 22,
    skillRows: [
      {
        skill: 'reading',
        duration: 60,
        totalQuestions: 40,
        answeredQuestions: 40,
        status: 'Graded',
        correctAnswers: 32,
        score: '32',
      },
    ],
  },
  {
    id: '6',
    title: 'IELTS Listening Practice Test 2',
    meta: 'Created Apr 8 · by Mr. Tran Long',
    duration: '30 minutes',
    participants: '20 participants',
    tag: 'Listening Test',
    category: 'listening',
    status: 'submitted',
    dateCreated: '08:30 · 08/04/2026',
    createdBy: 'Mr. Tran Long',
    numParticipants: 20,
    skillRows: [
      {
        skill: 'listening',
        duration: 30,
        totalQuestions: 40,
        answeredQuestions: 40,
        status: 'Submitted',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
  {
    id: '7',
    title: 'Writing Task 1 - Graph Description',
    meta: 'Created Apr 5 · by Mr. David Chen',
    duration: '20 minutes',
    participants: '19 participants',
    tag: 'Writing Task',
    category: 'writing',
    status: 'late',
    dateCreated: '08:30 · 05/04/2026',
    createdBy: 'Mr. David Chen',
    numParticipants: 19,
    skillRows: [
      {
        skill: 'writing',
        duration: 20,
        totalQuestions: 1,
        answeredQuestions: 0,
        status: 'Pending',
        correctAnswers: 0,
        score: '--',
      },
    ],
  },
]

// ─── Style maps (dùng ở cả 2 page) ───────────────────────
export const STATUS_PILL: Record<Status, string> = {
  pending:   'bg-orange-50 text-orange-700 border border-orange-200',
  submitted: 'bg-green-50  text-green-700  border border-green-200',
  graded:    'bg-blue-50   text-blue-700   border border-blue-200',
  late:      'bg-red-50    text-red-700    border border-red-200',
}

export const STATUS_LABEL: Record<Status, string> = {
  pending:   'Pending',
  submitted: 'Submitted',
  graded:    'Graded',
  late:      'Late',
}

export const TAG_STYLE: Record<Category, string> = {
  listening: 'bg-violet-50 text-violet-700 border border-violet-200',
  reading:   'bg-blue-50   text-blue-700   border border-blue-200',
  writing:   'bg-green-50  text-green-700  border border-green-200',
  speaking:  'bg-orange-50 text-orange-700 border border-orange-200',
}

export const SKILL_BADGE: Record<Category, string> = {
  listening: 'bg-violet-100 text-violet-600',
  reading:   'bg-emerald-100 text-emerald-600',
  writing:   'bg-blue-100 text-blue-600',
  speaking:  'bg-orange-100 text-orange-600',
}

export const SKILL_LABEL: Record<Category, string> = {
  listening: 'Listening',
  reading:   'Reading',
  writing:   'Writing',
  speaking:  'Speaking',
}

export const EXAM_STATUS_PILL: Record<ExamStatus, string> = {
  Pending:   'bg-orange-50 text-orange-700',
  Submitted: 'bg-green-50  text-green-700',
  Graded:    'bg-blue-50   text-blue-700',
}