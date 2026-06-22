import { redirect } from "next/navigation"
import { LogOut, Sparkles } from "lucide-react"

import { auth } from "@/auth"
import { AdminCreateActions } from "@/components/admin-create-actions"
import { BookingForm } from "@/components/booking-form"
import { InventoryTabs } from "@/components/inventory-tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutAction } from "@/lib/actions"
import { consumeFlashMessage, readDemoState } from "@/lib/server-store"
import { mergeSlotBookings } from "@/lib/tattoo-data"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.email || !session.user.role) {
        redirect("/login")
    }

    const state = await readDemoState()
    const message = await consumeFlashMessage()
    const designs = state.designs
    const slots = mergeSlotBookings(state.slots, state.bookings)
    const userBookings = state.bookings.filter((booking) => booking.userEmail === session.user.email)
    const availableCount = slots.filter((slot) => slot.status === "available").length
    const waitlistCount = slots.filter((slot) => slot.status === "waitlist").length
    const isAdmin = session.user.role === "admin"
    const bookedDesignIds = [...new Set(state.bookings.map((booking) => booking.designId))]
    const bookedSlotIds = [...new Set(state.bookings.map((booking) => booking.slotId))]

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
                        <Badge variant="outline" className="uppercase">{session.user.name}</Badge>
                        <Badge variant="secondary" className="uppercase">
                            {session.user.role}
                        </Badge>
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
                        <Alert
                            className={cn(
                                message.variant === "success"
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                                    : "border-red-500/40 bg-red-500/10 text-red-200",
                            )}
                        >
                            <AlertDescription className={message.variant === "success" ? "text-emerald-200" : "text-red-200"}>
                                {message.message}
                            </AlertDescription>
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
                                <CardTitle>{isAdmin ? state.bookings.length : userBookings.length}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <InventoryTabs
                        designs={designs}
                        slots={slots}
                        isAdmin={isAdmin}
                        bookedDesignIds={bookedDesignIds}
                        bookedSlotIds={bookedSlotIds}
                    />
                </section>

                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    {isAdmin ? (
                        <>
                            <AdminCreateActions />
                            <Card className="border-zinc-800 bg-zinc-950/90">
                                <CardHeader>
                                    <CardTitle className="text-xl uppercase">Bookings</CardTitle>
                                    <CardDescription>All bookings saved in this browser demo.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {state.bookings.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No bookings yet.</p>
                                    ) : (
                                        state.bookings.map((booking) => {
                                            const design = designs.find((candidate) => candidate.id === booking.designId)
                                            const slot = slots.find((candidate) => candidate.id === booking.slotId)

                                            return (
                                                <div key={booking.id} data-testid="admin-booking" className="rounded-md border border-zinc-800 bg-background p-3">
                                                    <p className="font-bold">{design?.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.userEmail} - {slot?.date} at {slot?.time}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <BookingForm designs={designs} slots={slots} />
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
                                            const design = designs.find((candidate) => candidate.id === booking.designId)
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
                        </>
                    )}
                </aside>
            </div>
        </main>
    )
}
