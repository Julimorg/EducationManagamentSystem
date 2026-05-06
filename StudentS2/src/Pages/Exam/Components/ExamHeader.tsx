import React from 'react'
import { Save, Send } from 'lucide-react'
import { ExamTimer } from './ExamTimer'

type PartTab = { label: string; key: string }

type Props = {
  title:        string
  parts:        PartTab[]
  activePart:   string
  onChangePart: (key: string) => void
  duration:     number
  onSave:       () => void
  onSubmit:     () => void
  onTimeUp:     () => void
}

export function ExamHeader({
  title, parts, activePart, onChangePart,
  duration, onSave, onSubmit, onTimeUp,
}: Props) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-gray-900">{title}</h1>

        {/* Part/Passage/Section tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
          {parts.map((p) => (
            <button
              key={p.key}
              onClick={() => onChangePart(p.key)}
              className={`px-3.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activePart === p.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <ExamTimer durationMinutes={duration} onTimeUp={onTimeUp} />

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>

        <button
          onClick={onSubmit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Submit
        </button>
      </div>
    </header>
  )
}