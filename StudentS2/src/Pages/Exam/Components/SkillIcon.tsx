import React from 'react'
import { Headphones, BookOpen, PenTool, Mic } from 'lucide-react'
import { Category, SKILL_BADGE, SKILL_LABEL } from '../ExamData'


type Props = { category: Category }

const ICON_MAP: Record<Category, React.ReactNode> = {
  listening: <Headphones className="w-6 h-6" />,
  reading:   <BookOpen   className="w-6 h-6" />,
  writing:   <PenTool    className="w-6 h-6" />,
  speaking:  <Mic        className="w-6 h-6" />,
}

export function SkillIcon({ category }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${SKILL_BADGE[category]}`}>
        {ICON_MAP[category]}
      </div>
      <span className="text-xs font-medium text-gray-800">
        {SKILL_LABEL[category]}
      </span>
    </div>
  )
}