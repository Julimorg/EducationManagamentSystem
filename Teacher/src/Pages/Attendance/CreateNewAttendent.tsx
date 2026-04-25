import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceChoice = "present" | "absent" | "excused" | null;

interface StudentRow {
  id: string;
  name: string;
  targetBand: number;
  status: "Active" | "Restrict" | "Inactive";
}

interface AttendanceEntry {
  choice: AttendanceChoice;
  reason: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STUDENTS: StudentRow[] = [
  { id: "S001", name: "Alice Nguyen",  targetBand: 7.0, status: "Active"   },
  { id: "S002", name: "Bob Tran",      targetBand: 6.5, status: "Restrict" },
  { id: "S003", name: "Carol Le",      targetBand: 7.5, status: "Active"   },
  { id: "S004", name: "David Pham",    targetBand: 6.0, status: "Active"   },
  { id: "S005", name: "Lan Vu",        targetBand: 7.0, status: "Restrict" },
  { id: "S006", name: "Minh Dao",      targetBand: 5.5, status: "Active"   },
  { id: "S007", name: "Hoa Bui",       targetBand: 8.0, status: "Active"   },
  { id: "S008", name: "Nam Nguyen",    targetBand: 6.5, status: "Inactive" },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CHOICE_CONFIG = {
  present: {
    label: "Có mặt",
    short: "P",
    ring:  "ring-emerald-400",
    bg:    "bg-emerald-500",
    text:  "text-white",
    pill:  "bg-emerald-100 text-emerald-700",
    row:   "bg-emerald-50/40",
  },
  absent: {
    label: "Vắng mặt",
    short: "A",
    ring:  "ring-red-400",
    bg:    "bg-red-500",
    text:  "text-white",
    pill:  "bg-red-100 text-red-600",
    row:   "bg-red-50/30",
  },
  excused: {
    label: "Nghỉ có phép",
    short: "E",
    ring:  "ring-amber-400",
    bg:    "bg-amber-400",
    text:  "text-white",
    pill:  "bg-amber-100 text-amber-700",
    row:   "bg-amber-50/30",
  },
} as const;

const STATUS_STYLE: Record<StudentRow["status"], string> = {
  Active:   "bg-emerald-100 text-emerald-700",
  Restrict: "bg-red-100 text-red-600",
  Inactive: "bg-gray-100 text-gray-500",
};

// ─── Radio Chip ───────────────────────────────────────────────────────────────

function RadioChip({
  value, current, onChange,
}: {
  value: AttendanceChoice & string;
  current: AttendanceChoice;
  onChange: (v: AttendanceChoice) => void;
}) {
  const cfg     = CHOICE_CONFIG[value];
  const checked = current === value;

  return (
    <button
      type="button"
      onClick={() => onChange(checked ? null : value)}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold
        transition-all duration-150 select-none
        ${checked
          ? `${cfg.bg} ${cfg.text} border-transparent shadow-sm scale-[1.03]`
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"}
      `}
    >
      {/* Indicator dot */}
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${checked ? "border-white bg-white/30" : "border-gray-300"}`}
      >
        {checked && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </span>
      {cfg.label}
    </button>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ entries }: { entries: Record<string, AttendanceEntry> }) {
  const total   = STUDENTS.length;
  const present = Object.values(entries).filter((e) => e.choice === "present").length;
  const absent  = Object.values(entries).filter((e) => e.choice === "absent").length;
  const excused = Object.values(entries).filter((e) => e.choice === "excused").length;
  const pending = total - present - absent - excused;

  const stats = [
    { label: "Có mặt",       value: present, ...CHOICE_CONFIG.present },
    { label: "Vắng mặt",     value: absent,  ...CHOICE_CONFIG.absent  },
    { label: "Nghỉ có phép", value: excused, ...CHOICE_CONFIG.excused },
    { label: "Chưa điểm",    value: pending, bg: "bg-gray-400", text: "text-white", pill: "bg-gray-100 text-gray-500", ring: "ring-gray-300", row: "", short: "?" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-tight">{s.label}</span>
          <div className="flex items-end justify-between">
            <span className={`text-2xl font-bold ${s.value > 0 ? s.bg.replace("bg-", "text-").replace("-500","- 600").replace("-400","- 500") : "text-gray-300"}`}>
              {s.value}
            </span>
            <span className="text-xs text-gray-300">/ {total}</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${s.bg}`}
              style={{ width: `${total > 0 ? (s.value / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Success Overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Điểm danh thành công!</h3>
        <p className="text-sm text-gray-500 mb-6">
          Đã lưu điểm danh cho buổi <span className="font-medium text-gray-700">"{name}"</span>.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Xong
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CreateAttendanceProps {
  sessionName?: string;
  className?: string;
  onBack?: () => void;
}

export default function CreateAttendance({
  sessionName = "Thứ 2 - 4 - 6  ·  17:00 – 19:00",
  className   = "Class 10A",
  onBack,
}: CreateAttendanceProps) {
  const [lessonName,  setLessonName]  = useState("");
  const [nameError,   setNameError]   = useState("");
  const [entries,     setEntries]     = useState<Record<string, AttendanceEntry>>(
    () => Object.fromEntries(STUDENTS.map((s) => [s.id, { choice: null, reason: "" }]))
  );
  const [tableError,  setTableError]  = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);

  // ── helpers ──
  const setChoice = (id: string, choice: AttendanceChoice) => {
    setEntries((prev) => ({
      ...prev,
      [id]: { ...prev[id], choice, reason: choice !== "excused" ? "" : prev[id].reason },
    }));
    setTableError("");
  };

  const setReason = (id: string, reason: string) => {
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], reason } }));
  };

  const markAll = (choice: AttendanceChoice) => {
    setEntries((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, e]) => [id, { ...e, choice, reason: choice !== "excused" ? "" : e.reason }])
      )
    );
    setTableError("");
  };

  // ── validation + submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!lessonName.trim()) {
      setNameError("Vui lòng nhập tên buổi học."); valid = false;
    } else { setNameError(""); }

    const unmarked = STUDENTS.filter((s) => entries[s.id].choice === null);
    if (unmarked.length > 0) {
      setTableError(`Còn ${unmarked.length} học sinh chưa được điểm danh.`); valid = false;
    } else { setTableError(""); }

    const missingReason = STUDENTS.filter(
      (s) => entries[s.id].choice === "excused" && !entries[s.id].reason.trim()
    );
    if (missingReason.length > 0) {
      setTableError(`${missingReason.length} học sinh nghỉ có phép chưa có lý do.`); valid = false;
    }

    if (!valid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setSuccess(true);
  };

  const filled   = STUDENTS.filter((s) => entries[s.id].choice !== null).length;
  const progress = Math.round((filled / STUDENTS.length) * 100);

  return (
    <>
      {success && (
        <SuccessOverlay
          name={lessonName}
          onClose={() => { setSuccess(false); onBack?.(); }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Attendance
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-sm text-gray-500">{className}</span>
          <span className="text-gray-200">/</span>
          <span className="text-sm text-gray-500 hidden sm:inline">{sessionName}</span>
          <span className="text-gray-200 hidden sm:inline">/</span>
          <span className="text-sm font-medium text-gray-700">Điểm danh</span>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Tạo điểm danh</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {sessionName} · <span className="font-medium text-gray-600">{className}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── Lesson name ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-50">
                <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-600" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Thông tin buổi học</h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Tên buổi học <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={lessonName}
                  onChange={(e) => { setLessonName(e.target.value); setNameError(""); }}
                  placeholder="VD: Photosynthesis — Buổi 3, Reading Practice — Unit 4..."
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-700 placeholder-gray-300
                    focus:outline-none focus:ring-2 transition-all
                    ${nameError ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-300"}`}
                />
                {nameError && (
                  <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {nameError}
                  </p>
                )}
              </div>
            </div>

            {/* ── Summary stats ── */}
            <SummaryBar entries={entries} />

            {/* ── Progress bar ── */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                {filled} / {STUDENTS.length} đã điểm danh
              </span>
            </div>

            {/* ── Student table ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Table header */}
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Danh sách học sinh</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{STUDENTS.length} học sinh trong lớp</p>
                </div>
                {/* Quick-mark all */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">Đánh dấu tất cả:</span>
                  {(["present","absent","excused"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => markAll(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all
                        ${CHOICE_CONFIG[c].pill} border-transparent hover:opacity-80`}
                    >
                      {CHOICE_CONFIG[c].label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => markAll(null)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50">
                {STUDENTS.map((s, idx) => {
                  const entry  = entries[s.id];
                  const rowCfg = entry.choice ? CHOICE_CONFIG[entry.choice] : null;

                  return (
                    <div
                      key={s.id}
                      className={`transition-colors duration-200 ${rowCfg ? rowCfg.row : "hover:bg-gray-50/40"}`}
                    >
                      {/* Main row */}
                      <div className="flex items-center gap-3 sm:gap-4 px-5 py-3.5 flex-wrap">

                        {/* Index */}
                        <span className="text-xs text-gray-300 font-mono w-5 flex-shrink-0 hidden sm:block">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        {/* Avatar + name */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-[140px]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all
                            ${rowCfg ? `${rowCfg.bg} text-white` : "bg-indigo-100 text-indigo-600"}`}
                          >
                            {entry.choice
                              ? CHOICE_CONFIG[entry.choice].short
                              : s.name.split(" ").map((w) => w[0]).slice(-2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 leading-tight">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.id} · Band {s.targetBand}</p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden md:inline-flex ${STATUS_STYLE[s.status]}`}>
                          {s.status}
                        </span>

                        {/* Radio chips */}
                        <div className="flex items-center gap-2 flex-wrap ml-auto">
                          {(["present", "absent", "excused"] as const).map((c) => (
                            <RadioChip
                              key={c}
                              value={c}
                              current={entry.choice}
                              onChange={(v) => setChoice(s.id, v)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Reason field — slides in when excused */}
                      {entry.choice === "excused" && (
                        <div className="px-5 pb-3.5 flex items-start gap-3">
                          <div className="w-5 flex-shrink-0 hidden sm:block" />
                          <div className="w-8 flex-shrink-0 hidden sm:block" />
                          <div className="flex-1 flex items-center gap-2.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400 flex-shrink-0 mt-2.5" strokeLinecap="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <input
                              type="text"
                              value={entry.reason}
                              onChange={(e) => setReason(s.id, e.target.value)}
                              placeholder="Lý do nghỉ có phép..."
                              className={`flex-1 px-3 py-2 text-xs border rounded-lg bg-amber-50/60 text-gray-700 placeholder-amber-300
                                focus:outline-none focus:ring-2 transition-all
                                ${!entry.reason.trim() ? "border-amber-200 focus:ring-amber-200 focus:border-amber-300" : "border-amber-200 focus:ring-amber-200"}`}
                            />
                            {!entry.reason.trim() && (
                              <span className="text-[10px] text-amber-500 font-medium flex-shrink-0 whitespace-nowrap">Bắt buộc</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Table error */}
              {tableError && (
                <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span className="text-xs text-red-500 font-medium">{tableError}</span>
                </div>
              )}
            </div>

            {/* ── Submit bar ── */}
            <div className="flex items-center justify-between gap-4 py-2 pb-8">
              <p className="text-xs text-gray-400">
                {filled === STUDENTS.length
                  ? <span className="text-emerald-600 font-medium">✓ Đã điểm danh đủ {STUDENTS.length} học sinh</span>
                  : <span>Còn <span className="font-semibold text-amber-500">{STUDENTS.length - filled}</span> học sinh chưa điểm danh</span>
                }
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700
                    disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Lưu điểm danh
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}