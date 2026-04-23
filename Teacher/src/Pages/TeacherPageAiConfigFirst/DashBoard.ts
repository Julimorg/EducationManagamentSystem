import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: JSX.Element };
type Status = "Pending" | "Submitted" | "Late" | "Graded" | "Never submitted";
type AttStatus = "Present" | "Late" | "Absent" | "Excused";
type SysStatus = "Active" | "Restrict";

interface Submission {
  student: string;
  session: string;
  submittedAt: string;
  status: Status;
  action: string;
}

interface AttendanceRow {
  student: string;
  today: AttStatus;
  totalAbsences: string;
  sysStatus: SysStatus;
  sysDetail?: string;
}

interface TransferRequest {
  initials: string;
  name: string;
  from: string;
  to: string;
  reason: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: "warning" | "info" | "success";
}

interface ClassInfo {
  id: string;
  name: string;
  sessions: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLASSES: ClassInfo[] = [
  { id: "10A", name: "Class 10A", sessions: ["Morning", "Evening"] },
  { id: "11B", name: "Class 11B", sessions: ["Morning"] },
  { id: "12C", name: "Class 12C", sessions: ["Evening"] },
];

type ClassStatus = "Active" | "Inactive" | "Archived";

interface ClassCard {
  id: string;
  name: string;
  subject: string;
  students: number;
  sessions: string[];
  createdAt: string;
  status: ClassStatus;
  colorKey: string;
}

const ALL_CLASSES: ClassCard[] = [
  { id: "1", name: "Class 10A", subject: "Biology", students: 34, sessions: ["Morning", "Evening"], createdAt: "Jan 5, 2025", status: "Active", colorKey: "green" },
  { id: "2", name: "Class 11B", subject: "Mathematics", students: 28, sessions: ["Morning"], createdAt: "Jan 6, 2025", status: "Active", colorKey: "blue" },
  { id: "3", name: "Class 12C", subject: "History", students: 22, sessions: ["Evening"], createdAt: "Jan 7, 2025", status: "Active", colorKey: "amber" },
  { id: "4", name: "Class 10B", subject: "English", students: 30, sessions: ["Morning"], createdAt: "Feb 1, 2025", status: "Inactive", colorKey: "purple" },
  { id: "5", name: "Class 11A", subject: "Physics", students: 25, sessions: ["Evening"], createdAt: "Feb 3, 2025", status: "Active", colorKey: "coral" },
  { id: "6", name: "Class 9D", subject: "Chemistry", students: 32, sessions: ["Morning", "Evening"], createdAt: "Mar 10, 2025", status: "Archived", colorKey: "gray" },
  { id: "7", name: "Class 12A", subject: "Literature", students: 27, sessions: ["Morning"], createdAt: "Mar 12, 2025", status: "Active", colorKey: "pink" },
  { id: "8", name: "Class 10C", subject: "Geography", students: 29, sessions: ["Evening"], createdAt: "Apr 1, 2025", status: "Inactive", colorKey: "teal" },
  { id: "9", name: "Class 11C", subject: "Civics", students: 24, sessions: ["Morning"], createdAt: "Apr 5, 2025", status: "Active", colorKey: "blue" },
  { id: "10", name: "Class 9A", subject: "Math", students: 31, sessions: ["Morning", "Evening"], createdAt: "Apr 10, 2025", status: "Archived", colorKey: "gray" },
  { id: "11", name: "Class 12B", subject: "Biology", students: 26, sessions: ["Evening"], createdAt: "Apr 14, 2025", status: "Active", colorKey: "green" },
  { id: "12", name: "Class 9C", subject: "English", students: 33, sessions: ["Morning"], createdAt: "Apr 18, 2025", status: "Inactive", colorKey: "amber" },
];


const SUBMISSIONS: Submission[] = [
  { student: "Alice Nguyen", session: "Morning", submittedAt: "—", status: "Pending", action: "Send reminder" },
  { student: "Bob Tran", session: "Morning", submittedAt: "Apr 16, 14:32", status: "Submitted", action: "Grade" },
  { student: "Carol Le", session: "Evening", submittedAt: "Apr 18, 02:10", status: "Late", action: "Grade" },
  { student: "David Pham", session: "Morning", submittedAt: "Apr 15, 10:00", status: "Graded", action: "Re-grade" },
  { student: "Minh Dao", session: "Morning", submittedAt: "—", status: "Never submitted", action: "Alert!" },
];

const ATTENDANCE: AttendanceRow[] = [
  { student: "Alice Nguyen", today: "Present", totalAbsences: "1 / 5", sysStatus: "Active" },
  { student: "Bob Tran", today: "Late", totalAbsences: "2 / 5", sysStatus: "Active" },
  { student: "Carol Le", today: "Absent", totalAbsences: "4 / 5", sysStatus: "Active" },
  { student: "Lan Vu", today: "Excused", totalAbsences: "5 / 5", sysStatus: "Restrict", sysDetail: "8d left" },
];

const TRANSFER_REQUESTS: TransferRequest[] = [
  { initials: "AN", name: "Alice Nguyen", from: "Morning", to: "Evening", reason: "Work conflict" },
  { initials: "DH", name: "Duc Hoang", from: "Evening", to: "Morning", reason: "Transport issue" },
];

const NOTIFICATIONS: Notification[] = [
  { id: 1, message: "Bob Tran has 5+ late submissions. Consider changing student status.", time: "Just now", read: false, type: "warning" },
  { id: 2, message: "Lan Vu absent 5 times → Status auto-changed to Restrict (10 days).", time: "5m ago", read: false, type: "info" },
  { id: 3, message: "Carol Le submitted Essay on Photosynthesis late.", time: "2h ago", read: true, type: "info" },
  { id: 4, message: "Midterm Math exam scheduled for Apr 25.", time: "1d ago", read: true, type: "success" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  x: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alertTriangle: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusColors: Record<Status, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
  Late: "bg-red-100 text-red-700",
  Graded: "bg-green-100 text-green-700",
  "Never submitted": "bg-gray-100 text-gray-500",
};

const attColors: Record<AttStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-700",
  Excused: "bg-blue-100 text-blue-700",
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-1 shadow-sm">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-semibold ${accent ?? "text-gray-800"}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ title, action, actionLabel }: { title: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">{title}</h2>
      {action && (
        <button onClick={action} className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Icon.dashboard },
  { id: "notifications", label: "Notifications", icon: Icon.bell },
  { id: "profile", label: "Profile", icon: Icon.user },
  { id: "materials", label: "Materials", icon: Icon.book },
  { id: "class", label: "Class", icon: Icon.users },
];

function Sidebar({
  open,
  activeNav,
  setActiveNav,
  onClose,
  unreadCount,
}: {
  open: boolean;
  activeNav: string;
  setActiveNav: (id: string) => void;
  onClose: () => void;
  unreadCount: number;
}) {
  return (
    <>
      {/* Mobile overlay — chỉ hiện khi sidebar mở trên mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel:
          - Mobile/tablet: fixed, slide in/out theo `open`
          - Desktop (lg+): luôn hiện, relative, không cần toggle */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col bg-white border-r border-gray-100
          w-64 transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0 shadow-xl" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:shadow-none lg:h-auto lg:min-h-screen
        `}
      >
        {/* Logo + close (mobile) */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 min-h-[64px]">
          <div>
            <p className="font-bold text-indigo-600 text-base leading-tight">EduSystem</p>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Teacher Portal</p>
          </div>
          {/* Close button chỉ hiện trên mobile */}
          <button
            onClick={onClose}
            className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {Icon.x}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); onClose(); }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative w-full text-left
                  ${isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
            TL
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-700 truncate">Mr. Tran Long</p>
            <p className="text-xs text-gray-400">Teacher</p>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Main Dashboard Content ───────────────────────────────────────────────────

function DashboardContent() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedSession, setSelectedSession] = useState("Morning");

  const currentClass = CLASSES.find((c) => c.id === selectedClass)!;
  const totalStudents = 34 + (selectedClass === "11B" ? 28 : selectedClass === "12C" ? 22 : 0);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Students" value={84} accent="text-indigo-600" />
        <StatCard label="Pending Submissions" value={18} accent="text-amber-500" />
        <StatCard label="Late Submissions" value={4} accent="text-red-500" />
        <StatCard label="Upcoming Exams" value={2} accent="text-gray-700" />
      </div>

      {/* Two-column main area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: Submission + Attendance */}
        <div className="xl:col-span-2 space-y-6">

          {/* Class + Session selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => { setSelectedClass(e.target.value); setSelectedSession(CLASSES.find(c => c.id === e.target.value)!.sessions[0]); }}
                className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Session</label>
              <div className="flex gap-1">
                {currentClass.sessions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSession(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      selectedSession === s
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Monitor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <SectionHeader
                title={`Submission Monitor — Essay on Photosynthesis · ${currentClass.name} · ${selectedSession}`}
                actionLabel="View all assignments"
                action={() => {}}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Student</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5 hidden sm:table-cell">Session</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5 hidden md:table-cell">Submitted at</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Status</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SUBMISSIONS.map((row) => (
                    <tr key={row.student} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700">{row.student}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{row.session}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{row.submittedAt}</td>
                      <td className="px-4 py-3">
                        <Badge label={row.status} className={statusColors[row.status]} />
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                          {row.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <SectionHeader
                title={`Attendance — ${currentClass.name} · Today`}
              />
              <button className="text-xs text-indigo-500 hover:text-indigo-700 mb-3 transition-colors">+ Take attendance</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Student</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">Today</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5 hidden sm:table-cell">Total absences</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">System status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ATTENDANCE.map((row) => (
                    <tr key={row.student} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700">{row.student}</td>
                      <td className="px-4 py-3">
                        <Badge label={row.today} className={attColors[row.today]} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{row.totalAbsences}</td>
                      <td className="px-4 py-3">
                        {row.sysStatus === "Restrict" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Restrict {row.sysDetail && <span className="text-red-400">({row.sysDetail})</span>}
                          </span>
                        ) : (
                          <Badge label="Active" className="bg-green-100 text-green-700" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Transfer Requests + Notifications */}
        <div className="space-y-5">

          {/* Session Transfer Requests */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Session Transfer Requests</h2>
              <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                {TRANSFER_REQUESTS.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {TRANSFER_REQUESTS.map((req) => (
                <div key={req.name} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                    {req.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{req.name}</p>
                    <p className="text-xs text-gray-400">{req.from} → {req.to}</p>
                    <p className="text-xs text-gray-400 italic">"{req.reason}"</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium">
                      Approve
                    </button>
                    <button className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Notifications</h2>
              <button className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">Mark all read</button>
            </div>
            <div className="space-y-2">
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${
                    n.read ? "opacity-60" : "bg-indigo-50/50"
                  }`}
                >
                  <span className={`mt-0.5 flex-shrink-0 ${
                    n.type === "warning" ? "text-amber-500" : n.type === "success" ? "text-green-500" : "text-blue-500"
                  }`}>
                    {n.type === "warning" ? Icon.alertTriangle : Icon.check}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ─── Class Page ───────────────────────────────────────────────────────────────

const CLASS_STATUSES: ClassStatus[] = ["Active", "Inactive", "Archived"];
const PAGE_SIZE = 6;

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  green:  { bg: "bg-emerald-50",  text: "text-emerald-600",  border: "border-emerald-100" },
  blue:   { bg: "bg-blue-50",     text: "text-blue-600",     border: "border-blue-100" },
  amber:  { bg: "bg-amber-50",    text: "text-amber-600",    border: "border-amber-100" },
  purple: { bg: "bg-violet-50",   text: "text-violet-600",   border: "border-violet-100" },
  coral:  { bg: "bg-orange-50",   text: "text-orange-500",   border: "border-orange-100" },
  gray:   { bg: "bg-gray-100",    text: "text-gray-500",     border: "border-gray-200" },
  pink:   { bg: "bg-pink-50",     text: "text-pink-500",     border: "border-pink-100" },
  teal:   { bg: "bg-teal-50",     text: "text-teal-600",     border: "border-teal-100" },
};

const statusStyle: Record<ClassStatus, string> = {
  Active:   "bg-emerald-100 text-emerald-700",
  Inactive: "bg-amber-100 text-amber-700",
  Archived: "bg-gray-100 text-gray-500",
};

function ClassCardItem({ cls, onSelect }: { cls: ClassCard; onSelect: () => void }) {
  const color = colorMap[cls.colorKey] ?? colorMap.gray;
  const initials = cls.name.replace("Class ", "").slice(0, 3);
  return (
    <div onClick={onSelect} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold border ${color.bg} ${color.text} ${color.border}`}>
          {initials}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[cls.status]}`}>
          {cls.status}
        </span>
      </div>

      {/* Class name + subject */}
      <div>
        <p className="font-semibold text-gray-800 text-base leading-tight">{cls.name}</p>
        <p className="text-sm text-gray-400 mt-0.5">{cls.subject}</p>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-3">
        {/* Students */}
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>{cls.students} students</span>
        </div>
        {/* Sessions */}
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{cls.sessions.join(" · ")}</span>
        </div>
        {/* Created */}
        <div className="flex items-center gap-1.5 ml-auto">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{cls.createdAt}</span>
        </div>
      </div>
    </div>
  );
}

function ClassPage({ onSelectClass }: { onSelectClass: (cls: ClassCard) => void }) {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<ClassStatus | "All">("All");
  const [page, setPage] = useState(1);

  const filtered = ALL_CLASSES.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "All" || c.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatus = (s: ClassStatus | "All") => { setActiveStatus(s); setPage(1); };

  return (
    <div className="space-y-5">
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search class by name or subject..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          {search && (
            <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", ...CLASS_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                activeStatus === s
                  ? s === "All"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : s === "Active"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : s === "Inactive"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-gray-500 text-white border-gray-500 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-500"
              }`}
            >
              {s}
              <span className={`ml-1.5 text-xs ${activeStatus === s ? "opacity-70" : "text-gray-400"}`}>
                {s === "All"
                  ? ALL_CLASSES.length
                  : ALL_CLASSES.filter((c) => c.status === s).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        {filtered.length === 0
          ? "No classes found"
          : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} classes`}
      </p>

      {/* Grid */}
      {paged.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paged.map((cls) => (
            <ClassCardItem key={cls.id} cls={cls} onSelect={() => onSelectClass(cls)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p className="text-sm text-gray-400">No classes match your search</p>
          <button onClick={() => { handleSearch(""); handleStatus("All"); }} className="text-xs text-indigo-500 hover:text-indigo-700">Clear filters</button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            const showPage = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
            const showDot = !showPage && (p === currentPage - 2 || p === currentPage + 2);
            if (showDot) return <span key={p} className="w-9 h-9 flex items-center justify-center text-gray-300 text-sm">…</span>;
            if (!showPage) return null;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}


// ─── Class Detail — Types & Data ─────────────────────────────────────────────

type StudentStatus = "Active" | "Restrict" | "Inactive" | "Archived";
type AssignmentStatus = "Pending" | "Submitted" | "Graded" | "Late" | "Archived";
type AttendanceStatus = "Scheduled" | "Completed" | "Archived";
type MaterialType = "PDF" | "PPTX" | "DOC" | "MP3" | "XLS";

interface Student {
  id: string;
  name: string;
  dob: string;
  idDoc?: string;
  targetBand: number;
  status: StudentStatus;
  ieltDate?: string;
  school?: string;
  prevScore?: number;
  attendance: number;
  assignments: number;
  exams: number;
}

interface ClassAssignment {
  id: string;
  title: string;
  subject: string;
  postedBy: string;
  postedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  submitted: number;
  total: number;
  tags: string[];
  description: string;
}

interface AttendanceSession {
  id: string;
  lessonName: string;
  date: string;
  session: string;
  attended: number;
  total: number;
  status: AttendanceStatus;
}

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  subject: string;
  unit: string;
  size: string;
  colorKey: string;
}

const DETAIL_STUDENTS: Student[] = [
  { id: "S001", name: "Alice Nguyen", dob: "2005-03-12", idDoc: "079305012345", targetBand: 7.0, status: "Active", ieltDate: "May 10, 2025", school: "THPT Lê Quý Đôn", prevScore: 6.5, attendance: 18, assignments: 12, exams: 4 },
  { id: "S002", name: "Bob Tran", dob: "2004-11-08", targetBand: 6.5, status: "Restrict", ieltDate: "Jun 5, 2025", prevScore: 5.5, attendance: 10, assignments: 8, exams: 3 },
  { id: "S003", name: "Carol Le", dob: "2005-07-22", idDoc: "079305054321", targetBand: 7.5, status: "Active", school: "THPT Nguyễn Thị Minh Khai", attendance: 20, assignments: 14, exams: 4 },
  { id: "S004", name: "David Pham", dob: "2004-01-30", targetBand: 6.0, status: "Active", ieltDate: "Apr 26, 2025", prevScore: 5.0, attendance: 17, assignments: 11, exams: 4 },
  { id: "S005", name: "Lan Vu", dob: "2005-09-14", idDoc: "079305078900", targetBand: 7.0, status: "Restrict", ieltDate: "May 20, 2025", school: "THPT Trần Phú", prevScore: 6.0, attendance: 5, assignments: 6, exams: 2 },
  { id: "S006", name: "Minh Dao", dob: "2004-05-03", targetBand: 5.5, status: "Active", attendance: 19, assignments: 10, exams: 3 },
  { id: "S007", name: "Hoa Bui", dob: "2005-12-19", idDoc: "079305098765", targetBand: 8.0, status: "Active", ieltDate: "Jun 14, 2025", school: "THPT Gia Định", prevScore: 7.0, attendance: 21, assignments: 15, exams: 5 },
  { id: "S008", name: "Nam Nguyen", dob: "2004-08-27", targetBand: 6.5, status: "Inactive", attendance: 3, assignments: 2, exams: 1 },
];

const DETAIL_ASSIGNMENTS: ClassAssignment[] = [
  { id: "A001", title: "Essay on Photosynthesis", subject: "Biology", postedBy: "Mr. Tran Long", postedDate: "Apr 15", dueDate: "Apr 19, 23:59", status: "Pending", submitted: 5, total: 8, tags: ["essay", "biology"], description: "Write a 500-word essay explaining the process of photosynthesis." },
  { id: "A002", title: "Math Problem Set 3", subject: "Math", postedBy: "Mr. Tran Long", postedDate: "Apr 12", dueDate: "Apr 20, 23:59", status: "Pending", submitted: 3, total: 8, tags: ["problem-set", "algebra"], description: "Complete exercises 1–20 from chapter 3 of the textbook." },
  { id: "A003", title: "Literature Review — Ch 2", subject: "Literature", postedBy: "Mr. Tran Long", postedDate: "Apr 8", dueDate: "Apr 15, 23:59", status: "Graded", submitted: 8, total: 8, tags: ["review", "reading"], description: "Summarize key themes from chapter 2 of the assigned novel." },
  { id: "A004", title: "Grammar Exercise Set", subject: "English", postedBy: "Mr. Tran Long", postedDate: "Apr 5", dueDate: "Apr 10, 23:59", status: "Graded", submitted: 7, total: 8, tags: ["grammar", "exercise"], description: "Complete all grammar exercises in Unit 4 workbook." },
  { id: "A005", title: "History Timeline Project", subject: "History", postedBy: "Mr. Tran Long", postedDate: "Mar 28", dueDate: "Apr 4, 23:59", status: "Archived", submitted: 8, total: 8, tags: ["project", "history"], description: "Create a timeline of key events from 1900–1950." },
];

const DETAIL_ATTENDANCE: AttendanceSession[] = [
  { id: "AT001", lessonName: "Photosynthesis — Intro", date: "Apr 23, 2025", session: "Morning", attended: 7, total: 8, status: "Completed" },
  { id: "AT002", lessonName: "Cell Division Basics", date: "Apr 21, 2025", session: "Evening", attended: 6, total: 8, status: "Completed" },
  { id: "AT003", lessonName: "Math — Linear Equations", date: "Apr 18, 2025", session: "Morning", attended: 8, total: 8, status: "Completed" },
  { id: "AT004", lessonName: "English Reading Practice", date: "Apr 16, 2025", session: "Morning", attended: 5, total: 8, status: "Completed" },
  { id: "AT005", lessonName: "History — WW2 Overview", date: "Apr 25, 2025", session: "Morning", attended: 0, total: 8, status: "Scheduled" },
  { id: "AT006", lessonName: "Literature Discussion", date: "Apr 14, 2025", session: "Evening", attended: 7, total: 8, status: "Archived" },
];

const DETAIL_MATERIALS: Material[] = [
  { id: "M001", title: "Ch3 — Photosynthesis", type: "PDF", subject: "Biology · Lecture", unit: "Unit 3", size: "2.4 MB", colorKey: "green" },
  { id: "M002", title: "Algebra Fundamentals", type: "PPTX", subject: "Math · Lecture", unit: "Unit 1", size: "5.1 MB", colorKey: "blue" },
  { id: "M003", title: "WW2 Reference Pack", type: "DOC", subject: "History · Reference", unit: "Unit 5", size: "1.8 MB", colorKey: "amber" },
  { id: "M004", title: "English Phonetics Audio", type: "MP3", subject: "English · Reference", unit: "Unit 2", size: "8.2 MB", colorKey: "purple" },
  { id: "M005", title: "Calculus Exercise Set", type: "PDF", subject: "Math · Exercise", unit: "Unit 4", size: "0.9 MB", colorKey: "coral" },
  { id: "M006", title: "Grammar Guide", type: "DOC", subject: "English · Lecture", unit: "Unit 1", size: "1.2 MB", colorKey: "teal" },
  { id: "M007", title: "Cell Biology Slides", type: "PPTX", subject: "Biology · Lecture", unit: "Unit 2", size: "3.7 MB", colorKey: "pink" },
];

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const DET_PAGE_SIZE = 5;

function Pagination({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 pt-3">
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
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium border transition-all ${p === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"}`}>
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

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
}

function FilterPills<T extends string>({ options, active, onChange, colorFn }: { options: T[]; active: T; onChange: (v: T) => void; colorFn?: (v: T) => string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${active === opt ? (colorFn ? colorFn(opt) : "bg-indigo-600 text-white border-indigo-600 shadow-sm") : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-500"}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function ActionBtn({ label, variant, onClick }: { label: string; variant: "edit" | "archive" | "create"; onClick?: () => void }) {
  const styles = {
    edit: "border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600",
    archive: "border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300",
    create: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
  };
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${styles[variant]}`}>{label}</button>
  );
}

// ─── Student Table ─────────────────────────────────────────────────────────────

const STUDENT_STATUSES: StudentStatus[] = ["Active", "Restrict", "Inactive", "Archived"];
const studentStatusStyle: Record<StudentStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Restrict: "bg-red-100 text-red-600",
  Inactive: "bg-amber-100 text-amber-700",
  Archived: "bg-gray-100 text-gray-500",
};

function StudentTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "All">("All");
  const [page, setPage] = useState(1);

  const filtered = DETAIL_STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    return (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
      (statusFilter === "All" || s.status === statusFilter);
  });
  const paged = filtered.slice((page - 1) * DET_PAGE_SIZE, page * DET_PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Students</h3>
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length} of {DETAIL_STUDENTS.length} students</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or ID..." />
          <FilterPills
            options={["All", ...STUDENT_STATUSES] as (StudentStatus | "All")[]}
            active={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["ID", "Student", "DOB", "ID Doc", "Target", "Status", "IELTS Date", "School", "Prev Score", "Attend.", "Assign.", "Exams", "Actions"].map((h) => (
                <th key={h} className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.length === 0 ? (
              <tr><td colSpan={13} className="text-center py-10 text-sm text-gray-400">No students found</td></tr>
            ) : paged.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">
                      {s.name.split(" ").map(w => w[0]).slice(-2).join("")}
                    </div>
                    <span className="font-medium text-gray-700 whitespace-nowrap">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.dob}</td>
                <td className="px-4 py-3 text-gray-400 text-xs font-mono">{s.idDoc ?? <span className="text-gray-200">—</span>}</td>
                <td className="px-4 py-3"><span className="font-semibold text-indigo-600">{s.targetBand}</span></td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${studentStatusStyle[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.ieltDate ?? <span className="text-gray-200">—</span>}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-[120px] truncate" title={s.school}>{s.school ?? <span className="text-gray-200">—</span>}</td>
                <td className="px-4 py-3 text-center">
                  {s.prevScore != null ? <span className="text-xs font-semibold text-emerald-600">{s.prevScore}</span> : <span className="text-gray-200 text-xs">—</span>}
                </td>
                <td className="px-4 py-3 text-center text-xs font-medium text-gray-600">{s.attendance}</td>
                <td className="px-4 py-3 text-center text-xs font-medium text-gray-600">{s.assignments}</td>
                <td className="px-4 py-3 text-center text-xs font-medium text-gray-600">{s.exams}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <ActionBtn label="Edit" variant="edit" />
                    <ActionBtn label="Archive" variant="archive" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-gray-50">
        <Pagination page={page} total={filtered.length} pageSize={DET_PAGE_SIZE} onChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}

// ─── Assignment Section ───────────────────────────────────────────────────────

const ASSIGN_STATUSES: AssignmentStatus[] = ["Pending", "Submitted", "Graded", "Late", "Archived"];
const assignStatusStyle: Record<AssignmentStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
  Graded: "bg-emerald-100 text-emerald-700",
  Late: "bg-red-100 text-red-600",
  Archived: "bg-gray-100 text-gray-500",
};

function AssignmentSection({ totalStudents }: { totalStudents: number }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "All">("All");
  const [page, setPage] = useState(1);

  const filtered = DETAIL_ASSIGNMENTS.filter((a) => {
    return a.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || a.status === statusFilter);
  });
  const paged = filtered.slice((page - 1) * DET_PAGE_SIZE, page * DET_PAGE_SIZE);

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search assignments..." />
          <FilterPills
            options={["All", ...ASSIGN_STATUSES] as (AssignmentStatus | "All")[]}
            active={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
          />
        </div>
        <ActionBtn label="+ New Assignment" variant="create" />
      </div>

      <p className="text-xs text-gray-400">{filtered.length} assignments</p>

      {/* Cards */}
      {paged.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-12 flex flex-col items-center gap-2 text-gray-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p className="text-sm text-gray-400">No assignments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((a) => {
            const pct = Math.round((a.submitted / totalStudents) * 100);
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-gray-800 text-base">{a.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${assignStatusStyle[a.status]}`}>{a.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{a.subject} · Posted by {a.postedBy} · {a.postedDate}</p>
                    <p className="text-sm text-gray-600 mb-3">{a.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {a.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{t}</span>
                      ))}
                    </div>
                    {/* Submission progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[180px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-gray-400">Submitted</span>
                          <span className="text-[11px] font-medium text-gray-600">{a.submitted} / {totalStudents}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Due {a.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <ActionBtn label="Edit" variant="edit" />
                    <ActionBtn label="Archive" variant="archive" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Pagination page={page} total={filtered.length} pageSize={DET_PAGE_SIZE} onChange={(p) => setPage(p)} />
    </div>
  );
}

// ─── Attendance Section ───────────────────────────────────────────────────────

const ATT_STATUSES: AttendanceStatus[] = ["Scheduled", "Completed", "Archived"];
const attSessStyle: Record<AttendanceStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-600",
  Completed: "bg-emerald-100 text-emerald-700",
  Archived: "bg-gray-100 text-gray-500",
};

function AttendanceSection({ totalStudents }: { totalStudents: number }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "All">("All");
  const [page, setPage] = useState(1);

  const filtered = DETAIL_ATTENDANCE.filter((a) => {
    return (a.lessonName.toLowerCase().includes(search.toLowerCase()) || a.date.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || a.status === statusFilter);
  });
  const paged = filtered.slice((page - 1) * DET_PAGE_SIZE, page * DET_PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by lesson or date..." />
          <FilterPills
            options={["All", ...ATT_STATUSES] as (AttendanceStatus | "All")[]}
            active={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
          />
        </div>
        <ActionBtn label="+ New Session" variant="create" />
      </div>

      <p className="text-xs text-gray-400">{filtered.length} sessions</p>

      {paged.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-12 flex flex-col items-center gap-2 text-gray-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p className="text-sm text-gray-400">No sessions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((a) => {
            const pct = Math.round((a.attended / totalStudents) * 100);
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-gray-800">{a.lessonName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${attSessStyle[a.status]}`}>{a.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{a.date} · {a.session} session</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[180px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-gray-400">Attended</span>
                          <span className="text-[11px] font-medium text-gray-600">{a.attended} / {totalStudents}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{pct}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <ActionBtn label="Edit" variant="edit" />
                    <ActionBtn label="Archive" variant="archive" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Pagination page={page} total={filtered.length} pageSize={DET_PAGE_SIZE} onChange={(p) => setPage(p)} />
    </div>
  );
}

// ─── Material Section ─────────────────────────────────────────────────────────

const MAT_TYPES: MaterialType[] = ["PDF", "PPTX", "DOC", "MP3", "XLS"];
const matTypeStyle: Record<MaterialType, string> = {
  PDF: "bg-red-100 text-red-600",
  PPTX: "bg-orange-100 text-orange-600",
  DOC: "bg-blue-100 text-blue-600",
  MP3: "bg-purple-100 text-purple-600",
  XLS: "bg-emerald-100 text-emerald-600",
};
const matColorMap: Record<string, { bg: string; text: string }> = {
  green:  { bg: "bg-emerald-50",  text: "text-emerald-600" },
  blue:   { bg: "bg-blue-50",     text: "text-blue-600" },
  amber:  { bg: "bg-amber-50",    text: "text-amber-600" },
  purple: { bg: "bg-violet-50",   text: "text-violet-600" },
  coral:  { bg: "bg-orange-50",   text: "text-orange-500" },
  teal:   { bg: "bg-teal-50",     text: "text-teal-600" },
  pink:   { bg: "bg-pink-50",     text: "text-pink-500" },
  gray:   { bg: "bg-gray-100",    text: "text-gray-500" },
};

function MaterialSection() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MaterialType | "All">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const filtered = DETAIL_MATERIALS.filter((m) => {
    return m.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "All" || m.type === typeFilter);
  });
  const paged = filtered.slice((page - 1) * DET_PAGE_SIZE, page * DET_PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search materials..." />
          <FilterPills
            options={["All", ...MAT_TYPES] as (MaterialType | "All")[]}
            active={typeFilter}
            onChange={(v) => { setTypeFilter(v); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button onClick={() => setViewMode("list")} className={`px-2.5 py-1.5 transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <ActionBtn label="+ Upload Material" variant="create" />
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} materials found</p>

      {/* Grid view */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paged.map((m) => {
            const col = matColorMap[m.colorKey] ?? matColorMap.gray;
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold mb-4 ${col.bg} ${col.text}`}>
                  {m.title[0]}
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1 leading-snug">{m.title}</p>
                <p className="text-xs text-gray-400 mb-4">{m.subject} · {m.unit}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${matTypeStyle[m.type]}`}>{m.type} · {m.size}</span>
                  <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">Download</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {paged.map((m, i) => {
            const col = matColorMap[m.colorKey] ?? matColorMap.gray;
            return (
              <div key={m.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors ${i < paged.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${col.bg} ${col.text}`}>
                  {m.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 text-sm truncate">{m.title}</p>
                  <p className="text-xs text-gray-400">{m.subject} · {m.unit}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${matTypeStyle[m.type]}`}>{m.type} · {m.size}</span>
                <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors flex-shrink-0">Download</button>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} total={filtered.length} pageSize={viewMode === "grid" ? 6 : DET_PAGE_SIZE} onChange={(p) => setPage(p)} />
    </div>
  );
}

// ─── Class Detail Page ────────────────────────────────────────────────────────

type DetailTab = "Students" | "Assignments" | "Attendance" | "Materials";
const DETAIL_TABS: DetailTab[] = ["Students", "Assignments", "Attendance", "Materials"];

function ClassDetailPage({ cls, onBack }: { cls: ClassCard; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("Students");

  const tabIcons: Record<DetailTab, JSX.Element> = {
    Students: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Assignments: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    Attendance: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Materials: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  };

  const color = colorMap[cls.colorKey] ?? colorMap.gray;

  return (
    <div className="space-y-5">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Class
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{cls.name}</span>
      </div>

      {/* Class header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border flex-shrink-0 ${color.bg} ${color.text} ${color.border}`}>
            {cls.name.replace("Class ", "").slice(0, 3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-800">{cls.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[cls.status]}`}>{cls.status}</span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{cls.subject} · {cls.sessions.join(" & ")} session</p>
          </div>
          <div className="flex gap-6 flex-wrap text-center">
            {[
              { label: "Students", value: cls.students },
              { label: "Sessions", value: cls.sessions.length },
              { label: "Created", value: cls.createdAt },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-base font-semibold text-gray-700 mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        {DETAIL_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Students" && <StudentTable />}
      {activeTab === "Assignments" && <AssignmentSection totalStudents={cls.students} />}
      {activeTab === "Attendance" && <AttendanceSection totalStudents={cls.students} />}
      {activeTab === "Materials" && <MaterialSection />}
    </div>
  );
}

// ─── Page Placeholders ────────────────────────────────────────────────────────

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-3">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
        {Icon.book}
      </div>
      <p className="text-sm font-medium text-gray-400">{title} — coming soon</p>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedClass, setSelectedClass] = useState<ClassCard | null>(null);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const pageTitle: Record<string, string> = {
    dashboard: "Dashboard",
    notifications: "Notifications",
    profile: "Profile",
    materials: "Materials",
    class: selectedClass ? selectedClass.name : "Class Management",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        activeNav={activeNav}
        setActiveNav={(id) => { setActiveNav(id); setSelectedClass(null); }}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 h-16 flex items-center px-4 md:px-6 gap-4 shadow-sm">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {Icon.menu}
          </button>

          <h1 className="text-base font-semibold text-gray-800 flex-1">{pageTitle[activeNav]}</h1>

          {/* Header right */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              {Icon.bell}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
              TL
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeNav === "dashboard" && <DashboardContent />}
          {activeNav === "notifications" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg ${n.read ? "" : "bg-indigo-50/50"}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${n.type === "warning" ? "text-amber-500" : n.type === "success" ? "text-green-500" : "text-blue-500"}`}>
                      {n.type === "warning" ? Icon.alertTriangle : Icon.check}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeNav === "class" && !selectedClass && <ClassPage onSelectClass={(cls) => setSelectedClass(cls)} />}
          {activeNav === "class" && selectedClass && <ClassDetailPage cls={selectedClass} onBack={() => setSelectedClass(null)} />}
          {activeNav !== "dashboard" && activeNav !== "notifications" && activeNav !== "class" && (
            <PlaceholderPage title={pageTitle[activeNav]} />
          )}
        </main>
      </div>
    </div>
  );
}