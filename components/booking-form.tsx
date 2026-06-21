import { CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { bookingAction } from "@/lib/actions"
import type { BookingSlot } from "@/lib/tattoo-data"
import { flashDesigns } from "@/lib/tattoo-data"

export function BookingForm({ slots, userEmail }: { slots: BookingSlot[]; userEmail: string }) {
  const bookableSlots = slots.filter((slot) => slot.status !== "booked")

  return (
    <Card className="border-zinc-800 bg-zinc-950/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl uppercase">
          <CalendarCheck className="size-5 text-primary" />
          Book Flash
        </CardTitle>
        <CardDescription>Select one design and one available or waitlist slot.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={bookingAction} className="space-y-4">
          <input name="userEmail" type="hidden" value={userEmail} />
          <div className="space-y-2">
            <Label htmlFor="designId">Design</Label>
            <Select id="designId" name="designId" required>
              {flashDesigns.map((design) => (
                <option key={design.id} value={design.id}>
                  {design.name} - {design.price}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slotId">Date and time</Label>
            <Select id="slotId" name="slotId" required>
              {bookableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.date} at {slot.time} with {slot.artist} ({slot.status})
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full uppercase">
            Submit Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
