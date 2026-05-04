import React from 'react'
import { StatCards } from './Components/StatCards'
import { ExamSchedule } from './Components/ExamSchedule'
import { UpcomingAssignments } from './Components/UpComingAssignments'


export function DashBoard() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <StatCards />
      <UpcomingAssignments />
      <ExamSchedule />
    </div>
  )
}