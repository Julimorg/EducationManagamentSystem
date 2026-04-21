import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { examDetails } from '../data/mockData'
import { WritingExam } from '../components/exam/WritingExam'
import { ReadingExam } from '../components/exam/ReadingExam'
import { ListeningExam } from '../components/exam/ListeningExam'
export function TakeExam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exam = examDetails[id || '1'] || examDetails['1']
  const skillRow = exam.skillRows[0]
  const examType = skillRow.skill
  const duration = skillRow.duration
  const handleSubmit = () => {
    // In a real app, this would save the answers to the backend
    // and update the exam status to 'Submitted'
    navigate(`/exams/${exam.id}`)
  }
  if (examType === 'Writing') {
    return <WritingExam duration={duration} onSubmit={handleSubmit} />
  }
  if (examType === 'Reading') {
    return <ReadingExam duration={duration} onSubmit={handleSubmit} />
  }
  if (examType === 'Listening') {
    return <ListeningExam duration={duration} onSubmit={handleSubmit} />
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Unsupported Exam Type
        </h2>
        <p className="text-gray-600 mb-6">
          This exam type is not supported yet.
        </p>
        <button
          onClick={() => navigate(`/exams/${exam.id}`)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
