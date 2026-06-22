"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void
}

export function DatePickerInput({ className, onClick, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = React.useRef<DateInputElement>(null)

  function openPicker() {
    try {
      inputRef.current?.showPicker?.()
    } catch {
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="date"
        className={cn("cursor-pointer pr-11", className)}
        onClick={(event) => {
          onClick?.(event)
          openPicker()
        }}
        {...props}
      />
      <button
        type="button"
        aria-label="Open calendar"
        className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={openPicker}
      >
        <CalendarDays className="size-4" />
      </button>
    </div>
  )
}
