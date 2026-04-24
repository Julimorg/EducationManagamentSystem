import React from 'react'
export function RecentGrades() {
  const grades = [
    {
      id: 1,
      subject: 'Algebra Quiz 2',
      grade: 'A',
      score: '95/100',
      percentage: 95,
      color: 'bg-green-500',
      badgeColor: 'bg-orange-50 text-orange-700',
      scoreColor: 'text-green-600',
    },
    {
      id: 2,
      subject: 'Literature Essay',
      grade: 'B',
      score: '82/100',
      percentage: 82,
      color: 'bg-blue-500',
      badgeColor: 'bg-gray-100 text-gray-700',
      scoreColor: 'text-blue-600',
    },
    {
      id: 3,
      subject: 'History Report',
      grade: 'C',
      score: '78/100',
      percentage: 78,
      color: 'bg-blue-500',
      badgeColor: 'bg-red-50 text-red-700',
      scoreColor: 'text-orange-500',
    },
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Recent grades</h3>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
        {grades.map((item) => (
          <div key={item.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-4 flex-shrink-0 ${item.badgeColor}`}
            >
              {item.grade}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.subject}
                </span>
                <span className={`text-sm font-bold ${item.scoreColor}`}>
                  {item.score}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${item.color}`}
                  style={{
                    width: `${item.percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
