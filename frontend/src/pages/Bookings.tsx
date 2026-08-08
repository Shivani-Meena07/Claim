
import { useEffect, useState } from 'react'
import { Calendar, Clock, UserRound, XCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

type Booking = {
  _id: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  status: 'confirmed' | 'cancelled'
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setError('Please log in to view your bookings.')
          return
        }

        const response = await fetch('/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch bookings'
          )
        }

        setBookings(data.bookings || [])
      } catch (err) {
        console.error('Fetch bookings error:', err)
        setError('Unable to load your bookings. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancel = async (bookingId: string) => {
    try {
      setCancellingId(bookingId)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please log in to cancel a booking.')
        return
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to cancel booking'
        )
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      )
    } catch (err) {
      console.error('Cancel booking error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to cancel booking.'
      )
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl">
          My Bookings
        </h1>

        <p className="text-sm text-muted-foreground mt-2">
          Loading your consultations...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl">
          My Bookings
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          View and manage your doctor consultations.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Calendar
              size={32}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <p className="font-medium">
              No bookings yet
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Your doctor consultations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg">
                    {booking.doctorName}
                  </h3>

                  <div className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar size={15} />
                      {booking.date}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock size={15} />
                      {booking.time}
                    </span>

                    <span className="flex items-center gap-2">
                      <UserRound size={15} />
                      Doctor consultation
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-3">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-sprout-soft text-sprout'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {booking.status === 'confirmed'
                      ? 'Confirmed'
                      : 'Cancelled'}
                  </span>

                  {booking.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={cancellingId === booking._id}
                      onClick={() =>
                        handleCancel(booking._id)
                      }
                    >
                      <XCircle size={15} />
                      {cancellingId === booking._id
                        ? 'Cancelling...'
                        : 'Cancel booking'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
