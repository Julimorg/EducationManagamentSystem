import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Login   from '@/Auth/Login'
import Logout  from '@/Auth/LogOut'

import { NotFoundPage } from '@/Pages/NotFoundPage/NotFoundPage'
import { AppLayout } from '@/Pages/AppLayout'
import { DashBoard } from '@/Pages/DashBoard/DashBoard'
import { AssignmentsPage } from '@/Pages/Assignment/Assignment'
import { AssignmentDetailPage } from '@/Pages/Assignment/AssignmentDetail'
import { ProfilePage } from '@/Pages/Profile/Profile'
import { ExamDetailPage } from '@/Pages/Exam/ExamDetail'
import { ExamsPage } from '@/Pages/Exam/Exam'


const DefaultRouter = () => {
  return (
    <Routes>

      <Route path="/"        element={<Login />} />
      <Route path="/logout"  element={<Logout />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard"        element={<DashBoard />} />
        <Route path="/assignments"        element={<AssignmentsPage />} />
        <Route path="/assignments/:id"        element={<AssignmentDetailPage />} />
        <Route path="/profile"        element={<ProfilePage />} />
        <Route path="/exams"     element={<ExamsPage />} />
        <Route path="/exams/:id" element={<ExamDetailPage />} />
        {/* <Route path="/assignments"      element={<AssignmentsPage />} />
        <Route path="/exams"            element={<ExamsPage />} />
        <Route path="/materials"        element={<MaterialsPage />} />
        <Route path="/profile"          element={<ProfilePage />} />
        <Route path="/notifications"    element={<NotificationsPage />} />
        <Route path="/feedback"         element={<FeedbackPage />} />
        <Route path="/session-transfer" element={<SessionTransferPage />} /> */}
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default DefaultRouter