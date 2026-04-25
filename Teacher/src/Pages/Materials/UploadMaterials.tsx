import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MaterialType = "PDF" | "PPTX" | "DOC" | "MP3" | "XLS" | "WAV";
type ViewMode = "grid" | "list";

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  subject: string;
  category: string;
  unit: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  colorKey: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_MATERIALS: Material[] = [
  { id: "M001", title: "Ch3 — Photosynthesis",         type: "PDF",  subject: "Biology",   category: "Lecture",    unit: "Unit 3", size: "2.4 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Apr 10", colorKey: "green"  },
  { id: "M002", title: "Algebra Fundamentals",          type: "PPTX", subject: "Math",      category: "Lecture",    unit: "Unit 1", size: "5.1 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Apr 8",  colorKey: "blue"   },
  { id: "M003", title: "WW2 Reference Pack",            type: "DOC",  subject: "History",   category: "Reference",  unit: "Unit 5", size: "1.8 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Apr 6",  colorKey: "amber"  },
  { id: "M004", title: "English Phonetics Audio",       type: "MP3",  subject: "English",   category: "Listening",  unit: "Unit 2", size: "8.2 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Apr 5",  colorKey: "purple" },
  { id: "M005", title: "Calculus Exercise Set",         type: "PDF",  subject: "Math",      category: "Exercise",   unit: "Unit 4", size: "0.9 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Apr 3",  colorKey: "coral"  },
  { id: "M006", title: "Grammar Guide — Advanced",      type: "DOC",  subject: "English",   category: "Reference",  unit: "Unit 1", size: "1.2 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Apr 2",  colorKey: "teal"   },
  { id: "M007", title: "Cell Biology Slides",           type: "PPTX", subject: "Biology",   category: "Lecture",    unit: "Unit 2", size: "3.7 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Mar 30", colorKey: "pink"   },
  { id: "M008", title: "Listening Test 4 Audio",        type: "WAV",  subject: "English",   category: "Listening",  unit: "Unit 4", size: "12.4 MB",uploadedBy: "Ms. Lan Anh",   uploadedAt: "Mar 28", colorKey: "purple" },
  { id: "M009", title: "Statistics Data Sheet",         type: "XLS",  subject: "Math",      category: "Exercise",   unit: "Unit 3", size: "0.6 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Mar 25", colorKey: "emerald"},
  { id: "M010", title: "Cold War Timeline",             type: "PDF",  subject: "History",   category: "Reference",  unit: "Unit 6", size: "1.1 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Mar 22", colorKey: "amber"  },
  { id: "M011", title: "Speaking Practice Script",      type: "DOC",  subject: "English",   category: "Exercise",   unit: "Unit 3", size: "0.4 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Mar 20", colorKey: "rose"   },
  { id: "M012", title: "Genetics — Intro Slides",       type: "PPTX", subject: "Biology",   category: "Lecture",    unit: "Unit 4", size: "4.2 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Mar 18", colorKey: "green"  },
  { id: "M013", title: "Trigonometry Workbook",         type: "PDF",  subject: "Math",      category: "Exercise",   unit: "Unit 5", size: "2.0 MB", uploadedBy: "Mr. Tran Long", uploadedAt: "Mar 15", colorKey: "blue"   },
  { id: "M014", title: "Renaissance Art Reference",     type: "PDF",  subject: "History",   category: "Reference",  unit: "Unit 4", size: "3.3 MB", uploadedBy: "Ms. Lan Anh",   uploadedAt: "Mar 12", colorKey: "amber"  },
];

const CATEGORIES = ["Lecture", "Reference", "Exercise", "Listening"] as const;
const TYPES: MaterialType[] = ["PDF", "PPTX", "DOC", "MP3", "XLS", "WAV"];
const PAGE_SIZE = 6;

// ─── Style Maps ───────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<MaterialType, { badge: string; label: string }> = {
  PDF:  { badge: "bg-red-100 text-red-600",      label: "PDF"  },
  PPTX: { badge: "bg-orange-100 text-orange-600", label: "PPTX" },
  DOC:  { badge: "bg-blue-100 text-blue-600",     label: "DOC"  },
  MP3:  { badge: "bg-purple-100 text-purple-600", label: "MP3"  },
  WAV:  { badge: "bg-violet-100 text-violet-600", label: "WAV"  },
  XLS:  { badge: "bg-emerald-100 text-emerald-600",label: "XLS" },
};

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  green:   { bg: "bg-emerald-50",  text: "text-emerald-600" },
  blue:    { bg: "bg-blue-50",     text: "text-blue-600"    },
  amber:   { bg: "bg-amber-50",    text: "text-amber-600"   },
  purple:  { bg: "bg-violet-50",   text: "text-violet-600"  },
  coral:   { bg: "bg-orange-50",   text: "text-orange-500"  },
  teal:    { bg: "bg-teal-50",     text: "text-teal-600"    },
  pink:    { bg: "bg-pink-50",     text: "text-pink-500"    },
  rose:    { bg: "bg-rose-50",     text: "text-rose-500"    },
  emerald: { bg: "bg-emerald-50",  text: "text-emerald-600" },
  gray:    { bg: "bg-gray-100",    text: "text-gray-500"    },
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function Checkbox({ checked, onChange, indeterminate }: { checked: boolean; onChange: () => void; indeterminate?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150
        ${checked || indeterminate
          ? "bg-indigo-600 border-indigo-600"
          : "bg-white border-gray-300 hover:border-indigo-400"}`}
    >
      {indeterminate && !checked ? (
        <span className="w-2.5 h-0.5 bg-white rounded" />
      ) : checked ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : null}
    </button>
  );
}

function Pagination({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
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
        const dot  = !show && (p === page - 2 || p === page + 2);
        if (dot)  return <span key={p} className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">…</span>;
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

// ─── Material Card — Grid ─────────────────────────────────────────────────────

function MaterialGridCard({
  material, selected, choosing, onToggle,
}: {
  material: Material;
  selected: boolean;
  choosing: boolean;
  onToggle: () => void;
}) {
  const col = COLOR_MAP[material.colorKey] ?? COLOR_MAP.gray;
  const typ = TYPE_STYLE[material.type];

  return (
    <div
      onClick={choosing ? onToggle : undefined}
      className={`relative bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 transition-all duration-200
        ${choosing ? "cursor-pointer" : ""}
        ${selected
          ? "border-indigo-400 ring-2 ring-indigo-200 shadow-indigo-100/50 shadow-md"
          : choosing
            ? "border-gray-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
            : "border-gray-100 hover:shadow-md hover:-translate-y-0.5"
        }`}
    >
      {/* Checkbox */}
      {choosing && (
        <div className="absolute top-3.5 right-3.5">
          <Checkbox checked={selected} onChange={onToggle} />
        </div>
      )}

      {/* Selected overlay tint */}
      {selected && (
        <div className="absolute inset-0 rounded-xl bg-indigo-500/[0.04] pointer-events-none" />
      )}

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${col.bg} ${col.text}`}>
        {material.title[0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-snug mb-0.5 pr-6 ${selected ? "text-indigo-700" : "text-gray-800"}`}>
          {material.title}
        </p>
        <p className="text-xs text-gray-400 truncate">{material.subject} · {material.category} · {material.unit}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${typ.badge}`}>
          {typ.label} · {material.size}
        </span>
        <span className="text-[10px] text-gray-300">{material.uploadedAt}</span>
      </div>
    </div>
  );
}

// ─── Material Card — List ─────────────────────────────────────────────────────

function MaterialListRow({
  material, selected, choosing, onToggle, isLast,
}: {
  material: Material;
  selected: boolean;
  choosing: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const col = COLOR_MAP[material.colorKey] ?? COLOR_MAP.gray;
  const typ = TYPE_STYLE[material.type];

  return (
    <div
      onClick={choosing ? onToggle : undefined}
      className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-150
        ${!isLast ? "border-b border-gray-50" : ""}
        ${choosing ? "cursor-pointer" : ""}
        ${selected
          ? "bg-indigo-50/60"
          : choosing
            ? "hover:bg-gray-50/60"
            : "hover:bg-gray-50/40"
        }`}
    >
      {/* Checkbox */}
      {choosing && (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onChange={onToggle} />
        </div>
      )}

      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${col.bg} ${col.text}`}>
        {material.title[0]}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${selected ? "text-indigo-700" : "text-gray-700"}`}>
          {material.title}
        </p>
        <p className="text-xs text-gray-400 truncate">{material.subject} · {material.category} · {material.unit}</p>
      </div>

      {/* Meta */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-400">{material.uploadedBy}</span>
        <span className="text-gray-200">·</span>
        <span className="text-xs text-gray-400">{material.uploadedAt}</span>
      </div>

      {/* Type badge */}
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex-shrink-0 ${typ.badge}`}>
        {typ.label} · {material.size}
      </span>

      {/* Selected indicator */}
      {selected && (
        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      )}
    </div>
  );
}

// ─── Selected Drawer ──────────────────────────────────────────────────────────

function SelectedDrawer({
  selected, materials, onRemove, onClear,
}: {
  selected: Set<string>;
  materials: Material[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (selected.size === 0) return null;
  const items = materials.filter((m) => selected.has(m.id));

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            {selected.size}
          </span>
          <span className="text-sm font-semibold text-indigo-700">Material đã chọn</span>
        </div>
        <button onClick={onClear} className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors">
          Bỏ tất cả
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((m) => {
          const typ = TYPE_STYLE[m.type];
          return (
            <div key={m.id} className="flex items-center gap-1.5 bg-white border border-indigo-100 rounded-lg px-2.5 py-1.5 shadow-sm">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typ.badge}`}>{m.type}</span>
              <span className="text-xs text-gray-700 font-medium max-w-[140px] truncate">{m.title}</span>
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                className="text-gray-300 hover:text-red-400 transition-colors ml-0.5"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Success Overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload thành công!</h3>
        <p className="text-sm text-gray-500 mb-6">
          Đã upload <span className="font-semibold text-indigo-600">{count} material</span> vào session thành công.
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

interface UploadMaterialProps {
  sessionName?: string;
  className?: string;
  onBack?: () => void;
}

export default function UploadMaterial({
  sessionName = "Thứ 2 - 4 - 6  ·  17:00 – 19:00",
  className   = "Class 10A",
  onBack,
}: UploadMaterialProps) {
  const [search,      setSearch]      = useState("");
  const [typeFilter,  setTypeFilter]  = useState<MaterialType | "All">("All");
  const [catFilter,   setCatFilter]   = useState<string>("All");
  const [viewMode,    setViewMode]    = useState<ViewMode>("grid");
  const [page,        setPage]        = useState(1);
  const [choosing,    setChoosing]    = useState(false);
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Filtering ──
  const filtered = useMemo(() => ALL_MATERIALS.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.title.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q)) &&
      (typeFilter === "All" || m.type === typeFilter) &&
      (catFilter  === "All" || m.category === catFilter)
    );
  }), [search, typeFilter, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage    = Math.min(page, totalPages);
  const paged      = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  // ── Selection helpers ──
  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSubmitError("");
  };

  const toggleAll = () => {
    const pagedIds = paged.map((m) => m.id);
    const allOnPage = pagedIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) pagedIds.forEach((id) => next.delete(id));
      else           pagedIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const allOnPageSelected = paged.length > 0 && paged.every((m) => selected.has(m.id));
  const someOnPageSelected = paged.some((m) => selected.has(m.id)) && !allOnPageSelected;

  const handleChooseMaterials = () => {
    setChoosing(true);
    setSubmitError("");
  };

  const handleCancelChoose = () => {
    setChoosing(false);
    setSelected(new Set());
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setSubmitError("Vui lòng chọn ít nhất 1 material để upload.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSuccess(true);
  };

  const handleFilter = (setter: (v: any) => void, value: any) => {
    setter(value); setPage(1);
  };

  return (
    <>
      {success && (
        <SuccessOverlay
          count={selected.size}
          onClose={() => { setSuccess(false); onBack?.(); }}
        />
      )}

      <div className="min-h-screen bg-gray-50">

        {/* ── Sticky header ── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          {/* Breadcrumb */}
          <div className="px-4 md:px-8 py-3.5 flex items-center gap-2 text-sm border-b border-gray-50">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Materials
            </button>
            <span className="text-gray-200">/</span>
            <span className="text-gray-500 hidden sm:inline">{className}</span>
            <span className="text-gray-200 hidden sm:inline">/</span>
            <span className="text-gray-500 hidden sm:inline truncate max-w-[160px]">{sessionName}</span>
            <span className="text-gray-200 hidden sm:inline">/</span>
            <span className="font-medium text-gray-700">Upload Material</span>
          </div>

          {/* Action bar */}
          <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-semibold text-gray-800">Upload Material</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {sessionName} · <span className="font-medium text-gray-600">{className}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-2 transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-2 transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>

              {!choosing ? (
                <button
                  onClick={handleChooseMaterials}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  Choose Materials
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelChoose}
                    className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                          <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
                        </svg>
                        Đang upload...
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Upload {selected.size > 0 ? `(${selected.size})` : ""}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5">

          {/* Search + filters */}
          <div className="flex flex-col gap-3">
            {/* Search row */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleFilter(setSearch, e.target.value)}
                  placeholder="Tìm tên material hoặc môn học..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                />
                {search && (
                  <button onClick={() => handleFilter(setSearch, "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 flex-shrink-0">
                {filtered.length} material{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Type pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Loại:</span>
              {(["All", ...TYPES] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilter(setTypeFilter, t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                    ${typeFilter === t
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-500"}`}
                >
                  {t}
                </button>
              ))}
              <span className="w-px h-4 bg-gray-200 mx-1" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Danh mục:</span>
              {(["All", ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleFilter(setCatFilter, c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                    ${catFilter === c
                      ? "bg-gray-700 text-white border-gray-700 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Selecting mode banner + select-all */}
          {choosing && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allOnPageSelected}
                  indeterminate={someOnPageSelected}
                  onChange={toggleAll}
                />
                <p className="text-sm text-indigo-700 font-medium">
                  {someOnPageSelected || allOnPageSelected
                    ? `${paged.filter((m) => selected.has(m.id)).length} / ${paged.length} trên trang này được chọn`
                    : "Tick để chọn material cần upload"}
                </p>
              </div>
              {selected.size > 0 && (
                <span className="text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 px-2.5 py-1 rounded-full">
                  {selected.size} đã chọn tổng
                </span>
              )}
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="text-sm text-red-500 font-medium">{submitError}</span>
            </div>
          )}

          {/* Selected drawer */}
          {choosing && selected.size > 0 && (
            <SelectedDrawer
              selected={selected}
              materials={ALL_MATERIALS}
              onRemove={(id) => toggle(id)}
              onClear={() => setSelected(new Set())}
            />
          )}

          {/* Empty state */}
          {paged.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-20 flex flex-col items-center gap-3 text-gray-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p className="text-sm text-gray-400">Không tìm thấy material nào</p>
              <button
                onClick={() => { handleFilter(setSearch, ""); handleFilter(setTypeFilter, "All"); handleFilter(setCatFilter, "All"); }}
                className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid view */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paged.map((m) => (
                <MaterialGridCard
                  key={m.id}
                  material={m}
                  selected={selected.has(m.id)}
                  choosing={choosing}
                  onToggle={() => toggle(m.id)}
                />
              ))}
            </div>
          ) : (
            /* List view */
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {paged.map((m, i) => (
                <MaterialListRow
                  key={m.id}
                  material={m}
                  selected={selected.has(m.id)}
                  choosing={choosing}
                  onToggle={() => toggle(m.id)}
                  isLast={i === paged.length - 1}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={curPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onChange={(p) => setPage(p)}
          />

          {/* Bottom submit bar — visible when choosing */}
          {choosing && (
            <div className="sticky bottom-6 flex justify-end pb-2">
              <div className="bg-white border border-gray-200 shadow-xl rounded-2xl px-5 py-3 flex items-center gap-4">
                <p className="text-sm text-gray-500">
                  {selected.size === 0
                    ? "Chưa chọn material nào"
                    : <><span className="font-semibold text-indigo-600">{selected.size}</span> material đã chọn</>
                  }
                </p>
                <button
                  onClick={handleCancelChoose}
                  className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || selected.size === 0}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/>
                      </svg>
                      Đang upload...
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload {selected.size > 0 ? `(${selected.size})` : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}