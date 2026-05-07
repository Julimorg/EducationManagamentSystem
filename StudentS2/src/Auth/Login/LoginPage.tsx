import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

// ─── Band scale data ───────────────────────────────────────
const BANDS = [
  { score: 9, label: 'Expert',     pct: 100 },
  { score: 8, label: 'Very good',  pct: 84  },
  { score: 7, label: 'Good',       pct: 66  },
  { score: 6, label: 'Competent',  pct: 50  },
  { score: 5, label: 'Modest',     pct: 36  },
]

const FOOTER_LINKS = ['Academic', 'General Training', 'Listening', 'Reading', 'Writing', 'Speaking']

// ─── Component ─────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    // TODO: replace with real auth API call
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl min-h-[540px]">

        {/* ── Left: Brand panel ── */}
        <LeftPanel />

        {/* ── Right: Form panel ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-1.5">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
                           placeholder-gray-400 outline-none transition-all
                           focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-500">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-[#C0272D] font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
                             placeholder-gray-400 outline-none transition-all
                             focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#C0272D] hover:bg-[#a8222a] active:scale-[.99]
                         text-white text-sm font-medium rounded-lg transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            No account?{' '}
            <a href="mailto:admin@ieltsphungloan.vn" className="text-[#C0272D] font-medium hover:underline">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── LeftPanel ─────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="hidden md:flex w-[42%] flex-col px-8 py-10 relative overflow-hidden"
      style={{ background: '#C0272D' }}
    >
      {/* Decorative circles */}
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
              <span className="text-white/60 text-[11px] w-3 text-right flex-shrink-0">{b.score}</span>
              <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${b.pct}%` }}
                />
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