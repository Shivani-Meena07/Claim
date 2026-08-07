
import { useEffect, useState } from 'react'
import { Star, MapPin, Briefcase, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

type Doctor = {
  _id: string
  name: string
  specialty: string
  rating: number
  experience: number
  distance: number
  phone: string
  location: string
  availableSlots: string[]
}

export default function DoctorConnect() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [booking, setBooking] = useState<Doctor | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      console.log('Starting doctor request...')

      const response = await fetch('/api/doctors')

      console.log('Response received:', response.status)

      const data = await response.json()

      console.log('Doctor data:', data)

      setDoctors(data.doctors)
    } catch (err) {
      console.error('Doctor request failed:', err)
      setError('Unable to load doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  fetchDoctors()
}, [])

  function closeModal() {
    setBooking(null)
    setSlot(null)
    setConfirmed(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Doctor connect</h1>
        <p className="text-muted-foreground">
          Book verified specialists near you.
        </p>
      </div>

      <Button variant="outline">
        Emergency contact
      </Button>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading doctors...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 gap-5">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-display text-lg shrink-0 bg-bloom-soft text-bloom">
                  {doctor.name
                    .replace('Dr. ', '')
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg">
                      {doctor.name}
                    </h3>

                    <span className="flex items-center gap-1 text-sm text-sun">
                      <Star size={14} fill="currentColor" />
                      {doctor.rating}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {doctor.specialty}
                  </p>

                  <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {doctor.experience} yrs
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {doctor.distance} km
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="mt-3.5"
                    onClick={() => {
                      setBooking(doctor)
                      setSlot(null)
                      setConfirmed(false)
                    }}
                  >
                    Book consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No doctors are currently available.
        </p>
      )}

      <Modal
        open={!!booking}
        onClose={closeModal}
        title={
          confirmed
            ? 'Booking confirmed'
            : booking
              ? `Book ${booking.name}`
              : 'Book consultation'
        }
      >
        {confirmed ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="h-12 w-12 rounded-full bg-sprout-soft text-sprout flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>

            <p className="font-medium">
              You're booked for {slot}
            </p>

            <p className="text-sm text-muted-foreground">
              A confirmation has been sent to your email. You can
              reschedule from Settings.
            </p>

            <Button
              className="w-full mt-2"
              onClick={closeModal}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {booking?.specialty} · {booking?.experience} years experience
            </p>

            <div>
              <p className="text-sm font-medium mb-2.5">
                Choose a time slot
              </p>

              <div className="grid grid-cols-2 gap-2">
                {booking?.availableSlots.map((availableSlot) => (
                  <button
                    key={availableSlot}
                    onClick={() => setSlot(availableSlot)}
                    className={`px-3 py-2.5 rounded-xl text-sm border transition-colors focus-ring ${
                      slot === availableSlot
                        ? 'bg-bloom text-white border-bloom'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {availableSlot}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!slot}
              onClick={() => setConfirmed(true)}
            >
              Confirm booking
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
