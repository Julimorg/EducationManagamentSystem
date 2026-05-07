import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onSuccess: () => void
}

export function Step3ResetPassword({ onSuccess }: Props) {
  const navigate = useNavigate()

  const [newPwd, setNewPwd]         = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNew, setShowNew]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  const isMatch = confirmPwd.length > 0 && newPwd === confirmPwd

  async function handleReset() {
    setError('')
    if (newPwd.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    // TODO: await api.resetPassword(newPwd)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    onSuccess()
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-1.5">Reset password</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Create a new password for your account.
      </p>

      {/* New password */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          New password
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full pl-3.5 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
                       placeholder-gray-400 outline-none transition-all
                       focus:border-[#C0272D] focus:ring-2 focus:ring-[#C0272D]/10"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Toggle password visibility"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
      </div>

      {/* Confirm password */}
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="Repeat your password"
            className="w-full pl-3.5 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
                       placeholder-gray-400 outline-none transition-all
                       focus:border-[#C0272D] focus:ring-2 focus:ring-[#C0272D]/10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Match feedback */}
        {confirmPwd.length > 0 && (
          <p className={`text-xs mt-1 font-medium ${isMatch ? 'text-green-600' : 'text-red-500'}`}>
            {isMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5 mb-2 font-medium">{error}</p>}

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full py-2.5 mt-3 bg-[#C0272D] hover:bg-[#a8222a] text-white text-sm font-medium
                   rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Resetting…' : 'Reset Password'}
      </button>
    </div>
  )
}