import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { createDesignAction } from "@/lib/actions"
import { designImageOptions } from "@/lib/tattoo-data"

export function AdminDesignForm() {
  return (
    <div>
      <div className="mb-5 pr-8">
        <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-normal">
          <Palette className="size-5 text-primary" />
          Create Design
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Add flash artwork that users can book.</p>
      </div>
      <form action={createDesignAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Black Rose" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Input id="style" name="style" placeholder="Fine line botanical" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <div className="relative">
              <Input id="duration" name="duration" type="number" min="1" placeholder="90" className="pr-12" required />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
              <Input id="price" name="price" type="number" min="1" placeholder="180" className="pl-7" required />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Design image</Label>
          <Select id="image" name="image" required>
            {designImageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" className="w-full uppercase">
          Create Design
        </Button>
      </form>
    </div>
  )
}
