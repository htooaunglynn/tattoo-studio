"use client"

import { CalendarPlus, Palette } from "lucide-react"

import { AdminDesignForm } from "@/components/admin-design-form"
import { AdminSlotForm } from "@/components/admin-slot-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function AdminCreateActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <Dialog>
        <DialogTrigger>
          <Button type="button" className="w-full uppercase">
            <Palette className="size-4" />
            Create Design
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AdminDesignForm />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          <Button type="button" variant="outline" className="w-full uppercase">
            <CalendarPlus className="size-4" />
            Create Slot
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AdminSlotForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}

