import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    label: 'Landing Page',
    items: [{ to: '/admin', label: 'Page Editor', end: true }],
  },
  {
    label: 'Services & Industries',
    items: [
      { to: '/admin/services', label: 'Services' },
      { to: '/admin/industries', label: 'Industries' },
    ],
  },
  {
    label: 'Portfolio & Cases',
    items: [
      { to: '/admin/portfolio', label: 'Portfolio' },
      { to: '/admin/portfolio-categories', label: 'Portfolio Categories' },
      { to: '/admin/case-studies', label: 'Case Studies' },
      { to: '/admin/case-categories', label: 'Case Categories' },
    ],
  },
  {
    label: 'Team & Why Us',
    items: [
      { to: '/admin/team', label: 'Team' },
      { to: '/admin/why-us', label: 'Why Us' },
    ],
  },
  {
    label: 'Events',
    items: [
      { to: '/admin/events', label: 'Events' },
    ],
  },
]

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded text-sm transition-colors ${
    isActive
      ? 'bg-[#dc1e1e] text-white'
      : 'text-white/60 hover:text-white hover:bg-white/5'
  }`

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <h1 className="font-display text-2xl text-white tracking-wide">
            CRAZY <span className="text-[#dc1e1e]">ADS</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] font-semibold mb-2 px-4">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/50 text-xs mb-2">
            Logged in as <span className="text-white">{admin?.username}</span>
          </p>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-[#111] border-b border-white/10 flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white mr-4"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h2 className="text-white/80 text-sm font-medium">Dashboard</h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
