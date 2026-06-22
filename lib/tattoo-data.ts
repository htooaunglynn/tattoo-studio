export type SlotStatus = "available" | "booked" | "waitlist"
export type Role = "admin" | "user"

export type FlashDesign = {
  id: string
  name: string
  style: string
  duration: string
  price: string
  image: string
}

export type BookingSlot = {
  id: string
  date: string
  time: string
  artist: string
  status: SlotStatus
}

export type Booking = {
  id: string
  userEmail: string
  designId: string
  slotId: string
  createdAt: string
}

export const flashDesigns: FlashDesign[] = [
  {
    id: "black-rose",
    name: "Black Rose",
    style: "Fine line botanical",
    duration: "90 min",
    price: "$180",
    image: "/designs/black-rose.svg",
  },
  {
    id: "dagger-moth",
    name: "Dagger Moth",
    style: "Neo traditional",
    duration: "2 hr",
    price: "$260",
    image: "/designs/dagger-moth.svg",
  },
  {
    id: "moon-serpent",
    name: "Moon Serpent",
    style: "Blackwork",
    duration: "2.5 hr",
    price: "$320",
    image: "/designs/moon-serpent.svg",
  },
  {
    id: "sacred-heart",
    name: "Sacred Heart",
    style: "American traditional",
    duration: "2 hr",
    price: "$240",
    image: "/designs/sacred-heart.svg",
  },
  {
    id: "crane-wave",
    name: "Crane Wave",
    style: "Japanese inspired",
    duration: "3 hr",
    price: "$390",
    image: "/designs/crane-wave.svg",
  },
]

const artists = ["Mara", "June", "Val"]
const times = ["11:00 AM", "1:30 PM", "4:00 PM"]

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export function generateSlots(start = new Date()) {
  const base = new Date(start)
  base.setHours(12, 0, 0, 0)

  const slots: BookingSlot[] = []

  for (let day = 0; day < 14; day += 1) {
    const date = addDays(base, day)
    const dateKey = toDateKey(date)

    times.forEach((time, index) => {
      const seeded = (day + index) % 7
      const status: SlotStatus = seeded === 0 ? "booked" : seeded === 3 ? "waitlist" : "available"

      slots.push({
        id: `${dateKey}-${index}`,
        date: dateKey,
        time,
        artist: artists[(day + index) % artists.length],
        status,
      })
    })
  }

  return slots
}

export function mergeSlotBookings(slots: BookingSlot[], bookings: Booking[]) {
  const bookedSlotIds = new Set(bookings.map((booking) => booking.slotId))

  return slots.map((slot) => ({
    ...slot,
    status: bookedSlotIds.has(slot.id) ? "booked" : slot.status,
  }))
}

export function findBookableSlot(slotId: string, slots: BookingSlot[], bookings: Booking[]) {
  const slot = mergeSlotBookings(slots, bookings).find((candidate) => candidate.id === slotId)

  if (!slot || slot.status === "booked") {
    return null
  }

  return slot
}
