"use client"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { switchRole } from "../redux/slices/roleSlice"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { DarkModeToggle } from "./dark-mode-toggle"
import { Users, UserCheck } from "lucide-react"

export function Header() {
  const dispatch = useAppDispatch()
  const { currentRole, currentUser } = useAppSelector((state) => state.role)

  const handleRoleToggle = (checked: boolean) => {
    dispatch(switchRole(checked ? "lead" : "member"))
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Team Pulse</h1>
              <p className="text-sm text-muted-foreground">Productivity Dashboard</p>
            </div>
          </div>
        </div>

        {/* Center - Current role indicator */}
        <div className="flex items-center gap-3">
          <Badge variant={currentRole === "lead" ? "default" : "secondary"} className="px-3 py-1">
            {currentRole === "lead" ? (
              <>
                <UserCheck className="w-4 h-4 mr-1" />
                Team Lead View
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-1" />
                Team Member View
              </>
            )}
          </Badge>
        </div>

        
        <div className="flex items-center gap-4">
         
          <DarkModeToggle />

          {/* Role Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="role-toggle" className="text-sm font-medium">
              Team Lead
            </Label>
            <Switch id="role-toggle" checked={currentRole === "lead"} onCheckedChange={handleRoleToggle} />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{currentUser}</p>
              <p className="text-xs text-muted-foreground">{currentRole === "lead" ? "Team Lead" : "Team Member"}</p>
            </div>
            <Avatar>
              <AvatarImage src="/professional-male-avatar.png" alt={currentUser} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
