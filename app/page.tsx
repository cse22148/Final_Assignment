"use client"

import { useAppSelector } from "../redux/hooks"
import { useAutoReset } from "../hooks/use-auto-reset"
import { Header } from "../components/header"
import { TeamLeadDashboard } from "../components/team-lead-dashboard"
import { TeamMemberDashboard } from "../components/team-member-dashboard"

export default function Dashboard() {
  const currentRole = useAppSelector((state) => state.role.currentRole)

  
  useAutoReset()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {currentRole === "lead" ? <TeamLeadDashboard /> : <TeamMemberDashboard />}
      </main>
    </div>
  )
}
