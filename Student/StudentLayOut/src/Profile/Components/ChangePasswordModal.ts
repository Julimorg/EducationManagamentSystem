import React, { useState } from 'react'
import { XIcon } from 'lucide-react'
import { toast } from 'sonner'
type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}
type Step = 'REQUEST_OTP' | 'VERIFY_OTP' | 'NEW_PASSWORD'
export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [step, setStep] = useState<Step>('REQUEST_OTP')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Mock OTP for demonstration
  const MOCK_OTP = '123456'
  if (!isOpen) return null
  const handleClose = () => {
    setStep('REQUEST_OTP')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }
  const handleRequestOTP = () => {
    toast.success('OTP sent to your email (Mock: 123456)')
    setStep('VERIFY_OTP')
  }
  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP')
      return
    }
    if (otp !== MOCK_OTP) {
      toast.error('Invalid OTP. Please try again.')
      return
    }
    toast.success('OTP verified successfully')
    setStep('NEW_PASSWORD')
  }
  const handleChangePassword = () => {
    if (!newPassword.trim()) {
      toast.error('New password is required')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password changed successfully')
    handleClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'REQUEST_OTP' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We will send a One-Time Password (OTP) to your registered email
                address to verify your identity.
              </p>
              <button
                onClick={handleRequestOTP}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Send OTP
              </button>
            </div>
          )}

          {step === 'VERIFY_OTP' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please enter the 6-digit OTP sent to your email.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center tracking-widest"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Verify OTP
              </button>
            </div>
          )}

          {step === 'NEW_PASSWORD' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
