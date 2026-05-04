import React from 'react'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <p className="text-lg font-semibold text-gray-600">Trang không tồn tại</p>
      <p className="text-sm text-gray-400">Đường dẫn bạn truy cập không hợp lệ.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Về Dashboard
      </button>
    </div>
  )
}