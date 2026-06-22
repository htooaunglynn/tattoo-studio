import { CalendarPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePickerInput } from "@/components/ui/date-picker-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { createSlotAction } from "@/lib/actions"

function todayDateKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function AdminSlotForm() {
  const minDate = todayDateKey()

  return (
    <div>
      <div className="mb-5 pr-8">
        <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-normal">
          <CalendarPlus className="size-5 text-primary" />
          Create Slot
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Add appointment times that users can book.</p>
      </div>
      <form action={createSlotAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePickerInput id="date" name="date" min={minDate} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" name="time" placeholder="11:00 AM" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist">Artist</Label>
            <Input id="artist" name="artist" placeholder="Mara" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue="available" required>
            <option value="available">Available</option>
            <option value="waitlist">Waitlist</option>
            <option value="booked">Booked</option>
          </Select>
        </div>
        <Button type="submit" className="w-full uppercase">
          Create Slot
        </Button>
      </form>
    </div>
  )
}
