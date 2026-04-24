import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.09 6.26L20 9.27l-4.91 4.77 1.18 6.78L12 17.77l-4.27 3.05L8.91 14.04 4 9.27l5.91-1.01L12 2z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EyeOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Band Scale Row ───────────────────────────────────────────────────────────

function BandRow({ score, label, width }: { score: number; label: string; width: string }) {
  return (
    <div className="flex items-center gap-3 mb-1.5">
      <span className="text-xs font-semibold text-white w-3 text-right shrink-0">{score}</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-400 rounded-full" style={{ width }} />
      </div>
      <span className="text-xs text-emerald-300 w-14 text-right shrink-0">{label}</span>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className={[
        "fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl border bg-zinc-800 border-zinc-700 shadow-2xl text-sm text-white transition-all duration-300 max-w-xs z-50",
        toast.visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <span className={toast.type === "success" ? "text-emerald-400" : "text-red-400"}>
        {toast.type === "success"
          ? <CheckIcon className="w-5 h-5" />
          : <AlertIcon className="w-5 h-5" />
        }
      </span>
      <span className="text-zinc-200">{toast.message}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const bands = [
    { score: 9, label: "Expert",    width: "100%" },
    { score: 8, label: "Very good", width: "87%"  },
    { score: 7, label: "Good",      width: "72%"  },
    { score: 6, label: "Competent", width: "56%"  },
    { score: 5, label: "Modest",    width: "38%"  },
  ];

  const tags = ["Academic", "General Training", "Listening", "Reading", "Writing", "Speaking"];

  return (
    <aside className="hidden lg:flex flex-col w-80 xl:w-96 shrink-0 bg-emerald-900 p-8 xl:p-10 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center gap-3.5 mb-14 relative z-10">
        <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
          <StarIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white tracking-tight">IELTS EduSystem</p>
          <p className="text-xs text-emerald-300 mt-0.5">Academic Platform</p>
        </div>
      </div>

      {/* Headline */}
      <h1 className="font-serif text-3xl xl:text-4xl leading-tight text-white mb-4 relative z-10">
        Your path to{" "}
        <em className="not-italic text-emerald-300">band 9</em>{" "}
        starts here
      </h1>

      <p className="text-sm text-emerald-300/80 leading-relaxed mb-12 relative z-10">
        Access lessons, mock tests, and personalised feedback tailored to your target score.
      </p>

      {/* Band Scale */}
      <div className="relative z-10 mb-auto">
        <p className="text-xs tracking-widest uppercase text-emerald-400 font-medium mb-3.5">
          IELTS Band Scale
        </p>
        {bands.map((b) => (
          <BandRow key={b.score} score={b.score} label={b.label} width={b.width} />
        ))}
      </div>

      {/* Footer tags */}
      <div className="relative z-10 pt-8 mt-8 border-t border-white/8">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-emerald-300 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" });

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    showToast("Welcome back! Redirecting to your dashboard…", "success");
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-900 font-sans">
      <Sidebar />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-5 py-4 bg-emerald-900 border-b border-emerald-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
          <StarIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white leading-none">IELTS EduSystem</p>
          <p className="text-xs text-emerald-300 mt-0.5">Academic Platform</p>
        </div>
        <div className="flex gap-1.5">
          <span className="text-xs text-emerald-300 bg-white/8 border border-white/10 rounded-full px-2.5 py-1">Academic</span>
          <span className="text-xs text-emerald-300 bg-white/8 border border-white/10 rounded-full px-2.5 py-1 hidden sm:inline">General</span>
        </div>
      </div>

      {/* Form area */}
      <main className="flex-1 flex items-center justify-center px-5 py-8 pt-28 lg:pt-8">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase text-emerald-400 font-medium mb-2.5">
              Secure Portal
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-2 tracking-wide">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange("email")}
                className={[
                  "w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:ring-1",
                  errors.email
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20",
                ].join(" ")}
              />
              {errors.email && (
                <p className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                  <AlertIcon className="w-3 h-3 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-medium text-zinc-300 tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className={[
                    "w-full bg-zinc-800 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:ring-1",
                    errors.password
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                      : "border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/20",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-md"
                >
                  {showPassword
                    ? <EyeOffIcon className="w-4 h-4" />
                    : <EyeOpenIcon className="w-4 h-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                  <AlertIcon className="w-3 h-3 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember + Session */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange("remember")}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-emerald-500 cursor-pointer transition-all duration-150 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                />
                <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Keep me signed in
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                Secure session
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Bottom note */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            No account?{" "}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Contact your administrator
            </a>
          </p>

          {/* Security badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-zinc-800">
            {[
              { icon: <LockIcon className="w-3 h-3" />,   label: "256-bit SSL"         },
              { icon: <ShieldIcon className="w-3 h-3" />, label: "Data encrypted"      },
              { icon: <ClockIcon className="w-3 h-3" />,  label: "Session timeout: 8h" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="text-emerald-500">{icon}</span>
                {label}
              </div>
            ))}
          </div>

        </div>
      </main>

      <Toast toast={toast} />
    </div>
  );
}