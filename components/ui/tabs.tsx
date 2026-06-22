"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("Tabs components must be used inside Tabs")
  }

  return context
}

export function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="tablist" className={cn("inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-1", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: activeValue, setValue } = useTabs()
  const active = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "cursor-pointer rounded px-3 py-2 text-sm font-semibold uppercase text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-primary text-primary-foreground hover:text-primary-foreground" : null,
        className,
      )}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: activeValue } = useTabs()

  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}
