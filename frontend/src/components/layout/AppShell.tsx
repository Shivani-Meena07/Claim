import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarHeart,
  Smile,
  Sparkles,
  MessageCircle,
  Users,
  Stethoscope,
  ClipboardList,
  Wind,
  FileBarChart,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/cycle', label: 'Cycle Tracker', icon: CalendarHeart },
  { to: '/app/mood', label: 'Mood Tracker', icon: Smile },
  { to: '/app/coach', label: 'AI Wellness Coach', icon: Sparkles },
  { to: '/app/chat', label: 'AI Chatbot', icon: MessageCircle },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/doctors', label: 'Doctor Connect', icon: Stethoscope },
  { to: '/app/bookings', label: 'My Bookings', icon: ClipboardList },
  { to: '/app/mental-wellness', label: 'Mental Wellness', icon: Wind },
  { to: '/app/report', label: 'Monthly Report', icon: FileBarChart },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

const NOTIFICATIONS = [
  { id: 1, title: 'Your period is predicted in 2 days', time: '1h ago', tone: 'bloom' },
  { id: 2, title: 'Dr. Anjali Rao confirmed your booking', time: '3h ago', tone: 'sprout' },
  { id: 3, title: 'New reply on your community post', time: 'Yesterday', tone: 'dusk' },
]

export default function AppShell() {
  const [dark, setDark] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted focus-ring"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block font-display text-lg">Good evening, Meera</div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-muted focus-ring"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button
                className="p-2 rounded-lg hover:bg-muted focus-ring relative"
                onClick={() => setNotifOpen((o) => !o)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-bloom" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-2xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 text-sm font-medium">Notifications</div>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer">
                      <span
                        className="mt-1 h-2 w-2 rounded-full shrink-0"
                        style={{ background: `var(--${n.tone})` }}
                      />
                      <div>
                        <p className="text-sm">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/app/settings" className="h-9 w-9 rounded-full bg-bloom-soft text-bloom flex items-center justify-center font-medium focus-ring">
              M
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
        <Link to="/" className="font-display text-xl">
          Claim
        </Link>
        <button className="lg:hidden p-1" onClick={onNavigate} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors focus-ring',
                isActive
                  ? 'bg-bloom-soft text-bloom font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent focus-ring"
        >
          <LogOut size={18} />
          Sign out
        </Link>
      </div>
    </>
  )
}
