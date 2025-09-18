"use client"

import { useAppSelector } from "../redux/hooks"
import { Card, CardContent } from "./ui/card"
import type { MemberStatus } from "../redux/slices/membersSlice"
import { UserCheck, Coffee, Video, WifiOff } from "lucide-react"

export function StatusSummary() {
  const members = useAppSelector((state) => state.members.members)

  const statusCounts = members.reduce(
    (acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1
      return acc
    },
    {} as Record<MemberStatus, number>,
  )

  const statusConfig = [
    { status: "Working" as MemberStatus, icon: UserCheck, color: "text-green-600", bgColor: "bg-green-50" },
    { status: "Meeting" as MemberStatus, icon: Video, color: "text-blue-600", bgColor: "bg-blue-50" },
    { status: "Break" as MemberStatus, icon: Coffee, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { status: "Offline" as MemberStatus, icon: WifiOff, color: "text-gray-600", bgColor: "bg-gray-50" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statusConfig.map(({ status, icon: Icon, color, bgColor }) => (
        <Card key={status}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{status}</p>
                <p className="text-2xl font-bold text-foreground">{statusCounts[status] || 0}</p>
              </div>
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
