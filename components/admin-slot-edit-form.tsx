import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { updateSlotAction } from "@/lib/actions"
import type { BookingSlot } from "@/lib/tattoo-data"

function todayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function AdminSlotEditForm({ slot }: { slot: BookingSlot }) {
  const minDate = todayDateKey()

  return (
    <div>
      <div className="mb-5 pr-8">
        <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-normal">
          <Pencil className="size-5 text-primary" />
          Update Slot
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Change slot details before a user books it.</p>
      </div>
      <form action={updateSlotAction} className="space-y-4">
        <input name="id" type="hidden" value={slot.id} />
        <div className="space-y-2">
          <Label htmlFor={`slot-date-${slot.id}`}>Date</Label>
          <DatePickerInput id={`slot-date-${slot.id}`} name="date" min={minDate} defaultValue={slot.date} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`slot-time-${slot.id}`}>Time</Label>
            <Input id={`slot-time-${slot.id}`} name="time" defaultValue={slot.time} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`slot-artist-${slot.id}`}>Artist</Label>
            <Input id={`slot-artist-${slot.id}`} name="artist" defaultValue={slot.artist} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`slot-status-${slot.id}`}>Status</Label>
          <Select id={`slot-status-${slot.id}`} name="status" defaultValue={slot.status} required>
            <option value="available">Available</option>
            <option value="waitlist">Waitlist</option>
            <option value="booked">Booked</option>
          </Select>
        </div>
        <Button type="submit" className="w-full uppercase">
          Update Slot
        </Button>
      </form>
    </div>
  )
}
