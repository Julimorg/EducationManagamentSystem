import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'

type Props = {
  email:  string
  onNext: () => void
  onBack: () => void
}

const OTP_LENGTH = 6
const RESEND_SECONDS = 59

export function Step2VerifyOTP({ email, onNext, onBack }: Props) {
  const [otp, setOtp]         = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [canResend, setCanResend] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs             = useRef<(HTMLInputElement | null)[]>([])

  // ── Countdown ──
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  function handleResend() {
    setCanResend(false)
    setCountdown(RESEND_SECONDS)
    setOtp(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()
    // TODO: await api.sendOtp(email)
  }

  // ── OTP cell input ──
  function handleChange(value: string, index: number) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = [...otp]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  async function handleVerify() {
    setError('')
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.')
      return
    }
    setLoading(true)
    // TODO: await api.verifyOtp(email, code)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-1.5">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Enter the 6-digit code sent to{' '}
        <span className="font-medium text-gray-700">{email}</span>.
      </p>

      {/* OTP cells */}
      <div className="flex gap-2.5 mb-5" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-11 h-13 border border-gray-200 rounded-lg text-center text-xl font-medium
                       text-gray-900 bg-white outline-none transition-all
                       focus:border-[#C0272D] focus:ring-2 focus:ring-[#C0272D]/10"
            style={{ height: '52px' }}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-600 mb-3 font-medium">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-2.5 bg-[#C0272D] hover:bg-[#a8222a] text-white text-sm font-medium
                   rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying…' : 'Verify OTP'}
      </button>

      {/* Resend */}
      <div className="text-center mt-3">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-xs text-[#C0272D] font-medium hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-xs text-gray-400">
            Resend OTP in <span className="font-medium text-gray-600">{countdown}s</span>
          </p>
        )}
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#C0272D] font-medium mt-4 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Change email
      </button>
    </div>
  )
}