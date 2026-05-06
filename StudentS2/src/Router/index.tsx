import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Auth / standalone
import Login   from '@/Auth/Login'
import Logout  from '@/Auth/LogOut'
import Invoice from '@/Pages/Ticket/Invoice/Invoice'
import { AppLayout } from '@/Pages/AppLayout'
import { AssignmentsPage } from '@/Pages/Assignment/Assignment'
import { AssignmentDetailPage } from '@/Pages/Assignment/AssignmentDetail'
import { DashBoard } from '@/Pages/DashBoard/DashBoard'
import { ExamsPage } from '@/Pages/Exam/Exam'
import { ExamDetailPage } from '@/Pages/Exam/ExamDetail'
import { NotFoundPage } from '@/Pages/NotFoundPage/NotFoundPage'
import { ProfilePage } from '@/Pages/Profile/Profile'
import { ListeningExamWrapper, ReadingExamWrapper, WritingExamWrapper } from './ExamRouterWrapper'
import { MaterialsPage } from '@/Pages/Material/MaterialPage'

const DefaultRouter = () => (
  <Routes>

    {/* ── Standalone ── */}
    <Route path="/"        element={<Login />} />
    <Route path="/logout"  element={<Logout />} />
    <Route path="/invoice" element={<Invoice />} />

    {/*
     * ── Exam layouts (fullscreen, NGOÀI AppLayout) ──────
     * Đặt TRƯỚC shell layout để router match :category
     * trước khi match :id của ExamDetailPage.
     */}
    <Route
      path="/exams/:id/listening"
      element={<ListeningExamWrapper />}
    />
    <Route
      path="/exams/:id/reading"
      element={<ReadingExamWrapper />}
    />
    <Route
      path="/exams/:id/writing"
      element={<WritingExamWrapper />}
    />

    {/* ── Shell layout (sidebar + header) ── */}
    <Route element={<AppLayout />}>
      <Route path="/dashboard"        element={<DashBoard />} />
      <Route path="/assignments"      element={<AssignmentsPage />} />
      <Route path="/assignments/:id"  element={<AssignmentDetailPage />} />
      <Route path="/exams"            element={<ExamsPage />} />
      <Route path="/exams/:id"        element={<ExamDetailPage />} />
      <Route path="/materials"        element={<MaterialsPage />} />
      <Route path="/profile"          element={<ProfilePage />} />
      {/* <Route path="/notifications"    element={<NotificationsPage />} />
      <Route path="/feedback"         element={<FeedbackPage />} />
      <Route path="/session-transfer" element={<SessionTransferPage />} /> */}
    </Route>

    <Route path="*" element={<NotFoundPage />} />

  </Routes>
)

export default DefaultRouter

