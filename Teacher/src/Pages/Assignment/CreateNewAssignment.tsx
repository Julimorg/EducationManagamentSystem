import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AssignmentType =
  | "Reading"
  | "Listening"
  | "Writing"
  | "Vocabulary"
  | "Grammar"
  | "Speaking"
  | "Full Test"
  | "Mini Test";

type AllowedExt = "pdf" | "doc" | "docx" | "mp3" | "wav";

interface UploadedFile {
  file: File;
  ext: AllowedExt;
  preview: string;
}

interface FormErrors {
  title?: string;
  deadline?: string;
  description?: string;
  type?: string;
  files?: string;
}

const ASSIGNMENT_TYPES: AssignmentType[] = [
  "Reading",
  "Listening",
  "Writing",
  "Vocabulary",
  "Grammar",
  "Speaking",
  "Full Test",
  "Mini Test",
];

const ALLOWED_EXTENSIONS: AllowedExt[] = ["pdf", "doc", "docx", "mp3", "wav"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg",
  "audio/wav",
];

const EXT_ICON: Record<AllowedExt, { icon: string; color: string; bg: string }> = {
  pdf:  { icon: "PDF",  color: "text-red-600",    bg: "bg-red-50 border-red-200" },
  doc:  { icon: "DOC",  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  docx: { icon: "DOCX", color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  mp3:  { icon: "MP3",  color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  wav:  { icon: "WAV",  color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
};

const TYPE_META: Record<AssignmentType, { emoji: string; color: string; bg: string }> = {
  Reading:    { emoji: "📖", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  Listening:  { emoji: "🎧", color: "text-purple-700",  bg: "bg-purple-50 border-purple-200" },
  Writing:    { emoji: "✍️", color: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
  Vocabulary: { emoji: "📝", color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  Grammar:    { emoji: "🔤", color: "text-orange-700",  bg: "bg-orange-50 border-orange-200" },
  Speaking:   { emoji: "🎤", color: "text-rose-700",    bg: "bg-rose-50 border-rose-200" },
  "Full Test":{ emoji: "📋", color: "text-indigo-700",  bg: "bg-indigo-50 border-indigo-200" },
  "Mini Test":{ emoji: "⚡", color: "text-teal-700",    bg: "bg-teal-50 border-teal-200" },
};

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

function RichToolbarBtn({
  title, onClick, children,
}: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors text-xs font-medium"
    >
      {children}
    </button>
  );
}

function RichTextEditor({
  value, onChange, error,
}: { value: string; onChange: (v: string) => void; error?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${error ? "border-red-300 ring-1 ring-red-200" : "border-gray-200 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200"}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">
        <RichToolbarBtn title="Bold" onClick={() => exec("bold")}>
          <strong>B</strong>
        </RichToolbarBtn>
        <RichToolbarBtn title="Italic" onClick={() => exec("italic")}>
          <em>I</em>
        </RichToolbarBtn>
        <RichToolbarBtn title="Underline" onClick={() => exec("underline")}>
          <span className="underline">U</span>
        </RichToolbarBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <RichToolbarBtn title="Bullet list" onClick={() => exec("insertUnorderedList")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </RichToolbarBtn>
        <RichToolbarBtn title="Numbered list" onClick={() => exec("insertOrderedList")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </RichToolbarBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <RichToolbarBtn title="Indent" onClick={() => exec("indent")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="9 12 13 9 9 6"/><line x1="13" y1="12" x2="21" y2="12"/></svg>
        </RichToolbarBtn>
        <RichToolbarBtn title="Outdent" onClick={() => exec("outdent")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="11 12 7 9 11 6"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
        </RichToolbarBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <RichToolbarBtn title="Align left" onClick={() => exec("justifyLeft")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </RichToolbarBtn>
        <RichToolbarBtn title="Align center" onClick={() => exec("justifyCenter")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </RichToolbarBtn>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <RichToolbarBtn title="Clear formatting" onClick={() => exec("removeFormat")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><line x1="3" y1="3" x2="21" y2="21" strokeWidth="1.5"/></svg>
        </RichToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Nhập đề bài, yêu cầu, hướng dẫn cho học sinh..."
        className="min-h-[180px] p-4 text-sm text-gray-700 leading-relaxed focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
      />

      {error && (
        <div className="px-3 py-2 bg-red-50 border-t border-red-100 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────

function FileUploadZone({
  files, onAdd, onRemove, error,
}: {
  files: UploadedFile[];
  onAdd: (files: UploadedFile[]) => void;
  onRemove: (idx: number) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const getExt = (name: string): AllowedExt | null => {
    const ext = name.split(".").pop()?.toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext as AllowedExt) ? (ext as AllowedExt) : null;
  };

  const processFiles = (rawFiles: FileList | null) => {
    if (!rawFiles) return;
    const valid: UploadedFile[] = [];
    Array.from(rawFiles).forEach((file) => {
      const ext = getExt(file.name);
      if (ext) {
        valid.push({ file, ext, preview: file.name });
      }
    });
    if (valid.length) onAdd(valid);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${dragging ? "border-indigo-400 bg-indigo-50/50" : error ? "border-red-300 bg-red-50/30 hover:border-red-400" : "border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.mp3,.wav"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${dragging ? "bg-indigo-100" : "bg-gray-100"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={dragging ? "text-indigo-500" : "text-gray-400"} strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>

        <p className={`text-sm font-medium ${dragging ? "text-indigo-600" : "text-gray-600"}`}>
          {dragging ? "Thả file vào đây..." : "Kéo thả hoặc click để upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Hỗ trợ: <span className="font-medium text-gray-500">PDF, DOC, DOCX, MP3, WAV</span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => {
            const meta = EXT_ICON[f.ext];
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${meta.bg}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{f.file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(f.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Form Field Wrapper ───────────────────────────────────────────────────────

function Field({
  label, required, hint, error, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────

function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-[fadeInScale_0.25s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Assignment Created!</h3>
        <p className="text-sm text-gray-500 mb-6">Đã tạo assignment thành công và gửi cho học sinh.</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Về danh sách
        </button>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

interface NewAssignmentFormProps {
  className?: string;
  onBack?: () => void;
}

export default function NewAssignmentForm({ className = "Class 10A", onBack }: NewAssignmentFormProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [assignType, setAssignType] = useState<AssignmentType | "">("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Strip HTML tags for empty check
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  // Validate
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!title.trim()) errs.title = "Tên assignment không được để trống.";
    else if (title.trim().length < 5) errs.title = "Tên phải có ít nhất 5 ký tự.";

    if (hasDeadline && !deadline) errs.deadline = "Vui lòng chọn thời hạn nộp bài.";
    if (hasDeadline && deadline) {
      const dl = new Date(deadline);
      if (dl <= new Date()) errs.deadline = "Deadline phải là thời điểm trong tương lai.";
    }

    if (!stripHtml(description)) errs.description = "Đề bài không được để trống.";
    else if (stripHtml(description).length < 20) errs.description = "Đề bài quá ngắn, tối thiểu 20 ký tự.";

    if (!assignType) errs.type = "Vui lòng chọn loại assignment.";

    if (files.length === 0) errs.files = "Vui lòng upload ít nhất 1 file đính kèm.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSuccess(true);
  };

  const handleAddFiles = (newFiles: UploadedFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setErrors((e) => ({ ...e, files: undefined }));
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const todayMin = new Date();
  todayMin.setMinutes(todayMin.getMinutes() + 30);
  const minDateTime = todayMin.toISOString().slice(0, 16);

  return (
    <>
      {success && <SuccessOverlay onClose={() => { setSuccess(false); onBack?.(); }} />}

      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Assignments
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-sm text-gray-500">{className}</span>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-gray-700">New Assignment</span>
        </div>

        {/* Form container */}
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Tạo Assignment mới</h1>
            <p className="text-sm text-gray-400 mt-1">Điền đầy đủ thông tin để giao bài cho học sinh <span className="font-medium text-gray-600">{className}</span>.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── Title ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-600" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h2>
              </div>

              {/* Assignment name */}
              <Field label="Tên Assignment" required error={errors.title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((err) => ({ ...err, title: undefined })); }}
                  placeholder="VD: IELTS Writing Task 2 — Opinion Essay"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all ${errors.title ? "border-red-300 focus:ring-red-200 focus:border-red-300" : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-300"}`}
                />
              </Field>

              {/* Assignment type */}
              <Field label="Loại Assignment" required error={errors.type}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ASSIGNMENT_TYPES.map((t) => {
                    const meta = TYPE_META[t];
                    const isActive = assignType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setAssignType(t); setErrors((err) => ({ ...err, type: undefined })); }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          isActive
                            ? `${meta.bg} ${meta.color} border-current shadow-sm`
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        } ${errors.type ? "border-red-200" : ""}`}
                      >
                        <span className="text-base leading-none">{meta.emoji}</span>
                        <span className="text-xs">{t}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {/* ── Deadline ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-600" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Deadline</h2>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer w-fit group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hasDeadline}
                    onChange={(e) => {
                      setHasDeadline(e.target.checked);
                      if (!e.target.checked) { setDeadline(""); setErrors((err) => ({ ...err, deadline: undefined })); }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${hasDeadline ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300 group-hover:border-indigo-300"}`}>
                    {hasDeadline && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 select-none">
                  Assignment này có <span className="font-medium">deadline</span>
                </span>
              </label>

              {/* Date picker — shown when checked */}
              {hasDeadline && (
                <div className="pl-8 animate-[fadeSlideDown_0.2s_ease-out]">
                  <Field label="Thời hạn nộp bài" required error={errors.deadline}>
                    <div className="relative w-fit">
                      <input
                        type="datetime-local"
                        value={deadline}
                        min={minDateTime}
                        onChange={(e) => { setDeadline(e.target.value); setErrors((err) => ({ ...err, deadline: undefined })); }}
                        className={`px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 transition-all cursor-pointer ${errors.deadline ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-300"}`}
                      />
                    </div>
                    {deadline && (
                      <p className="text-xs text-indigo-600 mt-1.5 flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Deadline: {new Date(deadline).toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" })}
                      </p>
                    )}
                  </Field>
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Đề bài</h2>
              </div>

              <Field label="Nội dung đề bài" required hint={`${stripHtml(description).length} ký tự`} error={errors.description}>
                <RichTextEditor
                  value={description}
                  onChange={(v) => { setDescription(v); setErrors((err) => ({ ...err, description: undefined })); }}
                  error={errors.description}
                />
              </Field>
            </div>

            {/* ── File Upload ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-600" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">File đính kèm</h2>
                </div>
                {files.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded-full">
                    {files.length} file{files.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <FileUploadZone
                files={files}
                onAdd={handleAddFiles}
                onRemove={handleRemoveFile}
                error={errors.files}
              />
            </div>

            {/* ── Summary preview ── */}
            {(title || assignType || files.length > 0) && (
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  {assignType && (
                    <span className="text-2xl leading-none">{TYPE_META[assignType]?.emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{title || "Chưa đặt tên..."}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {assignType && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${TYPE_META[assignType]?.bg} ${TYPE_META[assignType]?.color}`}>
                          {assignType}
                        </span>
                      )}
                      {hasDeadline && deadline && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                          Due {new Date(deadline).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                      {!hasDeadline && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                          No deadline
                        </span>
                      )}
                      {files.length > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-medium">
                          {files.length} file{files.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Submit ── */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-8">
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
                className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/></svg>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Tạo Assignment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Keyframe animations (injected inline for portability) */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}