import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

// GradeStatus = "Pending" | "Graded" | "Late" | "Unsubmitted" | "Draft"
// FileType = "pdf" | "jpg" | "png" | "doc" | "mp3" | "wav"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ASSIGNMENT = {
  title:       "Math Problem Set 3",
  subject:     "Mathematics",
  type:        "Exercise",
  dueDate:     "Apr 20, 2025 · 23:59",
  maxScore:    100,
  latePenalty: 10,
};

const STUDENTS = [
  {
    id: "S001", initials: "AN", name: "Alice Nguyen", session: "Morning", colorKey: "blue",
    submittedAt: "Apr 18, 09:10", status: "Graded", score: 87, files: [
      { name: "algebra_alice.pdf", size: "1.2 MB", type: "pdf" },
      { name: "workings_scan.jpg", size: "2.1 MB", type: "jpg" },
    ],
  },
  {
    id: "S002", initials: "BT", name: "Bob Tran", session: "Morning", colorKey: "green",
    submittedAt: "Apr 16, 14:32", status: "Pending", files: [
      { name: "problem_set_3_bob.pdf",  size: "1.2 MB", type: "pdf" },
      { name: "scratch_work_scan.jpg",  size: "3.4 MB", type: "jpg" },
    ],
  },
  {
    id: "S003", initials: "CL", name: "Carol Le", session: "Evening", colorKey: "amber",
    submittedAt: "Apr 22, 02:10", status: "Late", files: [
      { name: "carol_math_ps3.pdf", size: "0.9 MB", type: "pdf" },
    ],
  },
  {
    id: "S004", initials: "DP", name: "David Pham", session: "Morning", colorKey: "purple",
    submittedAt: "Apr 15, 10:00", status: "Graded", score: 74, files: [
      { name: "david_ps3.pdf",   size: "1.5 MB", type: "pdf" },
      { name: "workings_dp.doc", size: "0.4 MB", type: "doc" },
    ],
  },
  {
    id: "S005", initials: "LV", name: "Lan Vu", session: "Morning", colorKey: "red",
    submittedAt: undefined, status: "Unsubmitted", files: [],
  },
  {
    id: "S006", initials: "MD", name: "Minh Dao", session: "Morning", colorKey: "teal",
    submittedAt: "Apr 19, 22:45", status: "Graded", score: 95, files: [
      { name: "minh_math.pdf",   size: "2.0 MB", type: "pdf" },
      { name: "extra_notes.jpg", size: "1.1 MB", type: "jpg" },
      { name: "audio_note.mp3",  size: "4.2 MB", type: "mp3" },
    ],
  },
  {
    id: "S007", initials: "HB", name: "Hoa Bui", session: "Evening", colorKey: "pink",
    submittedAt: "Apr 19, 18:00", status: "Draft",
    draftScore: 60, draftFeedback: "Needs revision on chapter 3 integration.", files: [
      { name: "hoa_ps3_final.pdf", size: "1.8 MB", type: "pdf" },
    ],
  },
  {
    id: "S008", initials: "NN", name: "Nam Nguyen", session: "Evening", colorKey: "orange",
    submittedAt: "Apr 21, 08:00", status: "Late", files: [
      { name: "nam_math_late.pdf", size: "0.7 MB", type: "pdf" },
    ],
  },
];

// ─── Style configs ────────────────────────────────────────────────────────────

const STATUS_CFG = {
  Pending:     { label: "Pending",     badge: "bg-blue-100 text-blue-700",       dot: "bg-blue-400"    },
  Graded:      { label: "Graded",      badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Late:        { label: "Late",        badge: "bg-red-100 text-red-600",         dot: "bg-red-400"     },
  Unsubmitted: { label: "Unsubmitted", badge: "bg-gray-100 text-gray-400",       dot: "bg-gray-300"    },
  Draft:       { label: "Draft",       badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-400"   },
};

const COLOR_MAP = {
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-emerald-100 text-emerald-700",
  amber:  "bg-amber-100 text-amber-700",
  purple: "bg-violet-100 text-violet-700",
  red:    "bg-red-100 text-red-600",
  teal:   "bg-teal-100 text-teal-700",
  pink:   "bg-pink-100 text-pink-600",
  orange: "bg-orange-100 text-orange-600",
};

// ✅ FIX: Tách icon thành component riêng thay vì lưu JSX.Element trong object
//         → tránh lỗi TypeScript với JSX.Element type trong object literal
function FileIcon({ type }) {
  switch (type) {
    case "pdf":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      );
    case "jpg":
    case "png":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      );
    case "doc":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    case "mp3":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      );
    case "wav":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
    default:
      return null;
  }
}

const FILE_COLOR = {
  pdf: "text-red-500 bg-red-50 border-red-200",
  jpg: "text-orange-500 bg-orange-50 border-orange-200",
  png: "text-orange-500 bg-orange-50 border-orange-200",
  doc: "text-blue-500 bg-blue-50 border-blue-200",
  mp3: "text-purple-500 bg-purple-50 border-purple-200",
  wav: "text-violet-500 bg-violet-50 border-violet-200",
};

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreGrade(score, max) {
  const pct = (score / max) * 100;
  if (pct >= 90) return { label: "Xuất sắc",   color: "text-emerald-600", bar: "bg-emerald-500" };
  if (pct >= 75) return { label: "Khá",         color: "text-blue-600",    bar: "bg-blue-500"    };
  if (pct >= 60) return { label: "Trung bình",  color: "text-amber-600",   bar: "bg-amber-400"   };
  return              { label: "Yếu",           color: "text-red-500",     bar: "bg-red-400"     };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function GradeSidebar({ students, activeId, sidebarOpen, onSelect, onClose }) {
  const [filter, setFilter] = useState("All");

  const filterOptions = [
    { value: "All",         label: `All (${students.length})` },
    { value: "Pending",     label: `Pending (${students.filter(s => s.status === "Pending").length})` },
    { value: "Late",        label: `Late (${students.filter(s => s.status === "Late").length})` },
    { value: "Unsubmitted", label: `Unsubmitted (${students.filter(s => s.status === "Unsubmitted").length})` },
    { value: "Graded",      label: `Graded (${students.filter(s => s.status === "Graded").length})` },
    { value: "Draft",       label: `Draft (${students.filter(s => s.status === "Draft").length})` },
  ];

  const visible = filter === "All" ? students : students.filter(s => s.status === filter);
  const graded  = students.filter(s => s.status === "Graded").length;

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-100 flex flex-col w-64
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:shadow-none lg:h-auto lg:min-h-screen
      `}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-800 text-base">Submissions</h2>
            <button
              onClick={onClose}
              className="flex lg:hidden w-7 h-7 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400">{students.length} total · {graded} graded</p>

          {/* Mini progress */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${students.length > 0 ? (graded / students.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-400">
              {students.length > 0 ? Math.round((graded / students.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Filter */}
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Filter</p>
          <div className="space-y-0.5">
            {filterOptions.map((opt) => {
              const count = opt.value === "All"
                ? students.length
                : students.filter(s => s.status === opt.value).length;
              if (opt.value !== "All" && count === 0) return null;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all text-left
                    ${filter === opt.value
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-500 hover:bg-gray-50"}`}
                >
                  {opt.value !== "All" && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_CFG[opt.value]?.dot ?? "bg-gray-300"}`} />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto py-2">
          {visible.map((s) => {
            const cfg      = STATUS_CFG[s.status];
            const isActive = s.id === activeId;
            const avatarCls = COLOR_MAP[s.colorKey] ?? "bg-gray-100 text-gray-500";

            return (
              <button
                key={s.id}
                onClick={() => { onSelect(s.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2
                  ${isActive
                    ? "bg-indigo-50 border-l-indigo-500"
                    : "border-l-transparent hover:bg-gray-50"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${avatarCls}`}>
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-indigo-700" : "text-gray-700"}`}>
                    {s.name}
                  </p>
                  {s.status === "Graded" && s.score != null ? (
                    <p className="text-xs text-emerald-600 font-semibold">{s.score} / {ASSIGNMENT.maxScore}</p>
                  ) : (
                    <p className="text-xs text-gray-400">{s.session} session</p>
                  )}
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// ─── Grading Panel ────────────────────────────────────────────────────────────

function GradingPanel({ student, onNext, onPrev, hasNext, hasPrev, onSaved }) {
  const [score,    setScore]    = useState(
    student.draftScore != null ? String(student.draftScore)
      : student.score != null ? String(student.score)
      : ""
  );
  const [feedback, setFeedback] = useState(student.draftFeedback ?? "");
  const [saving,   setSaving]   = useState(null);   // "publish" | "draft" | null
  const [saved,    setSaved]    = useState(null);    // "publish" | "draft" | null

  const maxScore       = ASSIGNMENT.maxScore;
  const scoreNum       = parseFloat(score);
  const scoreValid     = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= maxScore;
  const effectiveScore = student.status === "Late" && scoreValid
    ? Math.max(0, scoreNum - ASSIGNMENT.latePenalty)
    : scoreNum;
  const grade    = scoreValid ? scoreGrade(effectiveScore, maxScore) : null;
  const canGrade = student.status !== "Unsubmitted";

  // ✅ FIX: Chỉ khai báo handleSave MỘT LẦN duy nhất, đặt trước return
  //         Bản gốc khai báo 2 lần: const ở trên (thiếu auto-advance) +
  //         async function sau return (dead code, có auto-advance nhưng không bao giờ chạy)
  async function handleSave(draft) {
    if (!scoreValid) return;
    setSaving(draft ? "draft" : "publish");
    await new Promise(r => setTimeout(r, 800));
    setSaving(null);
    setSaved(draft ? "draft" : "publish");
    onSaved(student.id, scoreNum, feedback, draft);
    setTimeout(() => setSaved(null), 2500);
    // ✅ Auto-advance sang học sinh kế tiếp sau khi publish (logic bị mất ở bản gốc)
    if (!draft && hasNext) setTimeout(onNext, 600);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* ── Student header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${COLOR_MAP[student.colorKey] ?? "bg-gray-100 text-gray-500"}`}>
            {student.initials}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-base">{student.name}</h2>
            <p className="text-xs text-gray-400">
              {student.submittedAt
                ? `Submitted ${student.submittedAt} · ${student.session} session`
                : `${student.session} session · Not submitted`}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CFG[student.status].badge}`}>
            {STATUS_CFG[student.status].label}
          </span>
          {student.status === "Late" && (
            <span className="text-xs text-red-500 font-medium bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              −{ASSIGNMENT.latePenalty}pt penalty
            </span>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

        {!canGrade ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Học sinh chưa nộp bài</p>
            <p className="text-sm text-gray-400">Không có file nào để chấm điểm.</p>
            <button className="mt-2 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors">
              🔔 Nhắc nhở nộp bài
            </button>
          </div>
        ) : (
          <>
            {/* ── Submitted files ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Submitted Files</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{student.files.length} file{student.files.length !== 1 ? "s" : ""} đã nộp</p>
                </div>
                {student.files.length > 0 && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download all ({student.files.length})
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {student.files.map((file, i) => {
                  const colorCls = FILE_COLOR[file.type] ?? FILE_COLOR.pdf;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${colorCls} cursor-pointer hover:opacity-80 transition-opacity group`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                        <FileIcon type={file.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Already graded banner ── */}
            {student.status === "Graded" && student.score != null && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Đã chấm điểm</p>
                  <p className="text-xs text-emerald-600">
                    Điểm hiện tại: <span className="font-bold">{student.score}/{ASSIGNMENT.maxScore}</span> · Cập nhật điểm bên dưới để chỉnh sửa
                  </p>
                </div>
              </div>
            )}

            {/* ── Draft banner ── */}
            {student.status === "Draft" && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-xs text-amber-700 font-medium">Bản nháp chưa được publish — học sinh chưa nhận được điểm</p>
              </div>
            )}

            {/* ── Grading form ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Chấm điểm</h3>

              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5">

                {/* Score input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Điểm <span className="text-gray-400 font-normal">(/ {maxScore})</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={maxScore}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="e.g. 85"
                      className={`w-full text-center text-2xl font-bold px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all
                        ${!score
                          ? "border-gray-200 focus:ring-indigo-200 focus:border-indigo-300 text-gray-400"
                          : scoreValid
                            ? "border-indigo-300 ring-1 ring-indigo-200 text-indigo-700"
                            : "border-red-300 ring-1 ring-red-200 text-red-500"}`}
                    />
                  </div>

                  {/* Late penalty breakdown */}
                  {student.status === "Late" && scoreValid && (
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-600 space-y-0.5">
                      <div className="flex justify-between"><span>Raw score</span><span className="font-medium">{scoreNum}</span></div>
                      <div className="flex justify-between"><span>Late penalty</span><span className="font-medium">−{ASSIGNMENT.latePenalty}</span></div>
                      <div className="flex justify-between border-t border-red-200 pt-1 font-semibold">
                        <span>Final score</span><span className="text-red-700">{effectiveScore}</span>
                      </div>
                    </div>
                  )}

                  {/* Grade label + bar */}
                  {scoreValid && grade && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${grade.color}`}>{grade.label}</span>
                        <span className="text-gray-400">{Math.round((effectiveScore / maxScore) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${grade.bar}`}
                          style={{ width: `${(effectiveScore / maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {score && !scoreValid && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      ⚠ Điểm phải từ 0 đến {maxScore}
                    </p>
                  )}
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nhận xét cho học sinh</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Viết nhận xét chi tiết cho học sinh... (điểm mạnh, điểm cần cải thiện, gợi ý)"
                    rows={6}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all leading-relaxed"
                  />
                  <p className="text-[10px] text-gray-300 text-right">{feedback.length} ký tự</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky footer ── */}
      {canGrade && (
        <div className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Publish */}
            <button
              onClick={() => handleSave(false)}
              disabled={!scoreValid || saving !== null}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {saving === "publish" ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
                  </svg>
                  Saving...
                </>
              ) : saved === "publish" ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Save grade & publish feedback
                </>
              )}
            </button>

            {/* Draft */}
            <button
              onClick={() => handleSave(true)}
              disabled={!scoreValid || saving !== null}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving === "draft" ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
                  </svg>
                  Saving draft...
                </>
              ) : saved === "draft" ? "Draft saved ✓" : "Save as draft"}
            </button>
          </div>

          {hasNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all"
            >
              Next student
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function GradeLayout({
  onBack,
  className   = "Class 10A",
  sessionName = "Thứ 2 - 4 - 6",
}) {
  const [students,    setStudents]    = useState(STUDENTS);
  const [activeId,    setActiveId]    = useState(
    STUDENTS.find(s => s.status === "Pending" || s.status === "Late")?.id ?? STUDENTS[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeIndex   = students.findIndex(s => s.id === activeId);
  const activeStudent = students[activeIndex];

  const goNext = () => { if (activeIndex < students.length - 1) setActiveId(students[activeIndex + 1].id); };
  const goPrev = () => { if (activeIndex > 0) setActiveId(students[activeIndex - 1].id); };

  const handleSaved = (id, score, feedback, draft) => {
    setStudents(prev => prev.map(s =>
      s.id === id
        ? {
            ...s,
            status:        draft ? "Draft"     : "Graded",
            score:         draft ? s.score     : score,
            draftScore:    draft ? score        : undefined,
            draftFeedback: draft ? feedback     : undefined,
          }
        : s
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 md:px-6 gap-4 shadow-sm flex-shrink-0 sticky top-0 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex lg:hidden w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span className="hidden sm:inline">Assignments</span>
          </button>
          <span className="text-gray-200 hidden sm:inline">/</span>
          <span className="text-sm text-gray-400 hidden md:inline truncate">{className} · {sessionName}</span>
          <span className="text-gray-200 hidden md:inline">/</span>
          <h1 className="text-sm font-semibold text-gray-800 truncate">
            Grading — {ASSIGNMENT.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-500 hidden sm:inline">Mr. Tran Long</span>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">TL</div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
        <GradeSidebar
          students={students}
          activeId={activeId}
          sidebarOpen={sidebarOpen}
          onSelect={setActiveId}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
          <GradingPanel
            key={activeStudent.id}
            student={activeStudent}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={activeIndex < students.length - 1}
            hasPrev={activeIndex > 0}
            onSaved={handleSaved}
          />
        </main>
      </div>
    </div>
  );
}