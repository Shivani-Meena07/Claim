import { useEffect, useState } from 'react'
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  HelpCircle,
} from 'lucide-react'

import { Card, CardContent } from '../components/ui/Card'
import { Input, Label } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import { getCurrentUser } from '../api'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: Lock },
  { key: 'theme', label: 'Theme', icon: Palette },
  { key: 'language', label: 'Language', icon: Globe },
  { key: 'help', label: 'Help', icon: HelpCircle },
]

function Toggle({
  label,
  desc,
  defaultOn = false,
}: {
  label: string
  desc?: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>

        {desc && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {desc}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className={cn(
          'h-6 w-11 rounded-full transition-colors relative shrink-0 focus-ring',
          on ? 'bg-bloom' : 'bg-switch-background'
        )}
        aria-pressed={on}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            on ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

interface UserData {
  id: string
  name: string
  email: string
}

export default function Settings() {
  const [tab, setTab] = useState('profile')

  const [user, setUser] = useState<UserData | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()

        console.log('Current user:', data)

        setUser(data.user)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUser()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">
          Settings
        </h2>

        <p className="text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <nav className="lg:col-span-1 flex lg:flex-col gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm whitespace-nowrap focus-ring',
                tab === t.key
                  ? 'bg-bloom-soft text-bloom font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent>
              {/* PROFILE */}
              {tab === 'profile' && (
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label>Full name</Label>

                    <Input
                      value={
                        loadingUser
                          ? 'Loading...'
                          : user?.name || ''
                      }
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Email</Label>

                    <Input
                      value={
                        loadingUser
                          ? 'Loading...'
                          : user?.email || ''
                      }
                      type="email"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label>Date of birth</Label>

                    <Input
                      type="date"
                      placeholder="Select your date of birth"
                    />
                  </div>

                  <Button
                    className="mt-2"
                    type="button"
                  >
                    Save changes
                  </Button>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === 'notifications' && (
                <div>
                  <Toggle
                    label="Period predictions"
                    desc="Get notified before your period is expected"
                    defaultOn
                  />

                  <Toggle
                    label="Ovulation window"
                    desc="Alerts for your fertile window"
                    defaultOn
                  />

                  <Toggle
                    label="Daily logging reminder"
                    desc="A gentle nudge each evening"
                  />

                  <Toggle
                    label="Community replies"
                    desc="When someone responds to your post"
                    defaultOn
                  />

                  <Toggle
                    label="Doctor appointment reminders"
                    defaultOn
                  />
                </div>
              )}

              {/* PRIVACY */}
              {tab === 'privacy' && (
                <div>
                  <Toggle
                    label="Anonymous community mode"
                    desc="Hide your profile from other members"
                    defaultOn
                  />

                  <Toggle
                    label="Share data for research"
                    desc="Anonymized data helps improve predictions"
                  />

                  <Toggle
                    label="Require passcode on open"
                  />

                  <div className="pt-4">
                    <Button variant="outline">
                      Export my data
                    </Button>

                    <Button
                      variant="danger"
                      className="ml-3"
                    >
                      Delete account
                    </Button>
                  </div>
                </div>
              )}

              {/* THEME */}
              {tab === 'theme' && (
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  {['Light', 'Dark', 'System'].map((th) => (
                    <button
                      key={th}
                      type="button"
                      className="border border-border rounded-xl p-4 text-sm hover:border-bloom transition-colors focus-ring"
                    >
                      {th}
                    </button>
                  ))}
                </div>
              )}

              {/* LANGUAGE */}
              {tab === 'language' && (
                <div className="max-w-xs">
                  <Label>App language</Label>

                  <select className="w-full h-11 px-3.5 rounded-xl bg-input-background border border-border text-sm focus-ring">
                    <option>English</option>
                    <option>हिन्दी (Hindi)</option>
                    <option>தமிழ் (Tamil)</option>
                    <option>বাংলা (Bengali)</option>
                  </select>
                </div>
              )}

              {/* HELP */}
              {tab === 'help' && (
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Need help? Reach us any time.
                  </p>

                  <Button variant="outline">
                    Contact support
                  </Button>

                  <Button
                    variant="outline"
                    className="ml-3"
                  >
                    Visit help center
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}