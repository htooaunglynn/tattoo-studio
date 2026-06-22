import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateDesignAction } from "@/lib/actions"
import type { FlashDesign } from "@/lib/tattoo-data"

function stripDurationSuffix(value: string) {
  return value.replace(/\s*min$/i, "").trim()
}

function stripPricePrefix(value: string) {
  return value.replace(/^\$/, "").trim()
}

export function AdminDesignEditForm({ design }: { design: FlashDesign }) {
  return (
    <div>
      <div className="mb-5 pr-8">
        <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-normal">
          <Pencil className="size-5 text-primary" />
          Update Design
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Change design details before users book it.</p>
      </div>
      <form action={updateDesignAction} className="space-y-4">
        <input name="id" type="hidden" value={design.id} />
        <div className="space-y-2">
          <Label htmlFor={`design-name-${design.id}`}>Name</Label>
          <Input id={`design-name-${design.id}`} name="name" defaultValue={design.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`design-style-${design.id}`}>Style</Label>
          <Input id={`design-style-${design.id}`} name="style" defaultValue={design.style} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`design-duration-${design.id}`}>Duration</Label>
            <div className="relative">
              <Input
                id={`design-duration-${design.id}`}
                name="duration"
                type="number"
                min="1"
                defaultValue={stripDurationSuffix(design.duration)}
                className="pr-12"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`design-price-${design.id}`}>Price</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
              <Input
                id={`design-price-${design.id}`}
                name="price"
                type="number"
                min="1"
                defaultValue={stripPricePrefix(design.price)}
                className="pl-7"
                required
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`design-image-${design.id}`}>Replace image</Label>
          <Input id={`design-image-${design.id}`} name="image" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" />
        </div>
        <Button type="submit" className="w-full uppercase">
          Update Design
        </Button>
      </form>
    </div>
  )
}
