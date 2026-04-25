import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamSubmissionStatus = "Pending" | "Submitted" | "Graded";
type ExamType = "Listening" | "Reading" | "Writing" | "Full Test" | "Mini Test";

interface ExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  timeTaken?: number;          // minutes
  status: ExamSubmissionStatus;
  score?: number;
  correctAnswers?: number;     // undefined for Writing
  totalQuestions?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EXAM_META = {
  id:          "EX003",
  title:       "IELTS Listening Practice 3",
  type:        "Listening" as ExamType,
  createdBy:   "Mr. Tran Long",
  createdAt:   "Apr 25, 2025",
  createdTime: "17:00",
  duration:    40,   // minutes allowed
  maxScore:    100,
  totalQ:      40,
  className:   "Class 10A",
  sessionName: "Thứ 2 - 4 - 6  ·  17:00 – 19:00",
};

const SUBMISSIONS: ExamSubmission[] = [
  { id: "SB001", studentId: "S001", studentName: "Alice Nguyen", submittedAt: "Apr 25, 17:38", timeTaken: 38, status: "Graded",    score: 87, correctAnswers: 35, totalQuestions: 40 },
  { id: "SB002", studentId: "S002", studentName: "Bob Tran",     submittedAt: "Apr 25, 17:40", timeTaken: 40, status: "Graded",    score: 72, correctAnswers: 29, totalQuestions: 40 },
  { id: "SB003", studentId: "S003", studentName: "Carol Le",     submittedAt: "Apr 25, 17:35", timeTaken: 35, status: "Graded",    score: 95, correctAnswers: 38, totalQuestions: 40 },
  { id: "SB004", studentId: "S004", studentName: "David Pham",   submittedAt: "Apr 25, 17:42", timeTaken: 42, status: "Pending",   score: undefined, correctAnswers: undefined, totalQuestions: 40 },
  { id: "SB005", studentId: "S005", studentName: "Lan Vu",       submittedAt: "Apr 25, 17:39", timeTaken: 39, status: "Graded",    score: 60, correctAnswers: 24, totalQuestions: 40 },
  { id: "SB006", studentId: "S006", studentName: "Minh Dao",     submittedAt: undefined,        timeTaken: undefined, status: "Submitted", score: undefined },
  { id: "SB007", studentId: "S007", studentName: "Hoa Bui",      submittedAt: "Apr 25, 17:41", timeTaken: 37, status: "Graded",    score: 78, correctAnswers: 31, totalQuestions: 40 },
  { id: "SB008", studentId: "S008", studentName: "Nam Nguyen",   submittedAt: "Apr 25, 17:44", timeTaken: 40, status: "Pending",   score: undefined },
];

const PAGE_SIZE = 4;

// ─── Style configs ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ExamSubmissionStatus, {
  badge: string; border: string; label: string; icon: JSX.Element;
}> = {
  Pending: {
    label: "Pending",
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-400",
    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  Submitted: {
    label: "Submitted",
    badge: "bg-indigo-100 text-indigo-700",
    border: "border-l-indigo-400",
    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
  Graded: {
    label: "Graded",
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-l-emerald-400",
    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
};

const TYPE_META: Record<ExamType, { emoji: string; color: string; bg: string }> = {
  Listening:   { emoji: "🎧", color: "text-purple-700",  bg: "bg-purple-50"  },
  Reading:     { emoji: "📖", color: "text-emerald-700", bg: "bg-emerald-50" },
  Writing:     { emoji: "✍️", color: "text-blue-700",    bg: "bg-blue-50"    },
  "Full Test": { emoji: "📋", color: "text-indigo-700",  bg: "bg-indigo-50"  },
  "Mini Test": { emoji: "⚡", color: "text-teal-700",    bg: "bg-teal-50"    },
};

const RANK_COLORS = [
  "bg-amber-400 text-white shadow-amber-200",   // 1st - gold
  "bg-gray-400 text-white shadow-gray-200",     // 2nd - silver
  "bg-orange-400 text-white shadow-orange-200", // 3rd - bronze
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(min: number) {
  if (min < 60) return `${min}m`;
  return `${Math.floor(min / 60)}h ${min % 60 > 0 ? `${min % 60}m` : ""}`.trim();
}

function scoreColor(score: number, max: number) {
  const p = (score / max) * 100;
  if (p >= 80) return "text-emerald-600";
  if (p >= 60) return "text-amber-500";
  return "text-red-500";
}

function scoreBarColor(score: number, max: number) {
  const p = (score / max) * 100;
  if (p >= 80) return "bg-emerald-500";
  if (p >= 60) return "bg-amber-400";
  return "bg-red-400";
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-600",
  "bg-teal-100 text-teal-700",
  "bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600",
];

function avatarCls(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
        const dot = !show && (p === page - 2 || p === page + 2);
        if (dot) return <span key={p} className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">…</span>;
        if (!show) return null;
        return (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium border transition-all
              ${p === page ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"}`}>
            {p}
          </button>
        );
      })}
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

// ─── Submission Card ──────────────────────────────────────────────────────────

function SubmissionCard({ sub, idx }: { sub: ExamSubmission; idx: number }) {
  const cfg    = STATUS_CFG[sub.status];
  const tMeta  = TYPE_META[EXAM_META.type];
  const isWriting = EXAM_META.type === "Writing";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${cfg.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-5 space-y-4">

        {/* ── Top: student + status ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarCls(idx)}`}>
              {sub.studentName.split(" ").map(w => w[0]).slice(-2).join("")}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 leading-tight">{sub.studentName}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{sub.studentId}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.badge}`}>
            {cfg.icon}{cfg.label}
          </span>
        </div>

        {/* ── Exam info pills ── */}
        <div className="flex flex-wrap gap-2">
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${tMeta.bg} ${tMeta.color}`}>
            <span className="text-sm leading-none">{tMeta.emoji}</span>
            {EXAM_META.type}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {EXAM_META.createdBy}
          </span>
        </div>

        {/* ── Meta grid ── */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Giờ tạo đề</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{EXAM_META.createdAt} · {EXAM_META.createdTime}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Nộp lúc</p>
            <p className={`text-xs font-medium mt-0.5 ${sub.submittedAt ? "text-gray-700" : "text-gray-300 italic"}`}>
              {sub.submittedAt ?? "Chưa nộp"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Thời gian làm</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {sub.timeTaken != null ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-xs font-medium text-gray-700">{fmtTime(sub.timeTaken)}</span>
                  <span className="text-[10px] text-gray-400">/ {fmtTime(EXAM_META.duration)}</span>
                </>
              ) : (
                <span className="text-xs text-gray-300 italic">—</span>
              )}
            </div>
          </div>
          {!isWriting && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Số câu đúng</p>
              <p className={`text-xs font-medium mt-0.5 ${sub.correctAnswers != null ? "text-gray-700" : "text-gray-300 italic"}`}>
                {sub.correctAnswers != null
                  ? `${sub.correctAnswers} / ${sub.totalQuestions ?? EXAM_META.totalQ}`
                  : "—"}
              </p>
            </div>
          )}
        </div>

        {/* ── Score block ── */}
        {sub.status === "Graded" && sub.score != null ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 uppercase font-semibold tracking-wide">Điểm số</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${scoreColor(sub.score, EXAM_META.maxScore)}`}>{sub.score}</span>
                <span className="text-sm text-gray-400">/ {EXAM_META.maxScore}</span>
              </div>
            </div>
            <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(sub.score, EXAM_META.maxScore)}`}
                style={{ width: `${(sub.score / EXAM_META.maxScore) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-right text-emerald-600 font-medium">
              {Math.round((sub.score / EXAM_META.maxScore) * 100)}% ·{" "}
              {sub.score >= 80 ? "Xuất sắc" : sub.score >= 65 ? "Khá" : sub.score >= 50 ? "Trung bình" : "Cần cải thiện"}
            </p>
          </div>
        ) : sub.status === "Pending" ? (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400 flex-shrink-0" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-xs text-blue-600 font-medium">Đang chờ giáo viên chấm điểm</span>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 flex-shrink-0" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="text-xs text-indigo-600 font-medium">Đã nộp bài — chờ chấm điểm</span>
          </div>
        )}
      </div>

      {/* ── Footer actions ── */}
      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-500 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-100 text-red-400 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          Archive
        </button>
        {(sub.status === "Pending" || sub.status === "Submitted") && (
          <button className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Chấm điểm
          </button>
        )}
        {sub.status === "Graded" && (
          <button className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Chỉnh điểm
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Ranking Table ────────────────────────────────────────────────────────────

function RankingTable({ submissions }: { submissions: ExamSubmission[] }) {
  const isWriting = EXAM_META.type === "Writing";

  // Rank: Graded first by score desc, then by timeTaken asc (faster = better)
  const ranked = useMemo(() => {
    const graded = submissions
      .filter(s => s.status === "Graded" && s.score != null)
      .sort((a, b) => {
        if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
        return (a.timeTaken ?? 999) - (b.timeTaken ?? 999);
      });
    const others = submissions.filter(s => s.status !== "Graded" || s.score == null);
    return [...graded, ...others];
  }, [submissions]);

  const gradedCount = ranked.filter(s => s.status === "Graded").length;
  const avgScore = gradedCount > 0
    ? Math.round(ranked.filter(s => s.score != null).reduce((acc, s) => acc + (s.score ?? 0), 0) / gradedCount * 10) / 10
    : null;
  const topScore = Math.max(...ranked.filter(s => s.score != null).map(s => s.score!), 0);

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Đã chấm", value: `${gradedCount} / ${submissions.length}`, color: "text-indigo-600" },
          { label: "Điểm TB", value: avgScore != null ? avgScore.toString() : "—", color: "text-amber-500" },
          { label: "Điểm cao nhất", value: topScore > 0 ? topScore.toString() : "—", color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Rank", "ID", "Học sinh", "Thời gian làm",
                  "Nộp lúc",
                  ...(!isWriting ? ["Câu đúng"] : []),
                  "Điểm",
                ].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ranked.map((s, idx) => {
                const isGraded = s.status === "Graded" && s.score != null;
                const rank = isGraded ? idx + 1 : null;

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${idx < 3 && isGraded ? "hover:bg-amber-50/40" : "hover:bg-gray-50/50"}`}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3">
                      {rank != null ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                          ${rank <= 3 ? RANK_COLORS[rank - 1] : "bg-gray-100 text-gray-500"}`}>
                          {rank}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* ID */}
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{s.studentId}</td>

                    {/* Student */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${avatarCls(SUBMISSIONS.findIndex(x => x.id === s.id))}`}>
                          {s.studentName.split(" ").map(w => w[0]).slice(-2).join("")}
                        </div>
                        <span className="font-medium text-gray-700 whitespace-nowrap">{s.studentName}</span>
                        {rank === 1 && (
                          <span className="text-xs">🏆</span>
                        )}
                      </div>
                    </td>

                    {/* Time taken */}
                    <td className="px-4 py-3">
                      {s.timeTaken != null ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min((s.timeTaken / EXAM_META.duration) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{fmtTime(s.timeTaken)}</span>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    {/* Submitted at */}
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {s.submittedAt ?? <span className="text-gray-300 italic">Chưa nộp</span>}
                    </td>

                    {/* Correct answers (non-writing) */}
                    {!isWriting && (
                      <td className="px-4 py-3">
                        {s.correctAnswers != null ? (
                          <span className="text-xs font-semibold text-gray-700">
                            {s.correctAnswers}
                            <span className="text-gray-400 font-normal"> / {s.totalQuestions ?? EXAM_META.totalQ}</span>
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    )}

                    {/* Score */}
                    <td className="px-4 py-3">
                      {isGraded && s.score != null ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${scoreColor(s.score, EXAM_META.maxScore)}`}>
                            {s.score}
                          </span>
                          <span className="text-[10px] text-gray-300">/ {EXAM_META.maxScore}</span>
                        </div>
                      ) : (
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_CFG[s.status].badge}`}>
                          {STATUS_CFG[s.status].label}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tiebreaker note */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            <span className="font-medium">Tiebreaker:</span> cùng điểm → thời gian làm bài ngắn hơn xếp trên ·{" "}
            Primary sort: điểm cao nhất
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ExamDetailProps {
  onBack?: () => void;
}

export default function ExamDetail({ onBack }: ExamDetailProps) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<ExamSubmissionStatus | "All">("All");
  const [page,         setPage]         = useState(1);
  const [rankOpen,     setRankOpen]     = useState(false);

  const tMeta = TYPE_META[EXAM_META.type];

  const filtered = useMemo(() => SUBMISSIONS.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.studentName.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)) &&
      (statusFilter === "All" || s.status === statusFilter)
    );
  }), [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage    = Math.min(page, totalPages);
  const paged      = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  const setFilter = (v: ExamSubmissionStatus | "All") => { setStatusFilter(v); setPage(1); };
  const setQ      = (v: string)                        => { setSearch(v);       setPage(1); };

  const filterOpts: { value: ExamSubmissionStatus | "All"; label: string; count: number; active: string }[] = [
    { value: "All",       label: "Tất cả",      count: SUBMISSIONS.length,                                         active: "bg-indigo-600 text-white border-indigo-600"   },
    { value: "Pending",   label: "Pending",     count: SUBMISSIONS.filter(s => s.status === "Pending").length,   active: "bg-blue-500 text-white border-blue-500"       },
    { value: "Submitted", label: "Submitted",   count: SUBMISSIONS.filter(s => s.status === "Submitted").length, active: "bg-indigo-500 text-white border-indigo-500"   },
    { value: "Graded",    label: "Graded",      count: SUBMISSIONS.filter(s => s.status === "Graded").length,    active: "bg-emerald-500 text-white border-emerald-500" },
  ];

  const gradedCount = SUBMISSIONS.filter(s => s.status === "Graded").length;
  const pct = Math.round((gradedCount / SUBMISSIONS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 md:px-8 py-3.5 flex items-center gap-2 text-sm border-b border-gray-50 flex-wrap">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Exams
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-gray-500 hidden sm:inline">{EXAM_META.className}</span>
          <span className="text-gray-200 hidden sm:inline">/</span>
          <span className="font-medium text-gray-700 truncate max-w-[200px]">{EXAM_META.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* ── Exam Header Card ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${tMeta.bg}`}>
              {tMeta.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-lg font-semibold text-gray-800">{EXAM_META.title}</h1>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${tMeta.bg} ${tMeta.color}`}>
                  {EXAM_META.type}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Tạo bởi <span className="text-gray-600 font-medium">{EXAM_META.createdBy}</span> ·{" "}
                {EXAM_META.createdAt} · {EXAM_META.createdTime}
              </p>
            </div>
            {/* Quick stats */}
            <div className="flex gap-5 flex-wrap text-center">
              {[
                { label: "Thời lượng",  value: `${EXAM_META.duration}m` },
                { label: "Max điểm",    value: EXAM_META.maxScore },
                { label: "Tổng câu",    value: EXAM_META.type !== "Writing" ? EXAM_META.totalQ : "—" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
                  <p className="text-base font-semibold text-gray-700 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall grading progress */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 font-medium">Tiến độ chấm bài</span>
                <span className="text-xs font-semibold text-gray-600">{gradedCount} / {SUBMISSIONS.length} đã chấm</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-indigo-600 flex-shrink-0">{pct}%</span>
          </div>
        </div>

        {/* ── Submissions section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Submissions</h2>
            <span className="text-xs text-gray-400">{filtered.length} kết quả</span>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-sm flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setQ(e.target.value)}
                placeholder="Tìm theo tên hoặc ID học sinh..."
                className="w-full pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
              {search && (
                <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOpts.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
                    ${statusFilter === opt.value
                      ? opt.active
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                >
                  {opt.label}
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold
                    ${statusFilter === opt.value ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {paged.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-14 flex flex-col items-center gap-3 text-gray-300">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              <p className="text-sm text-gray-400">Không tìm thấy submission nào</p>
              <button onClick={() => { setQ(""); setFilter("All"); }} className="text-xs text-indigo-500 hover:text-indigo-700">Xoá bộ lọc</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paged.map((sub, i) => (
                <SubmissionCard
                  key={sub.id}
                  sub={sub}
                  idx={SUBMISSIONS.findIndex(s => s.id === sub.id)}
                />
              ))}
            </div>
          )}

          <Pagination page={curPage} total={filtered.length} pageSize={PAGE_SIZE} onChange={p => setPage(p)} />
        </div>

        {/* ── Ranking Toggle Button ── */}
        <div className="space-y-3">
          <button
            onClick={() => setRankOpen(v => !v)}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 shadow-sm
              ${rankOpen
                ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200"
                : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400"}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{rankOpen ? "🏆" : "📊"}</span>
              <div className="text-left">
                <p className="font-semibold">Bảng xếp hạng</p>
                <p className={`text-xs font-normal mt-0.5 ${rankOpen ? "text-indigo-200" : "text-gray-400"}`}>
                  Xếp hạng theo điểm số · {gradedCount} học sinh đã có điểm
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 transition-all duration-200 ${rankOpen ? "rotate-180" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </button>

          {/* Collapsible ranking panel */}
          {rankOpen && (
            <div className="animate-[fadeSlideDown_0.2s_ease-out]">
              <RankingTable submissions={SUBMISSIONS} />
            </div>
          )}
        </div>

        <div className="pb-8" />
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}