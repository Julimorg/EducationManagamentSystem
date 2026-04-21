import React, { useEffect, useState } from 'react'
import { ClockIcon } from 'lucide-react'
type ExamTimerProps = {
  durationMinutes: number
  onTimeUp: () => void
}
export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timerId)
  }, [timeLeft, onTimeUp])
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 300 // 5 minutes
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold border ${isWarning ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
    >
      <ClockIcon
        className={`w-5 h-5 ${isWarning ? 'text-red-500' : 'text-gray-500'}`}
      />
      <span>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
