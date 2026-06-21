import { Badge } from "@/components/ui/badge"
import type { SlotStatus } from "@/lib/tattoo-data"

export function StatusBadge({ status }: { status: SlotStatus }) {
  const variant = status === "available" ? "success" : status === "waitlist" ? "warning" : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}
