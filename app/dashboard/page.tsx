import Image from "next/image"
import { redirect } from "next/navigation"
import { LogOut, Sparkles } from "lucide-react"

import { auth } from "@/auth"
import { BookingForm } from "@/components/booking-form"
import { StatusBadge } from "@/components/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutAction } from "@/lib/actions"
import { consumeFlashMessage, readDemoState } from "@/lib/server-store"
import { flashDesigns, generateSlots, mergeSlotBookings } from "@/lib/tattoo-data"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const state = await readDemoState()
  const message = await consumeFlashMessage()
  const slots = mergeSlotBookings(generateSlots(), state.bookings)
  const userBookings = state.bookings.filter((booking) => booking.userEmail === session.user.email)
  const availableCount = slots.filter((slot) => slot.status === "available").length
  const waitlistCount = slots.filter((slot) => slot.status === "waitlist").length

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,rgba(13,13,18,1),rgba(20,20,28,1)_52%,rgba(30,18,20,1))]">
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Tattoo-Studio</p>
            </div>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-normal sm:text-5xl">Flash Booking Board</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{session.user.email}</Badge>
            <form action={logoutAction}>
              <Button variant="outline" type="submit">
                <LogOut className="size-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="space-y-6">
          {message ? (
            <Alert className="border-primary/40 bg-primary/10">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-zinc-800 bg-zinc-950/90">
              <CardHeader>
                <CardDescription>Available slots</CardDescription>
                <CardTitle>{availableCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-zinc-800 bg-zinc-950/90">
              <CardHeader>
                <CardDescription>Waitlist openings</CardDescription>
                <CardTitle>{waitlistCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-zinc-800 bg-zinc-950/90">
              <CardHeader>
                <CardDescription>Your bookings</CardDescription>
                <CardTitle>{userBookings.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <section aria-labelledby="designs-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 id="designs-heading" className="text-2xl font-black uppercase">
                  Flash Designs
                </h2>
                <p className="text-sm text-muted-foreground">Five ready-to-book placeholder tattoo designs.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {flashDesigns.map((design) => (
                <Card key={design.id} className="overflow-hidden border-zinc-800 bg-zinc-950/90">
                  <div className="relative aspect-[4/3] bg-zinc-900">
                    <Image src={design.image} alt={`${design.name} placeholder design`} fill className="object-cover" sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl uppercase">{design.name}</CardTitle>
                    <CardDescription>{design.style}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <Badge variant="secondary">{design.duration}</Badge>
                    <span className="text-lg font-black text-primary">{design.price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="slots-heading">
            <div className="mb-4">
              <h2 id="slots-heading" className="text-2xl font-black uppercase">
                Next 2 Weeks
              </h2>
              <p className="text-sm text-muted-foreground">Slot status updates after a local booking is submitted.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {slots.map((slot) => (
                <Card key={slot.id} className="border-zinc-800 bg-zinc-950/80">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-bold">{slot.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot.time} with {slot.artist}
                      </p>
                    </div>
                    <StatusBadge status={slot.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <BookingForm slots={slots} userEmail={session.user.email} />
          <Card className="border-zinc-800 bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-xl uppercase">Your Queue</CardTitle>
              <CardDescription>Bookings saved in this browser demo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              ) : (
                userBookings.map((booking) => {
                  const design = flashDesigns.find((candidate) => candidate.id === booking.designId)
                  const slot = slots.find((candidate) => candidate.id === booking.slotId)

                  return (
                    <div key={booking.id} data-testid="user-booking" className="rounded-md border border-zinc-800 bg-background p-3">
                      <p className="font-bold">{design?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot?.date} at {slot?.time}
                      </p>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
