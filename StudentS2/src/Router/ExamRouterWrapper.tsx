import { ListeningExam } from '@/Pages/Exam/Components/ListeningExam'
import { ReadingExam } from '@/Pages/Exam/Components/ReadingExam'
import { WritingExam } from '@/Pages/Exam/Components/WritingExam'
import { EXAMS } from '@/Pages/ExamData'
import { useParams } from 'react-router-dom'

 
export function ListeningExamWrapper() {
  const { id } = useParams<{ id: string }>()
  const exam   = EXAMS.find((e) => e.id === id)
  const duration = exam?.skillRows[0]?.duration ?? 30
  return <ListeningExam duration={duration} />
}
 
export function ReadingExamWrapper() {
  const { id } = useParams<{ id: string }>()
  const exam   = EXAMS.find((e) => e.id === id)
  const duration = exam?.skillRows[0]?.duration ?? 60
  return <ReadingExam duration={duration} />
}
 
export function WritingExamWrapper() {
  const { id } = useParams<{ id: string }>()
  const exam   = EXAMS.find((e) => e.id === id)
  const duration = exam?.skillRows[0]?.duration ?? 60
  return <WritingExam duration={duration} />
}