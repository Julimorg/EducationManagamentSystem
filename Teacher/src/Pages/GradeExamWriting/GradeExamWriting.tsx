import { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GradeStatus = "Pending" | "Graded" | "Draft";

interface StudentSubmission {
  id: string;
  initials: string;
  name: string;
  session: string;
  submittedAt: string;
  timeTaken: number;
  wordCount: number;
  status: GradeStatus;
  score?: number;
  draftScore?: number;
  essay: string; // raw text content
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EXAM_META = {
  title:       "Writing Task 2 Mock",
  type:        "Writing" as const,
  createdBy:   "Mr. Tran Long",
  createdAt:   "Apr 15, 2025",
  createdTime: "09:00",
  duration:    60,
  maxScore:    100,
  prompt:      "Some people believe that the best way to increase road safety is to increase the minimum legal age for driving cars or riding motorbikes. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
  taskRequirement: "Write at least 250 words.",
  className:   "Class 10A",
  sessionName: "Thứ 2 - 4 - 6  ·  17:00 – 19:00",
};

const STUDENTS: StudentSubmission[] = [
  {
    id: "S001", initials: "AN", name: "Alice Nguyen", session: "Morning",
    submittedAt: "Apr 15, 09:52", timeTaken: 52, wordCount: 312, status: "Graded", score: 87,
    essay: `In recent years, road safety has become an increasingly pressing concern in many countries around the world. Some argue that raising the minimum driving age is the most effective solution to reduce traffic accidents. While I partially agree with this view, I believe that a combination of measures would be more comprehensive and effective.\n\nOn the one hand, there are compelling reasons to support raising the minimum driving age. Young drivers, particularly teenagers, are statistically more likely to be involved in accidents due to their lack of experience and tendency to take risks. Their brains are still developing, especially the prefrontal cortex responsible for decision-making and impulse control. For example, studies in the United States have shown that states with higher minimum driving ages report fewer teenage traffic fatalities. Therefore, delaying when young people can drive could indeed save lives.\n\nOn the other hand, simply raising the age limit may not address the root causes of road accidents. Many serious crashes involve adult drivers who engage in dangerous behaviours such as drink-driving, speeding, or using mobile phones while driving. In these cases, the age of the driver is irrelevant. What matters more is the quality of driver training and the strictness of enforcement. Countries like Germany, which have rigorous driving tests and strong traffic law enforcement, tend to have lower accident rates regardless of the age at which people learn to drive.\n\nIn conclusion, while increasing the minimum legal age for driving may contribute to improved road safety among young people, it is not a panacea. A more holistic approach — combining better driver education, stricter law enforcement, and investment in public transport — would be far more effective in the long term.`,
  },
  {
    id: "S002", initials: "BT", name: "Bob Tran", session: "Morning",
    submittedAt: "Apr 15, 10:05", timeTaken: 65, wordCount: 278, status: "Pending",
    essay: `Road safety is a major problem in the modern world. Many people die every year because of traffic accidents. I think that raising the minimum age for driving is a good idea because young people are not responsible enough to drive safely.\n\nFirstly, teenagers often drive too fast and do not follow the rules of the road. They want to show off to their friends and this causes accidents. If the minimum age was higher, for example 21 instead of 18, then fewer young people would be driving and there would be fewer accidents caused by this group.\n\nSecondly, older drivers have more life experience. They understand the consequences of their actions better than teenagers do. A 21-year-old is more likely to be careful on the road than a 17-year-old who just got their license last week.\n\nHowever, I also think that there are other important measures. For example, better public transport would mean that fewer people need to drive. Also, stricter penalties for breaking traffic laws would make all drivers more careful, not just young ones.\n\nIn conclusion, I agree that raising the minimum driving age could help to improve road safety. But this should be combined with other measures such as better education and stricter enforcement of traffic laws. Only by taking a comprehensive approach can we hope to significantly reduce the number of road accidents.`,
  },
  {
    id: "S003", initials: "CL", name: "Carol Le", session: "Evening",
    submittedAt: "Apr 15, 09:48", timeTaken: 48, wordCount: 341, status: "Draft", draftScore: 72,
    essay: `The issue of road safety is one that affects communities worldwide, claiming thousands of lives annually. A frequently proposed remedy is to increase the minimum legal age for operating motor vehicles. In this essay, I will examine both sides of this argument before presenting my own position.\n\nProponents of raising the driving age contend that adolescents lack the cognitive maturity required for safe driving. Neurological research suggests that the human brain does not fully develop until the mid-twenties, with risk assessment and impulse control being among the last functions to mature. This biological reality may explain why drivers aged 16 to 19 are involved in a disproportionately high number of accidents relative to their share of the driving population. Australia's graduated licensing system, which restricts new young drivers before granting full licences, has been credited with reducing youth road fatalities.\n\nNevertheless, opponents argue that age alone is an oversimplified metric. Accident rates are influenced by a multitude of factors including road conditions, vehicle safety standards, and driver behaviour across all age groups. Raising the driving age might merely shift the problem rather than resolve it, as inexperienced drivers would simply begin their learning journey later. Furthermore, in rural areas where public transport infrastructure is limited, restricting young people from driving could severely impact their mobility and independence.\n\nHaving considered both perspectives, I believe that a nuanced approach is most appropriate. Rather than arbitrarily raising the minimum age, governments should invest in high-quality driver training programmes, implement graduated licensing schemes, and enforce zero-tolerance policies on dangerous driving behaviours. Such measures would address road safety more systematically and equitably.\n\nIn conclusion, while there is merit in the proposal to raise the minimum driving age, it should not be pursued in isolation. A comprehensive strategy targeting driver competence and behaviour across all age groups would yield more sustainable improvements in road safety.`,
  },
  {
    id: "S004", initials: "DP", name: "David Pham", session: "Morning",
    submittedAt: "Apr 15, 09:55", timeTaken: 55, wordCount: 265, status: "Pending",
    essay: `Nowadays, traffic accidents are a very serious problem. Many governments are trying to find ways to make roads safer for everyone. One idea that has been proposed is to raise the minimum age at which people are allowed to drive or ride motorbikes. In this essay, I will discuss the advantages and disadvantages of this proposal.\n\nThere are several advantages to raising the minimum driving age. Young drivers tend to be less careful and more likely to speed or drive recklessly. If they are older when they start driving, they may be more mature and responsible. For instance, raising the age from 18 to 21 could mean that new drivers have better judgement.\n\nHowever, there are also disadvantages. Many young people need to drive to get to work or school, especially in places without good public transport. If the age limit is raised, this could make life very difficult for them. Additionally, the problem of road accidents is not limited to young drivers. Many accidents involve middle-aged or older drivers who are distracted or driving under the influence of alcohol.\n\nIn my opinion, raising the minimum age alone is not enough. We also need better driving education, stricter penalties for dangerous driving, and improved road infrastructure. These measures would help to reduce accidents for all age groups, not just the young.\n\nTo conclude, while I agree that young drivers can be a risk on the roads, simply raising the age limit is not a complete solution. A more comprehensive approach to road safety is needed.`,
  },
  {
    id: "S005", initials: "LV", name: "Lan Vu", session: "Morning",
    submittedAt: "Apr 15, 10:02", timeTaken: 62, wordCount: 295, status: "Pending",
    essay: `Traffic accidents cause tremendous harm to individuals and communities alike. Each year, thousands of people are killed or seriously injured on roads across the globe. One proposed measure to address this problem is to raise the minimum age for obtaining a driving licence. I largely support this idea, though I acknowledge that it must be part of a broader strategy.\n\nThe primary argument in favour of a higher minimum driving age centres on the developmental stage of young people. Adolescents are still undergoing significant cognitive development, which affects their ability to anticipate hazards, manage stress, and make sound decisions under pressure. This is reflected in crash statistics: in many countries, drivers aged 17–19 are involved in accidents at a rate three to four times higher than that of drivers in their thirties. Postponing access to driving licences by even a few years could meaningfully reduce these figures.\n\nThat said, other factors also contribute substantially to road accidents. Fatigue, substance use, and distraction due to mobile phones are responsible for a significant proportion of crashes involving drivers of all ages. A policy focused exclusively on young drivers may therefore be insufficient. Moreover, economic and social considerations must be weighed: in regions underserved by public transport, driving is a necessity rather than a luxury, and restricting access could disproportionately disadvantage young people from less privileged backgrounds.\n\nIn conclusion, I believe that raising the minimum driving age is a worthwhile measure that could prevent many accidents involving inexperienced young drivers. However, policymakers should also invest in driver education, vehicle safety technology, and public transportation to create a safer road environment for all users.`,
  },
];

// ─── Style & config ───────────────────────────────────────────────────────────

const STATUS_CFG: Record<GradeStatus, { badge: string; dot: string; label: string }> = {
  Pending: { badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-400",    label: "Pending"  },
  Graded:  { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Graded"   },
  Draft:   { badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-400",   label: "Draft"    },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-600",
];

const SCORE_BANDS = [
  { min: 90, label: "Band 9.0",   color: "text-emerald-600", bar: "bg-emerald-500" },
  { min: 80, label: "Band 8.0+",  color: "text-blue-600",    bar: "bg-blue-500"    },
  { min: 70, label: "Band 7.0+",  color: "text-indigo-600",  bar: "bg-indigo-500"  },
  { min: 60, label: "Band 6.0+",  color: "text-amber-600",   bar: "bg-amber-400"   },
  { min: 0,  label: "Below 6.0",  color: "text-red-500",     bar: "bg-red-400"     },
];

function getScoreBand(score: number) {
  return SCORE_BANDS.find(b => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

function ToolBtn({ title, onClick, active, children }: {
  title: string; onClick: () => void; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button type="button" title={title} onClick={onClick}
      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium transition-colors
        ${active ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      {children}
    </button>
  );
}

// ─── Annotation Editor (student essay with teacher markup) ───────────────────

function EssayAnnotator({ essay, studentName }: { essay: string; studentName: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [highlightColor, setHighlightColor] = useState<string>("#fef08a"); // yellow

  // Init editor content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      // Convert plain text paragraphs to HTML
      const html = essay
        .split("\n\n")
        .filter(Boolean)
        .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
      editorRef.current.innerHTML = html;
      updateCounts();
    }
  }, [essay]);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }, []);

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(text.length);
  };

  const HIGHLIGHT_COLORS = [
    { hex: "#fef08a", label: "Yellow", title: "Highlight" },
    { hex: "#bbf7d0", label: "Green",  title: "Good"      },
    { hex: "#fecaca", label: "Red",    title: "Error"     },
    { hex: "#bfdbfe", label: "Blue",   title: "Note"      },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Student header */}
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bài làm của học sinh</p>
          <p className="text-xs text-gray-400 mt-0.5">{studentName}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{wordCount} từ</span>
          <span className={`font-medium ${wordCount >= 250 ? "text-emerald-600" : "text-amber-500"}`}>
            {wordCount >= 250 ? "✓ Đủ từ" : `Thiếu ${250 - wordCount} từ`}
          </span>
        </div>
      </div>

      {/* Annotation toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 bg-white flex-shrink-0 flex-wrap">
        {/* Text format */}
        <ToolBtn title="Bold" onClick={() => exec("bold")}><strong>B</strong></ToolBtn>
        <ToolBtn title="Italic" onClick={() => exec("italic")}><em>I</em></ToolBtn>
        <ToolBtn title="Underline" onClick={() => exec("underline")}><span className="underline">U</span></ToolBtn>
        <ToolBtn title="Strikethrough" onClick={() => exec("strikeThrough")}>
          <span className="line-through text-gray-400">S</span>
        </ToolBtn>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Highlight colors */}
        <span className="text-[10px] text-gray-400 font-medium mr-1">Highlight:</span>
        {HIGHLIGHT_COLORS.map(c => (
          <button
            key={c.hex}
            type="button"
            title={c.title}
            onClick={() => {
              setHighlightColor(c.hex);
              exec("hiliteColor", c.hex);
            }}
            className={`w-5 h-5 rounded border-2 transition-all ${
              highlightColor === c.hex ? "border-gray-600 scale-110" : "border-gray-200 hover:border-gray-400"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Text color */}
        <ToolBtn title="Text color — Red (error)" onClick={() => exec("foreColor", "#ef4444")}>
          <span className="text-red-500 font-bold text-base leading-none">A</span>
        </ToolBtn>
        <ToolBtn title="Text color — Green (good)" onClick={() => exec("foreColor", "#16a34a")}>
          <span className="text-emerald-600 font-bold text-base leading-none">A</span>
        </ToolBtn>
        <ToolBtn title="Reset color" onClick={() => exec("foreColor", "#374151")}>
          <span className="text-gray-700 font-bold text-base leading-none">A</span>
        </ToolBtn>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Comment insert */}
        <ToolBtn title="Add inline comment" onClick={() => {
          const sel = window.getSelection();
          if (sel && sel.toString()) {
            exec("insertHTML", `<span style="background:#eff6ff;border-bottom:2px solid #3b82f6;cursor:help;" title="Teacher comment">${sel.toString()}</span>`);
          }
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </ToolBtn>

        {/* Undo / Redo */}
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn title="Undo" onClick={() => exec("undo")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => exec("redo")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
        </ToolBtn>

        <div className="ml-auto text-[10px] text-gray-300">{charCount} ký tự</div>
      </div>

      {/* Essay editable */}
      <div className="flex-1 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={updateCounts}
          className="min-h-full px-8 py-6 text-sm text-gray-700 leading-8 focus:outline-none
            [&>p]:mb-4 [&>p]:last:mb-0"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        />
      </div>

      {/* Annotation legend */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-2 flex items-center gap-4 flex-shrink-0">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Chú thích:</span>
        {[
          { color: "#fef08a", label: "Highlight chung" },
          { color: "#bbf7d0", label: "Tốt"             },
          { color: "#fecaca", label: "Lỗi"             },
          { color: "#bfdbfe", label: "Ghi chú"         },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border border-gray-300" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Grading Sidebar ──────────────────────────────────────────────────────────

interface GradingSidebarProps {
  student: StudentSubmission;
  studentIndex: number;
  onSave: (score: number, feedback: string, draft: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

function GradingSidebar({
  student, studentIndex, onSave, onNext, onPrev, hasNext, hasPrev,
}: GradingSidebarProps) {
  const [score,    setScore]    = useState(
    student.draftScore != null ? String(student.draftScore)
    : student.score    != null ? String(student.score)
    : ""
  );
  const [feedback, setFeedback] = useState("");
  const [saving,   setSaving]   = useState<"publish" | "draft" | null>(null);
  const [saved,    setSaved]    = useState<"publish" | "draft" | null>(null);

  // Reset when student changes
  const prevId = useRef(student.id);
  if (prevId.current !== student.id) {
    prevId.current = student.id;
    setScore(student.draftScore != null ? String(student.draftScore) : student.score != null ? String(student.score) : "");
    setFeedback("");
  }

  const maxScore   = EXAM_META.maxScore;
  const scoreNum   = parseFloat(score);
  const scoreValid = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= maxScore;
  const band       = scoreValid ? getScoreBand(scoreNum) : null;

  const handleSave = async (draft: boolean) => {
    if (!scoreValid) return;
    setSaving(draft ? "draft" : "publish");
    await new Promise(r => setTimeout(r, 900));
    setSaving(null);
    setSaved(draft ? "draft" : "publish");
    onSave(scoreNum, feedback, draft);
    setTimeout(() => setSaved(null), 2500);
    if (!draft && hasNext) setTimeout(onNext, 500);
  };

  const cfg = STATUS_CFG[student.status];

  // IELTS Writing criteria (simplified)
  const CRITERIA = [
    { label: "Task Achievement",      short: "TA", max: 25 },
    { label: "Coherence & Cohesion",  short: "CC", max: 25 },
    { label: "Lexical Resource",       short: "LR", max: 25 },
    { label: "Grammatical Range",      short: "GR", max: 25 },
  ];

  const [criteria, setCriteria] = useState<Record<string, string>>(
    Object.fromEntries(CRITERIA.map(c => [c.short, ""]))
  );

  const criteriaTotal = Object.values(criteria)
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v))
    .reduce((a, b) => a + b, 0);

  const applyCriteriaTotal = () => {
    if (criteriaTotal > 0 && criteriaTotal <= maxScore) {
      setScore(String(criteriaTotal));
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">

      {/* Student info */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[studentIndex % AVATAR_COLORS.length]}`}>
            {student.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">{student.name}</p>
            <p className="text-xs text-gray-400">{student.submittedAt} · {student.session}</p>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        {/* Submission stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "Từ",       value: student.wordCount, warn: student.wordCount < 250 },
            { label: "Phút làm", value: student.timeTaken },
            { label: "Giờ nộp", value: student.submittedAt.split(", ")[1] },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
              <p className={`text-sm font-semibold ${s.warn ? "text-amber-500" : "text-gray-700"}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable grading form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Previous grade info */}
        {student.status === "Graded" && student.score != null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 flex-shrink-0" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <p className="text-xs text-emerald-700 font-medium">Đã chấm: <span className="font-bold">{student.score}/{maxScore}</span> — cập nhật bên dưới để chỉnh</p>
          </div>
        )}
        {student.status === "Draft" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
            <p className="text-xs text-amber-700 font-medium">Bản nháp — học sinh chưa nhận điểm</p>
          </div>
        )}

        {/* Criteria breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tiêu chí chấm điểm</p>
            <button
              onClick={applyCriteriaTotal}
              className="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              Áp dụng tổng → điểm
            </button>
          </div>
          <div className="space-y-2">
            {CRITERIA.map(c => (
              <div key={c.short} className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-400 w-6 flex-shrink-0">{c.short}</span>
                <div className="flex-1 text-xs text-gray-500 truncate">{c.label}</div>
                <input
                  type="number"
                  min={0}
                  max={c.max}
                  value={criteria[c.short]}
                  onChange={e => setCriteria(prev => ({ ...prev, [c.short]: e.target.value }))}
                  placeholder="—"
                  className="w-14 text-center text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                />
                <span className="text-[10px] text-gray-300 w-6">/{c.max}</span>
              </div>
            ))}
          </div>
          {criteriaTotal > 0 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Tổng tiêu chí</span>
              <span className={`text-sm font-bold ${criteriaTotal > maxScore ? "text-red-500" : "text-indigo-600"}`}>
                {criteriaTotal} / {maxScore}
              </span>
            </div>
          )}
        </div>

        {/* Total score */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Điểm tổng <span className="text-gray-400 font-normal normal-case">(/ {maxScore})</span>
          </label>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="e.g. 75"
            className={`w-full text-center text-3xl font-bold py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all
              ${!score ? "border-gray-200 text-gray-300 focus:ring-indigo-200 focus:border-indigo-300"
                : scoreValid ? "border-indigo-300 ring-1 ring-indigo-200 text-indigo-700"
                : "border-red-300 ring-1 ring-red-200 text-red-500"}`}
          />
          {score && !scoreValid && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
              Điểm phải từ 0 đến {maxScore}
            </p>
          )}
          {scoreValid && band && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${band.color}`}>{band.label}</span>
                <span className="text-gray-400">{Math.round((scoreNum / maxScore) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${band.bar}`}
                  style={{ width: `${(scoreNum / maxScore) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Nhận xét cho học sinh
          </label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={"Ví dụ:\n• Task Achievement: Trả lời đúng câu hỏi, có lập luận rõ ràng...\n• Lexical Resource: Từ vựng phong phú nhưng một số chỗ dùng sai...\n• Cần cải thiện: độ liên kết giữa các đoạn..."}
            rows={8}
            className="w-full px-3.5 py-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all leading-relaxed"
          />
          <p className="text-[10px] text-gray-300 text-right mt-1">{feedback.length} ký tự</p>
        </div>
      </div>

      {/* ── Footer actions ── */}
      <div className="px-5 py-4 border-t border-gray-100 space-y-2.5 flex-shrink-0">
        {/* Publish */}
        <button
          onClick={() => handleSave(false)}
          disabled={!scoreValid || saving !== null}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {saving === "publish" ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.9"/></svg>Saving...</>
          ) : saved === "publish" ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Save grade &amp; publish</>
          )}
        </button>

        {/* Draft + Nav row */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={!scoreValid || saving !== null}
            className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving === "draft" ? "Saving..." : saved === "draft" ? "Draft saved ✓" : "Save as draft"}
          </button>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            title="Previous student"
            className="w-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            title="Next student"
            className="w-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Student List Sidebar (left) ──────────────────────────────────────────────

function StudentListSidebar({
  students, activeId, sidebarOpen, onSelect, onClose,
}: {
  students: StudentSubmission[];
  activeId: string;
  sidebarOpen: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const graded = students.filter(s => s.status === "Graded").length;
  const pct    = Math.round((graded / students.length) * 100);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-100 flex flex-col w-56
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:shadow-none lg:h-auto lg:min-h-screen
      `}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 text-sm">Submissions</h3>
            <button onClick={onClose} className="flex lg:hidden w-7 h-7 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-xs text-gray-400">{students.length} total · {graded} graded</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-gray-400">{pct}%</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {students.map((s, i) => {
            const cfg      = STATUS_CFG[s.status];
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => { onSelect(s.id); onClose(); }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all border-l-2
                  ${isActive ? "bg-indigo-50 border-l-indigo-500" : "border-l-transparent hover:bg-gray-50"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? "text-indigo-700" : "text-gray-700"}`}>{s.name}</p>
                  {s.status === "Graded" && s.score != null
                    ? <p className="text-[10px] text-emerald-600 font-semibold">{s.score}/{EXAM_META.maxScore}</p>
                    : <p className="text-[10px] text-gray-400">{s.wordCount}w · {s.timeTaken}m</p>}
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface GradeExamWritingProps {
  onBack?: () => void;
}

export default function GradeExamWriting({ onBack }: GradeExamWritingProps) {
  const [students,    setStudents]    = useState<StudentSubmission[]>(STUDENTS);
  const [activeId,    setActiveId]    = useState(
    STUDENTS.find(s => s.status === "Pending" || s.status === "Draft")?.id ?? STUDENTS[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promptOpen,  setPromptOpen]  = useState(false);

  const activeIdx     = students.findIndex(s => s.id === activeId);
  const activeStudent = students[activeIdx]!;

  const handleSave = (id: string, score: number, _feedback: string, draft: boolean) => {
    setStudents(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: draft ? "Draft" : "Graded", score: draft ? s.score : score, draftScore: draft ? score : undefined }
        : s
    ));
  };

  const goNext = () => { if (activeIdx < students.length - 1) setActiveId(students[activeIdx + 1].id); };
  const goPrev = () => { if (activeIdx > 0) setActiveId(students[activeIdx - 1].id); };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 h-13 flex items-center px-4 md:px-6 gap-3 shadow-sm flex-shrink-0 sticky top-0 z-10" style={{ height: 52 }}>
        <button onClick={() => setSidebarOpen(true)} className="flex lg:hidden w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0 text-sm">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors font-medium flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span className="hidden sm:inline">Exams</span>
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-gray-400 hidden md:inline truncate max-w-[100px]">{EXAM_META.className}</span>
          <span className="text-gray-200 hidden md:inline">/</span>
          <span className="font-semibold text-gray-800 truncate">Grading — {EXAM_META.title}</span>
          <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 flex-shrink-0">Writing</span>
        </div>
        {/* Prompt toggle */}
        <button
          onClick={() => setPromptOpen(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex-shrink-0
            ${promptOpen ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Đề bài
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-500 hidden sm:inline">{EXAM_META.createdBy}</span>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">TL</div>
        </div>
      </header>

      {/* Prompt drawer */}
      {promptOpen && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-4 md:px-8 py-3">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide mb-1">Đề bài · {EXAM_META.taskRequirement}</p>
            <p className="text-sm text-indigo-900 leading-relaxed">{EXAM_META.prompt}</p>
          </div>
        </div>
      )}

      {/* ── 3-column layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ height: `calc(100vh - 52px${promptOpen ? " - 80px" : ""})` }}>

        {/* Col 1: Student list */}
        <StudentListSidebar
          students={students}
          activeId={activeId}
          sidebarOpen={sidebarOpen}
          onSelect={setActiveId}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Col 2: Essay annotator */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden border-r border-gray-200">
          <EssayAnnotator
            key={activeStudent.id}
            essay={activeStudent.essay}
            studentName={activeStudent.name}
          />
        </main>

        {/* Col 3: Grading panel */}
        <aside className="w-72 xl:w-80 flex-shrink-0 overflow-hidden flex flex-col border-l border-gray-200 shadow-lg hidden md:flex">
          <GradingSidebar
            key={activeStudent.id}
            student={activeStudent}
            studentIndex={activeIdx}
            onSave={(score, feedback, draft) => handleSave(activeStudent.id, score, feedback, draft)}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={activeIdx < students.length - 1}
            hasPrev={activeIdx > 0}
          />
        </aside>
      </div>
    </div>
  );
}