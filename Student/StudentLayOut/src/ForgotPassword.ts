import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { StarIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from 'lucide-react'
type Step = 'email' | 'otp' | 'password'
export function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const handleSendOTP = () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    // Simulate sending OTP
    setCurrentStep('otp')
    setResendTimer(60)
    toast.success('OTP sent to your email')
  }
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }
  const handleVerifyOTP = () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }
    // Simulate OTP verification
    setCurrentStep('password')
    toast.success('OTP verified successfully')
  }
  const handleResendOTP = () => {
    if (resendTimer > 0) return
    setResendTimer(60)
    setOtp(['', '', '', '', '', ''])
    toast.success('OTP resent to your email')
  }
  const handleResetPassword = () => {
    if (!newPassword) {
      toast.error('Please enter a new password')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    if (!confirmPassword) {
      toast.error('Please confirm your password')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    // Simulate password reset
    toast.success('Password reset successfully!')
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }
  const getStepNumber = () => {
    switch (currentStep) {
      case 'email':
        return 1
      case 'otp':
        return 2
      case 'password':
        return 3
      default:
        return 1
    }
  }
  return (
    <div className="flex w-full min-h-screen bg-[#2a2a3e]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#0d6b58] to-[#0a5546] p-12 flex-col justify-between">
        <div>
          <div className="w-16 h-16 bg-teal-400/20 rounded-2xl flex items-center justify-center mb-6">
            <StarIcon className="w-8 h-8 text-teal-200" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            IELTS EduSystem
          </h1>
          <p className="text-teal-200 text-lg mb-12">Academic Platform</p>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your path to band 9<br />
            starts here
          </h2>
          <p className="text-teal-100 text-lg leading-relaxed">
            Access lessons, mock tests, and personalised feedback tailored to
            your target score.
          </p>
        </div>

        <div>
          <p className="text-teal-200 text-sm font-semibold mb-4 tracking-wider">
            IELTS BAND SCALE
          </p>
          <div className="space-y-3">
            {[
              {
                band: 9,
                label: 'Expert',
                width: '100%',
              },
              {
                band: 8,
                label: 'Very good',
                width: '88%',
              },
              {
                band: 7,
                label: 'Good',
                width: '77%',
              },
              {
                band: 6,
                label: 'Competent',
                width: '66%',
              },
              {
                band: 5,
                label: 'Modest',
                width: '55%',
              },
            ].map(({ band, label, width }) => (
              <div key={band} className="flex items-center gap-4">
                <span className="text-white font-semibold w-4">{band}</span>
                <div className="flex-1 h-2 bg-teal-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
                    style={{
                      width,
                    }}
                  />
                </div>
                <span className="text-teal-200 text-sm w-24">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-teal-700/30">
            <div className="flex flex-wrap gap-3 text-teal-200/60 text-sm">
              <span>Academic</span>
              <span>•</span>
              <span>General Training</span>
            </div>
            <div className="flex flex-wrap gap-3 text-teal-200/60 text-sm mt-2">
              <span>Listening</span>
              <span>•</span>
              <span>Reading</span>
              <span>•</span>
              <span>Writing</span>
              <span>•</span>
              <span>Speaking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${step === getStepNumber() ? 'w-12 bg-teal-500' : step < getStepNumber() ? 'w-2 bg-teal-500' : 'w-2 bg-gray-600'}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 'email' && (
              <motion.div
                key="email"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  Forgot password?
                </h2>
                <p className="text-gray-400 mb-8">
                  Enter your email address and we'll send you an OTP to reset
                  your password.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                    />
                  </div>

                  <button
                    onClick={handleSendOTP}
                    className="w-full bg-transparent border border-gray-600 hover:border-teal-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-teal-500/10"
                  >
                    Send OTP
                  </button>

                  <div className="text-center">
                    <a
                      href="/"
                      className="text-teal-400 hover:text-teal-300 text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back to Sign in
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'otp' && (
              <motion.div
                key="otp"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-400 mb-8">
                  Enter the 6-digit code sent to {email}
                </p>

                <div className="space-y-6">
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className="w-12 h-14 bg-transparent border border-gray-600 rounded-lg text-center text-white text-xl font-semibold focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    className="w-full bg-transparent border border-gray-600 hover:border-teal-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-teal-500/10"
                  >
                    Verify OTP
                  </button>

                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className={`text-sm ${resendTimer > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-teal-400 hover:text-teal-300'} transition-colors`}
                    >
                      {resendTimer > 0
                        ? `Resend OTP in ${resendTimer}s`
                        : 'Resend OTP'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep('email')}
                      className="text-teal-400 hover:text-teal-300 text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Change email
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'password' && (
              <motion.div
                key="password"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  Reset password
                </h2>
                <p className="text-gray-400 mb-8">
                  Create a new password for your account.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleResetPassword()
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleResetPassword}
                    className="w-full bg-transparent border border-gray-600 hover:border-teal-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-teal-500/10"
                  >
                    Reset Password
                  </button>

                  <div className="text-center">
                    <a
                      href="/"
                      className="text-teal-400 hover:text-teal-300 text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back to Sign in
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
