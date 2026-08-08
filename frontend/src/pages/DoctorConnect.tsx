import { useEffect, useState } from 'react'
import { Star, MapPin, Briefcase, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

const API_URL = import.meta.env.VITE_API_URL

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
  const [date, setDate] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log('Starting doctor request...')

        const response = await fetch(`${API_URL}/api/doctors`)

        console.log('Response received:', response.status)

        const data = await response.json()

        console.log('Doctor data:', data)

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch doctors')
        }

        setDoctors(data.doctors || [])
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
    setDate('')
    setConfirmed(false)
    setBookingError('')
    setBookingLoading(false)
  }

  const handleBooking = async () => {
    if (!booking || !slot || !date) {
      return
    }

    try {
      setBookingLoading(true)
      setBookingError('')

      const token = localStorage.getItem('token')

      if (!token) {
        setBookingError('Please log in to book a consultation.')
        return
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: booking._id,
          date,
          time: slot,
        }),
      })

      const data = await response.json()

      console.log('Booking response:', data)

      if (!response.ok) {
        setBookingError(
          data.message || 'Failed to book consultation.'
        )
        return
      }

      setConfirmed(true)
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError(
        'Unable to book consultation. Please try again.'
      )
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            Doctor Connect
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Book verified specialists near you.
          </p>
        </div>

        <Button variant="outline">
          Emergency contact
        </Button>
      </div>

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
                      setDate('')
                      setConfirmed(false)
                      setBookingError('')
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
              Your consultation has been successfully booked.
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
              <label className="text-sm font-medium">
                Select date
              </label>

              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setDate(e.target.value)
                  setBookingError('')
                }}
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2.5">
                Choose a time slot
              </p>

              <div className="grid grid-cols-2 gap-2">
                {booking?.availableSlots.map((availableSlot) => (
                  <button
                    key={availableSlot}
                    onClick={() => {
                      setSlot(availableSlot)
                      setBookingError('')
                    }}
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

            {bookingError && (
              <p className="text-sm text-red-500">
                {bookingError}
              </p>
            )}

            <Button
              className="w-full"
              disabled={!slot || !date || bookingLoading}
              onClick={handleBooking}
            >
              {bookingLoading
                ? 'Booking...'
                : 'Confirm booking'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}