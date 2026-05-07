import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onNext: (email: string) => void
}

export function Step1ForgotPassword({ onNext }: Props) {
  const navigate        = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    setError('')
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    // TODO: call API to send OTP → await api.sendOtp(email)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)

    onNext(email.trim())
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-1.5">
        Forgot password?
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Enter your email address and we'll send you an OTP to reset your password.
      </p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="your@email.com"
          autoFocus
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
                     placeholder-gray-400 outline-none transition-all
                     focus:border-[#C0272D] focus:ring-2 focus:ring-[#C0272D]/10"
        />
        {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full py-2.5 bg-[#C0272D] hover:bg-[#a8222a] text-white text-sm font-medium
                   rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending…' : 'Send OTP'}
      </button>

      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-1.5 text-xs text-[#C0272D] font-medium mt-4 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign in
      </button>
    </div>
  )
}