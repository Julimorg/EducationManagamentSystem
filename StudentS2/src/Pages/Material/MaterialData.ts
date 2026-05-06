// ─── Types ────────────────────────────────────────────────
export type MaterialCategory =
  | 'All materials'
  | 'IELTS Academic'
  | 'IELTS General'
  | 'Foundation'

export type MaterialType =
  | 'Grammar'
  | 'Vocabulary'
  | 'IeltsBook'
  | 'Listening Practice'
  | 'Reading Practice'
  | 'Writing Guide'

export type FileType = 'PDF' | 'MP3' | 'MP4' | 'DOC' | 'PPTX'

export type Material = {
  id:           number
  title:        string
  category:     MaterialCategory
  unit:         string
  materialType: MaterialType
  fileType:     FileType
  fileSize:     string
  iconLetter:   string
  iconColor:    string   // tailwind classes: bg-* text-*
}

// ─── Filter options ───────────────────────────────────────
export const materialCategories: MaterialCategory[] = [
  'All materials',
  'IELTS Academic',
  'IELTS General',
  'Foundation',
]

export const materialTypes: MaterialType[] = [
  'Grammar',
  'Vocabulary',
  'IeltsBook',
  'Listening Practice',
  'Reading Practice',
  'Writing Guide',
]

export const materialUnits = ['Unit 1', 'Unit 2', 'Unit 3']

// ─── Mock data ────────────────────────────────────────────
export const mockMaterials: Material[] = [
  {
    id:           1,
    title:        'Advanced Grammar in Use',
    category:     'IELTS Academic',
    unit:         'Unit 1',
    materialType: 'Grammar',
    fileType:     'PDF',
    fileSize:     '2.4 MB',
    iconLetter:   'G',
    iconColor:    'bg-red-100 text-red-600',
  },
  {
    id:           2,
    title:        'Essential Words for the IELTS',
    category:     'Foundation',
    unit:         'Unit 1',
    materialType: 'Vocabulary',
    fileType:     'PDF',
    fileSize:     '1.8 MB',
    iconLetter:   'V',
    iconColor:    'bg-blue-100 text-blue-600',
  },
  {
    id:           3,
    title:        'Cambridge IELTS 16',
    category:     'IELTS Academic',
    unit:         'Unit 2',
    materialType: 'IeltsBook',
    fileType:     'PDF',
    fileSize:     '15.2 MB',
    iconLetter:   'B',
    iconColor:    'bg-emerald-100 text-emerald-600',
  },
  {
    id:           4,
    title:        'Listening Test 4 Audio',
    category:     'IELTS General',
    unit:         'Unit 2',
    materialType: 'Listening Practice',
    fileType:     'MP3',
    fileSize:     '4.5 MB',
    iconLetter:   'L',
    iconColor:    'bg-purple-100 text-purple-600',
  },
  {
    id:           5,
    title:        'Reading Passage 1: The History of Tea',
    category:     'IELTS Academic',
    unit:         'Unit 1',
    materialType: 'Reading Practice',
    fileType:     'PDF',
    fileSize:     '0.9 MB',
    iconLetter:   'R',
    iconColor:    'bg-orange-100 text-orange-600',
  },
  {
    id:           6,
    title:        'Task 1 Graph Description Guide',
    category:     'Foundation',
    unit:         'Unit 3',
    materialType: 'Writing Guide',
    fileType:     'PDF',
    fileSize:     '3.1 MB',
    iconLetter:   'W',
    iconColor:    'bg-amber-100 text-amber-700',
  },
  {
    id:           7,
    title:        'IELTS Grammar Workbook',
    category:     'IELTS General',
    unit:         'Unit 1',
    materialType: 'Grammar',
    fileType:     'DOC',
    fileSize:     '1.2 MB',
    iconLetter:   'G',
    iconColor:    'bg-red-100 text-red-600',
  },
  {
    id:           8,
    title:        'Academic Word List Flashcards',
    category:     'IELTS Academic',
    unit:         'Unit 2',
    materialType: 'Vocabulary',
    fileType:     'PDF',
    fileSize:     '2.0 MB',
    iconLetter:   'V',
    iconColor:    'bg-blue-100 text-blue-600',
  },
  {
    id:           9,
    title:        'Listening Section 2 Practice',
    category:     'IELTS General',
    unit:         'Unit 3',
    materialType: 'Listening Practice',
    fileType:     'MP3',
    fileSize:     '6.2 MB',
    iconLetter:   'L',
    iconColor:    'bg-purple-100 text-purple-600',
  },
  {
    id:           10,
    title:        'Cambridge IELTS 15',
    category:     'IELTS Academic',
    unit:         'Unit 3',
    materialType: 'IeltsBook',
    fileType:     'PDF',
    fileSize:     '14.8 MB',
    iconLetter:   'B',
    iconColor:    'bg-emerald-100 text-emerald-600',
  },
  {
    id:           11,
    title:        'Writing Task 2 Sample Essays',
    category:     'Foundation',
    unit:         'Unit 2',
    materialType: 'Writing Guide',
    fileType:     'DOC',
    fileSize:     '0.8 MB',
    iconLetter:   'W',
    iconColor:    'bg-amber-100 text-amber-700',
  },
  {
    id:           12,
    title:        'General Reading Practice Test',
    category:     'IELTS General',
    unit:         'Unit 1',
    materialType: 'Reading Practice',
    fileType:     'PDF',
    fileSize:     '1.5 MB',
    iconLetter:   'R',
    iconColor:    'bg-orange-100 text-orange-600',
  },
]