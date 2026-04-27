import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface User {
  name: string;
  role: "Student" | "Teacher";
  class: string;
  status: "Active" | "Restrict" | "Off";
  actions: string[];
}

interface ClassItem {
  name: string;
  teacher: string;
  sessions: string;
  students: number;
}

interface SysConfig {
  setting: string;
  default: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const users: User[] = [
  { name: "Alice Nguyen", role: "Student", class: "10A", status: "Active", actions: ["Edit", "Reset PW"] },
  { name: "Lan Vu", role: "Student", class: "10A", status: "Restrict", actions: ["Edit", "Activate"] },
  { name: "Mr. Tran Long", role: "Teacher", class: "10A, 10B", status: "Active", actions: ["Edit", "Deactivate"] },
  { name: "Minh Dao", role: "Student", class: "10B", status: "Off", actions: ["Reactivate"] },
];

const classes: ClassItem[] = [
  { name: "Class 10A", teacher: "Mr. Tran Long", sessions: "Morning · Evening", students: 34 },
  { name: "Class 10B", teacher: "Ms. Nguyen Thu", sessions: "Morning", students: 32 },
  { name: "Class 11A", teacher: "Mr. Le Van", sessions: "Morning · Evening · Weekend", students: 28 },
];

const sysConfig: SysConfig[] = [
  { setting: "Absence threshold", default: "5 times" },
  { setting: "Restriction duration", default: "10 days" },
  { setting: "Late submission alert", default: "5 times" },
  { setting: "Max file upload size", default: "50 MB" },
  { setting: "Storage quota/student", default: "500 MB" },
];

const adminPermissions = [
  { ok: true, label: "All Teacher actions" },
  { ok: true, label: "User create/delete/reset" },
  { ok: true, label: "Class management" },
  { ok: false, label: "Cannot grade assignments" },
  { ok: false, label: "Cannot take attendance" },
  { ok: false, label: "Cannot approve session transfers" },
];

const navMain = ["Dashboard", "Users", "Classes", "Content"];
const navSystem = ["Configuration", "Moderation", "Feedback review"];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1 min-w-0">
      <span className="text-xs text-gray-400 font-medium tracking-wide">{label}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: "Student" | "Teacher" }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${
        role === "Teacher"
          ? "bg-green-100 text-green-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: "Active" | "Restrict" | "Off" }) {
  const map = {
    Active: "bg-green-100 text-green-700",
    Restrict: "bg-amber-100 text-amber-700",
    Off: "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 z-30
          flex flex-col py-6 px-4 gap-1 shadow-lg
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="mb-6 px-2">
          <div className="text-lg font-bold text-gray-900 leading-none">EduSystem</div>
          <div className="text-xs text-gray-400 mt-0.5">Admin Panel</div>
        </div>

        {/* Main nav */}
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest px-2 mb-1 mt-2">MAIN</p>
        {navMain.map((item) => (
          <button
            key={item}
            onClick={() => { setActiveNav(item); setSidebarOpen(false); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
              activeNav === item
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {activeNav === item && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            )}
            {item}
          </button>
        ))}

        {/* System nav */}
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest px-2 mb-1 mt-4">SYSTEM</p>
        {navSystem.map((item) => (
          <button
            key={item}
            onClick={() => { setActiveNav(item); setSidebarOpen(false); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
              activeNav === item
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Topbar ── */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold select-none">
              SA
            </div>
            <span className="hidden sm:inline text-sm text-gray-600">Super Admin</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">Admin</span>
          </div>
        </header>

        {/* ── Page body ── */}
        <main className="flex-1 p-4 sm:p-6 space-y-5 overflow-auto">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total students" value={248} color="text-blue-600" />
            <StatCard label="Total teachers" value={18} color="text-green-600" />
            <StatCard label="Active classes" value={12} color="text-gray-800" />
            <StatCard label="Restricted / Off" value={7} color="text-red-500" />
          </div>

          {/* ── Middle row ── */}
          <div className="flex flex-col xl:flex-row gap-5">

            {/* ── User management ── */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="font-semibold text-gray-800 text-sm">User management</h2>
                <button className="text-xs text-blue-600 hover:underline font-medium">+ Create user</button>
              </div>

              {/* Actions + Search */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  + Teacher account
                </button>
                <button className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  + Student account
                </button>
                <div className="flex-1 min-w-[160px]">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              {/* Table — desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold tracking-wide border-b border-gray-100">
                      <th className="text-left py-2 pr-4">NAME</th>
                      <th className="text-left py-2 pr-4">ROLE</th>
                      <th className="text-left py-2 pr-4">CLASS</th>
                      <th className="text-left py-2 pr-4">STATUS</th>
                      <th className="text-left py-2">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 pr-4 font-medium text-gray-700">{u.name}</td>
                        <td className="py-2.5 pr-4"><RoleBadge role={u.role} /></td>
                        <td className="py-2.5 pr-4 text-gray-500">{u.class}</td>
                        <td className="py-2.5 pr-4"><StatusBadge status={u.status} /></td>
                        <td className="py-2.5">
                          <div className="flex gap-2">
                            {u.actions.map((a) => (
                              <button key={a} className="text-blue-600 hover:underline font-medium">{a}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile */}
              <div className="sm:hidden space-y-3">
                {filteredUsers.map((u) => (
                  <div key={u.name} className="border border-gray-100 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <RoleBadge role={u.role} />
                      <span>· Class {u.class}</span>
                    </div>
                    <div className="flex gap-3">
                      {u.actions.map((a) => (
                        <button key={a} className="text-xs text-blue-600 font-semibold hover:underline">{a}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── System configuration ── */}
            <div className="xl:w-80 bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
              <h2 className="font-semibold text-gray-800 text-sm">System configuration</h2>

              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-[10px] font-semibold text-gray-400 tracking-widest mb-2">
                  <span>SETTING</span>
                  <span>DEFAULT</span>
                  <span></span>
                </div>
                {sysConfig.map((c) => (
                  <div key={c.setting} className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{c.setting}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{c.default}</span>
                    <button className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">Admin permissions note</h3>
                <ul className="space-y-1">
                  {adminPermissions.map((p) => (
                    <li key={p.label} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={p.ok ? "text-green-500" : "text-red-400"}>
                        {p.ok ? "✓" : "✕"}
                      </span>
                      {p.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Class management ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">Class management</h2>
              <button className="text-xs text-blue-600 hover:underline font-medium">+ New class</button>
            </div>

            {/* Table — sm+ */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 font-semibold tracking-wide border-b border-gray-100">
                    <th className="text-left py-2 pr-4">CLASS</th>
                    <th className="text-left py-2 pr-4">HOMEROOM TEACHER</th>
                    <th className="text-left py-2 pr-4">SESSIONS</th>
                    <th className="text-left py-2 pr-4">STUDENTS</th>
                    <th className="text-left py-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-gray-700">{c.name}</td>
                      <td className="py-2.5 pr-4 text-gray-500">{c.teacher}</td>
                      <td className="py-2.5 pr-4 text-gray-500">{c.sessions}</td>
                      <td className="py-2.5 pr-4 text-gray-700 font-semibold">{c.students}</td>
                      <td className="py-2.5">
                        <div className="flex gap-2">
                          {["Edit", "Assign teacher", "Delete"].map((a) => (
                            <button
                              key={a}
                              className={`font-medium hover:underline ${a === "Delete" ? "text-red-500" : "text-blue-600"}`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards — mobile */}
            <div className="sm:hidden space-y-3">
              {classes.map((c) => (
                <div key={c.name} className="border border-gray-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                    <span className="text-xs font-bold text-gray-700">{c.students} students</span>
                  </div>
                  <p className="text-xs text-gray-500">👤 {c.teacher}</p>
                  <p className="text-xs text-gray-500">🕐 {c.sessions}</p>
                  <div className="flex gap-3 pt-1">
                    {["Edit", "Assign teacher", "Delete"].map((a) => (
                      <button
                        key={a}
                        className={`text-xs font-semibold hover:underline ${a === "Delete" ? "text-red-500" : "text-blue-600"}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}