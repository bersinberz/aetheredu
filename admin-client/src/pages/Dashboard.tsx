import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutAdmin, getStoredUser } from '../services/auth.service'
import '../styles/Dashboard.css'

// ── Static overview data ──
const stats = [
  {
    label: 'Total Students',
    value: '3,842',
    change: '+12%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'blue',
  },
  {
    label: 'Total Faculty',
    value: '248',
    change: '+4%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'violet',
  },
  {
    label: 'Total Classes',
    value: '186',
    change: '+8%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'emerald',
  },
  {
    label: 'Active Courses',
    value: '94',
    change: '-2%',
    up: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'amber',
  },
  {
    label: 'Attendance Rate',
    value: '87.4%',
    change: '+1.2%',
    up: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'cyan',
  },
  {
    label: 'Pending Approvals',
    value: '17',
    change: '-5',
    up: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'rose',
  },
]

const recentActivity = [
  { id: 1, action: 'New student enrolled', name: 'Arjun Mehta', time: '2 min ago', type: 'student' },
  { id: 2, action: 'Faculty profile updated', name: 'Dr. Priya Nair', time: '18 min ago', type: 'faculty' },
  { id: 3, action: 'New class created', name: 'Advanced Mathematics', time: '1 hr ago', type: 'class' },
  { id: 4, action: 'Course material uploaded', name: 'Physics Lab Manual', time: '2 hr ago', type: 'course' },
  { id: 5, action: 'Student fee paid', name: 'Sneha Reddy', time: '3 hr ago', type: 'student' },
  { id: 6, action: 'Timetable updated', name: 'Semester 4 Schedule', time: '5 hr ago', type: 'class' },
]

const topCourses = [
  { name: 'Computer Science', students: 620, capacity: 700, pct: 89 },
  { name: 'Mechanical Eng.', students: 480, capacity: 600, pct: 80 },
  { name: 'Business Admin', students: 390, capacity: 500, pct: 78 },
  { name: 'Data Science', students: 310, capacity: 400, pct: 78 },
  { name: 'Civil Engineering', students: 270, capacity: 400, pct: 68 },
]

const navItems = [
  {
    label: 'Overview',
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: 'Students',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Faculty',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: 'Classes',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Courses',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Reports',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
]

function activityIcon(type: string) {
  const icons: Record<string, string> = {
    student: '🎓',
    faculty: '👨‍🏫',
    class: '🏫',
    course: '📚',
  }
  return icons[type] ?? '📌'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')

  const handleLogout = () => {
    logoutAdmin()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dash-root">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <img
            src="https://res.cloudinary.com/dhkgj2u8s/image/upload/v1774112861/logo_gq8unu.png"
            alt="Logo"
            className="sidebar-logo"
          />
          <span>AetherEdu</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? 'nav-item--active' : ''}`}
              onClick={() => { setActiveNav(item.label); setSidebarOpen(false) }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="dash-main">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="topbar-title">
            <h2>Overview</h2>
            <p>Welcome back, {user?.name ?? 'Admin'}</p>
          </div>

          <div className="topbar-right">
            <button className="topbar-notif" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notif-badge">3</span>
            </button>
            <div className="topbar-avatar">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">
          {/* Stat cards */}
          <section className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className={`stat-card stat-card--${s.color}`}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-body">
                  <p className="stat-label">{s.label}</p>
                  <h3 className="stat-value">{s.value}</h3>
                  <span className={`stat-change ${s.up ? 'up' : 'down'}`}>
                    {s.up ? '▲' : '▼'} {s.change} this month
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Bottom row */}
          <section className="dash-row">
            {/* Recent Activity */}
            <div className="dash-card activity-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <button className="card-link">View all</button>
              </div>
              <ul className="activity-list">
                {recentActivity.map((item) => (
                  <li key={item.id} className="activity-item">
                    <span className="activity-emoji">{activityIcon(item.type)}</span>
                    <div className="activity-info">
                      <p className="activity-action">{item.action}</p>
                      <p className="activity-name">{item.name}</p>
                    </div>
                    <span className="activity-time">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Courses */}
            <div className="dash-card courses-card">
              <div className="card-header">
                <h3>Top Courses by Enrollment</h3>
                <button className="card-link">View all</button>
              </div>
              <ul className="courses-list">
                {topCourses.map((c) => (
                  <li key={c.name} className="course-item">
                    <div className="course-meta">
                      <span className="course-name">{c.name}</span>
                      <span className="course-count">{c.students} / {c.capacity}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="course-pct">{c.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
