import { Badge } from "./ui/badge"
import type { MemberStatus } from "../redux/slices/membersSlice"
import { Circle } from "lucide-react"

interface StatusBadgeProps {
  status: MemberStatus
  size?: "sm" | "md"
}

const statusConfig = {
  Working: { color: "bg-green-500", label: "Working", variant: "default" as const },
  Break: { color: "bg-yellow-500", label: "Break", variant: "secondary" as const },
  Meeting: { color: "bg-blue-500", label: "Meeting", variant: "outline" as const },
  Offline: { color: "bg-gray-400", label: "Offline", variant: "secondary" as const },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${size === "sm" ? "text-xs px-2 py-0.5" : "px-3 py-1"}`}
    >
      <Circle className={`w-2 h-2 ${config.color} rounded-full`} />
      {config.label}
    </Badge>
  )
}
