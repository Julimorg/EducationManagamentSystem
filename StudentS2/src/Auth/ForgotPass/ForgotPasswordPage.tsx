import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { Step3ResetPassword } from './ResetPassword'
import { Step1ForgotPassword } from './StepForgotPassword'
import { StepIndicator } from './StepIndicator'
import { Step2VerifyOTP } from './VerifyOtp'

// ─── Band scale ───────────────────────────────────────────
const BANDS = [
  { score: 9, label: 'Expert',     pct: 100 },
  { score: 8, label: 'Very good',  pct: 84  },
  { score: 7, label: 'Good',       pct: 66  },
  { score: 6, label: 'Competent',  pct: 50  },
  { score: 5, label: 'Modest',     pct: 36  },
]

const FOOTER_LINKS = ['Academic', 'General Training', 'Listening', 'Reading', 'Writing', 'Speaking']

// ─── Page ─────────────────────────────────────────────────
type Step = 1 | 2 | 3

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [step, setStep]   = useState<Step>(1)
  const [email, setEmail] = useState('')

  // Step 1 → 2
  function handleEmailSent(sentEmail: string) {
    setEmail(sentEmail)
    toast.success('OTP sent to your email')
    setStep(2)
  }

  // Step 2 → 3
  function handleOtpVerified() {
    setStep(3)
  }

  // Step 2 → 1
  function handleChangeEmail() {
    setStep(1)
  }

  // Step 3 complete
  function handleResetSuccess() {
    toast.success('Password reset successfully!')
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />

      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl min-h-[520px]">

        {/* ── Left: Brand panel (không đổi) ── */}
        <LeftPanel />

        {/* ── Right: Step content ── */}
        <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-center">

          {/* Step indicator */}
          <StepIndicator current={step} />

          {/* Step panels */}
          {step === 1 && (
            <Step1ForgotPassword onNext={handleEmailSent} />
          )}
          {step === 2 && (
            <Step2VerifyOTP
              email={email}
              onNext={handleOtpVerified}
              onBack={handleChangeEmail}
            />
          )}
          {step === 3 && (
            <Step3ResetPassword onSuccess={handleResetSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── LeftPanel ────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="hidden md:flex w-[42%] flex-col px-8 py-10 relative overflow-hidden flex-shrink-0"
      style={{ background: '#C0272D' }}
    >
      {/* Decorative */}
      <div className="absolute -bottom-14 -right-14 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />
      <div className="absolute -top-10 -right-6 w-36 h-36 rounded-full opacity-[.07] bg-white pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-[#C0272D] font-bold text-base leading-none">iPL</span>
        </div>
        <div>
          <h1 className="text-white font-medium text-sm leading-tight">IELTS Phụng Loan</h1>
          <p className="text-white/60 text-xs mt-0.5">Level up your language, level up your life</p>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1">
        <h2 className="text-white text-2xl font-medium leading-snug mb-3">
          Your path to band 9 starts here
        </h2>
        <p className="text-white/70 text-xs leading-relaxed mb-7">
          Access lessons, mock tests, and personalised feedback tailored to your target score.
        </p>

        {/* Band scale */}
        <p className="text-white/50 text-[10px] font-medium uppercase tracking-widest mb-3">
          IELTS Band Scale
        </p>
        <div className="space-y-2">
          {BANDS.map((b) => (
            <div key={b.score} className="flex items-center gap-2.5">
              <span className="text-white/60 text-[11px] w-3 text-right flex-shrink-0">
                {b.score}
              </span>
              <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="text-white/60 text-[10.5px] w-16 text-right flex-shrink-0">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-7">
        {FOOTER_LINKS.map((l) => (
          <span key={l} className="text-white/40 text-[11px]">{l}</span>
        ))}
      </div>
    </div>
  )
}