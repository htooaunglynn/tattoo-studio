"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type DialogContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialog() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error("Dialog components must be used inside Dialog")
  }

  return context
}

export function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ children }: { children: React.ReactElement<{ onClick?: React.MouseEventHandler }> }) {
  const { setOpen } = useDialog()

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event)
      setOpen(true)
    },
  })
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = useDialog()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl",
          className,
        )}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-zinc-900 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen(false)}
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  )
}
