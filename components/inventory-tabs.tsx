"use client"

import { Pencil, Trash2 } from "lucide-react"

import { AdminDesignEditForm } from "@/components/admin-design-edit-form"
import { AdminSlotEditForm } from "@/components/admin-slot-edit-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { deleteDesignAction, deleteSlotAction } from "@/lib/actions"
import type { BookingSlot, FlashDesign } from "@/lib/tattoo-data"

export function InventoryTabs({
    designs,
    slots,
    isAdmin,
    bookedDesignIds = [],
    bookedSlotIds = [],
}: {
    designs: FlashDesign[]
    slots: BookingSlot[]
    isAdmin: boolean
    bookedDesignIds?: string[]
    bookedSlotIds?: string[]
}) {
    const bookedDesignIdSet = new Set(bookedDesignIds)
    const bookedSlotIdSet = new Set(bookedSlotIds)

    return (
        <Tabs defaultValue="designs" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase">Studio Inventory</h2>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin ? "Manage the designs and slots users can book." : "Browse available designs and appointment slots."}
                    </p>
                </div>
                <TabsList>
                    <TabsTrigger value="designs">Flash Designs</TabsTrigger>
                    <TabsTrigger value="slots">Studio Slots</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="designs">
                {designs.length === 0 ? (
                    <Card className="border-zinc-800 bg-zinc-950/90">
                        <CardContent className="p-6 text-sm text-muted-foreground">
                            {isAdmin ? "Create the first design from the admin actions." : "No admin-created designs are available yet."}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {designs.map((design) => {
                            const booked = bookedDesignIdSet.has(design.id)

                            return (
                                <Card key={design.id} className="overflow-hidden border-zinc-800 bg-zinc-950/90">
                                    <div
                                        aria-label={`${design.name} design image`}
                                        className="relative aspect-[4/3] bg-cover bg-center"
                                        style={{ backgroundImage: `url(${design.image})` }}
                                    />
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <CardTitle className="text-xl uppercase">{design.name}</CardTitle>
                                                <CardDescription>{design.style}</CardDescription>
                                            </div>
                                            {booked ? <Badge variant="destructive">Booked</Badge> : null}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary">{design.duration}</Badge>
                                            <span className="text-lg font-black text-primary">{design.price}</span>
                                        </div>
                                        {isAdmin ? (
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button type="button" variant="outline" size="sm" disabled={booked}>
                                                            <Pencil className="size-4" />
                                                            Update
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <AdminDesignEditForm design={design} />
                                                    </DialogContent>
                                                </Dialog>
                                                <form action={deleteDesignAction}>
                                                    <input name="id" type="hidden" value={design.id} />
                                                    <Button type="submit" variant="outline" size="sm" className="w-full" disabled={booked}>
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="slots">
                {slots.length === 0 ? (
                    <Card className="border-zinc-800 bg-zinc-950/90">
                        <CardContent className="p-6 text-sm text-muted-foreground">
                            {isAdmin ? "Create the first slot from the admin actions." : "No admin-created slots are available yet."}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {slots.map((slot) => {
                            const booked = bookedSlotIdSet.has(slot.id)

                            return (
                                <Card key={slot.id} className="border-zinc-800 bg-zinc-950/80">
                                    <CardContent className="space-y-4 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-bold">{slot.date}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {slot.time} with {slot.artist}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {/* <StatusBadge status={slot.status} /> */}
                                                {booked ? <Badge variant="destructive">Booked</Badge> : null}
                                            </div>
                                        </div>
                                        {isAdmin ? (
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button type="button" variant="outline" size="sm" disabled={booked}>
                                                            <Pencil className="size-4" />
                                                            Update
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <AdminSlotEditForm slot={slot} />
                                                    </DialogContent>
                                                </Dialog>
                                                <form action={deleteSlotAction}>
                                                    <input name="id" type="hidden" value={slot.id} />
                                                    <Button type="submit" variant="outline" size="sm" className="w-full" disabled={booked}>
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}
