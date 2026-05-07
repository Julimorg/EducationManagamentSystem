import React from 'react'

type Props = {
  current: 1 | 2 | 3
  total?:  number
}

export function StepIndicator({ current, total = 3 }: Props) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isDone    = step < current
        const isActive  = step === current

        return (
          <div
            key={step}
            className={`h-1 rounded-full transition-all duration-300 ${
              isActive  ? 'w-7 bg-[#C0272D]'         :
              isDone    ? 'w-3.5 bg-[#C0272D]/40'    :
                          'w-2.5 bg-gray-200'
            }`}
          />
        )
      })}
    </div>
  )
}