import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Login   from '@/Auth/Login'
import Logout  from '@/Auth/LogOut'

import { NotFoundPage } from '@/Pages/NotFoundPage/NotFoundPage'
import { AppLayout } from '@/Pages/AppLayout'
import { DashBoard } from '@/Pages/DashBoard/DashBoard'


const DefaultRouter = () => {
  return (
    <Routes>

      <Route path="/"        element={<Login />} />
      <Route path="/logout"  element={<Logout />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard"        element={<DashBoard />} />
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