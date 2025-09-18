"use client"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { updateMemberStatus, type MemberStatus } from "../redux/slices/membersSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { UserCheck, Coffee, Video, WifiOff } from "lucide-react"

export function StatusSelector() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.role.currentUser)
  const members = useAppSelector((state) => state.members.members)

  // Find current user's member data
  const currentMember = members.find((member) => member.name === currentUser)
  const currentStatus = currentMember?.status || "Offline"

  const statusOptions = [
    { status: "Working" as MemberStatus, icon: UserCheck, color: "bg-green-500 hover:bg-green-600", label: "Working" },
    { status: "Break" as MemberStatus, icon: Coffee, color: "bg-yellow-500 hover:bg-yellow-600", label: "On Break" },
    { status: "Meeting" as MemberStatus, icon: Video, color: "bg-blue-500 hover:bg-blue-600", label: "In Meeting" },
    { status: "Offline" as MemberStatus, icon: WifiOff, color: "bg-gray-500 hover:bg-gray-600", label: "Offline" },
  ]

  const handleStatusChange = (status: MemberStatus) => {
    if (currentMember) {
      dispatch(
        updateMemberStatus({
          memberId: currentMember.id,
          status,
        }),
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map(({ status, icon: Icon, color, label }) => (
            <Button
              key={status}
              variant={currentStatus === status ? "default" : "outline"}
              className={`flex items-center gap-2 h-12 ${
                currentStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => handleStatusChange(status)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current Status: <span className="font-medium text-foreground">{currentStatus}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {currentMember?.lastActivity || "Never"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
