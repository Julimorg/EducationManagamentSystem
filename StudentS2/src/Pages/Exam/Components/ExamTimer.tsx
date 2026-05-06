import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

type Props = {
  durationMinutes: number
  onTimeUp: () => void
}

export function ExamTimer({ durationMinutes, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) { onTimeUp(); return }
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 300

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold border ${
        isWarning
          ? 'bg-red-50 text-red-600 border-red-200'
          : 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      <Clock className={`w-4 h-4 ${isWarning ? 'text-red-500' : 'text-gray-500'}`} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}