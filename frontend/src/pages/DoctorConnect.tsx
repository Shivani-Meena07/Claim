import { useState } from 'react'
import { Star, MapPin, Briefcase, Phone, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

const DOCTORS = [
  { id: 1, name: 'Dr. Anjali Rao', specialty: 'Gynecologist', rating: 4.9, experience: '14 yrs', distance: '1.2 km', tone: 'bloom' },
  { id: 2, name: 'Dr. Rhea Kapoor', specialty: 'Endocrinologist', rating: 4.8, experience: '9 yrs', distance: '2.5 km', tone: 'sprout' },
  { id: 3, name: 'Dr. Sana Iyer', specialty: 'Fertility specialist', rating: 4.7, experience: '11 yrs', distance: '3.1 km', tone: 'dusk' },
  { id: 4, name: 'Dr. Meenal Joshi', specialty: 'Nutritionist (PCOS)', rating: 4.9, experience: '7 yrs', distance: '0.8 km', tone: 'sun' },
]

const SLOTS = ['Today, 4:30 PM', 'Today, 6:00 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM']

export default function DoctorConnect() {
  const [booking, setBooking] = useState<typeof DOCTORS[number] | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  function closeModal() {
    setBooking(null)
    setSlot(null)
    setConfirmed(false)
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Doctor connect</h1>
          <p className="text-muted-foreground mt-1">Book verified specialists near you.</p>
        </div>
        <Button variant="danger" className="shrink-0">
          <Phone size={16} /> Emergency contact
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {DOCTORS.map((d) => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center font-display text-lg shrink-0"
                style={{ background: `var(--${d.tone}-soft)`, color: `var(--${d.tone})` }}
              >
                {d.name.split(' ')[1][0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg">{d.name}</h3>
                  <span className="flex items-center gap-1 text-sm text-sun">
                    <Star size={14} fill="currentColor" /> {d.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{d.specialty}</p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {d.experience}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {d.distance}</span>
                </div>
                <Button size="sm" className="mt-3.5" onClick={() => setBooking(d)}>
                  Book consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={!!booking} onClose={closeModal} title={confirmed ? 'Booking confirmed' : `Book ${booking?.name}`}>
        {confirmed ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="h-12 w-12 rounded-full bg-sprout-soft text-sprout flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="font-medium">You're booked for {slot}</p>
            <p className="text-sm text-muted-foreground">A confirmation has been sent to your email. You can reschedule from Settings.</p>
            <Button className="w-full mt-2" onClick={closeModal}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{booking?.specialty} · {booking?.experience} experience</p>
            <div>
              <p className="text-sm font-medium mb-2.5">Choose a time slot</p>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`px-3 py-2.5 rounded-xl text-sm border transition-colors focus-ring ${
                      slot === s ? 'bg-bloom text-white border-bloom' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" disabled={!slot} onClick={() => setConfirmed(true)}>
              Confirm booking
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
