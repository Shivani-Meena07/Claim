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
  {
    id: 1,
    title: 'Your period is predicted in 2 days',
    time: '1h ago',
    tone: 'bloom',
  },
  {
    id: 2,
    title: 'Dr. Anjali Rao confirmed your booking',
    time: '3h ago',
    tone: 'sprout',
  },
  {
    id: 3,
    title: 'New reply on your community post',
    time: 'Yesterday',
    tone: 'dusk',
  },
]

type User = {
  name?: string
  email?: string
}

export default function AppShell() {
  const [dark, setDark] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user')

      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem('user')

        setUser(
          savedUser ? JSON.parse(savedUser) : null
        )
      } catch {
        setUser(null)
      }
    }

    window.addEventListener(
      'storage',
      handleStorageChange
    )

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      )
    }
  }, [])

  const userName = user?.name?.trim() || 'User'

  const userInitial =
    userName.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-sidebar text-sidebar-foreground flex-col border-r border-border">
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            <SidebarContent
              onNavigate={() =>
                setMobileNavOpen(false)
              }
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted focus-ring"
            onClick={() =>
              setMobileNavOpen(true)
            }
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block font-display text-lg">
            Good morning, {userName}
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button
              className="p-2 rounded-lg hover:bg-muted focus-ring"
              onClick={() =>
                setDark((d) => !d)
              }
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-lg hover:bg-muted focus-ring relative"
                onClick={() =>
                  setNotifOpen((o) => !o)
                }
                aria-label="Notifications"
              >
                <Bell size={18} />

                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-bloom" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-2xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 text-sm font-medium">
                    Notifications
                  </div>

                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer"
                    >
                      <span
                        className="mt-1 h-2 w-2 rounded-full shrink-0"
                        style={{
                          background: `var(--${n.tone})`,
                        }}
                      />

                      <div>
                        <p className="text-sm">
                          {n.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <Link
              to="/app/settings"
              className="h-9 w-9 rounded-full bg-bloom-soft text-bloom flex items-center justify-center font-medium focus-ring"
              title={userName}
            >
              {userInitial}
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

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
        <Link
          to="/app"
          className="font-display text-2xl font-semibold"
          onClick={onNavigate}
        >
          Claim
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

      {/* Sign out */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full focus-ring"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  )
}