"use client"

import { useAppSelector } from "../redux/hooks"
import { StatusSummary } from "./status-summary"
import { TeamFilters } from "./team-filters"
import { TaskForm } from "./task-form"
import { MemberCard } from "./member-card"
import { Card, CardContent } from "./ui/card"
import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react"
import StatusPieChart from "./status-pie-chart"

export function TeamLeadDashboard() {
  const { members, statusFilter, sortBy } = useAppSelector((state) => state.members)
  const tasks = useAppSelector((state) => state.tasks.tasks)

  // Filter and sort members
  const filteredMembers = members
    .filter((member) => statusFilter === "All" || member.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "activeTasks":
          return b.activeTasks - a.activeTasks
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date() && !task.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const statusData = [
    { status: "Working", count: members.filter((m) => m.status === "Working").length },
    { status: "Meeting", count: members.filter((m) => m.status === "Meeting").length },
    { status: "Break", count: members.filter((m) => m.status === "Break").length },
    { status: "Offline", count: members.filter((m) => m.status === "Offline").length },
  ].filter((item) => item.count > 0)

  return (
    <div className="space-y-6">
      {/* Status Summary Cards */}
      <StatusSummary />

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">{overdueTasks}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team Members List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({filteredMembers.length})
            </h2>
          </div>

          <TeamFilters />

          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Right Column - Task Form and Chart */}
        <div className="lg:col-span-2 space-y-6">
          <TaskForm />
          <StatusPieChart data={statusData} />
        </div>
      </div>
    </div>
  )
}
