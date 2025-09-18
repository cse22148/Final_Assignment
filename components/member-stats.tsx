"use client"

import { useAppSelector } from "../redux/hooks"
import { Card, CardContent } from "./ui/card"
import { CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react"

export function MemberStats() {
  const currentUser = useAppSelector((state) => state.role.currentUser)
  const members = useAppSelector((state) => state.members.members)
  const tasks = useAppSelector((state) => state.tasks.tasks)

  // Find current user's member data
  const currentMember = members.find((member) => member.name === currentUser)
  const currentMemberId = currentMember?.id

  // Calculate user's task statistics
  const userTasks = tasks.filter((task) => task.assignedTo === currentMemberId)
  const completedTasks = userTasks.filter((task) => task.completed)
  const activeTasks = userTasks.filter((task) => !task.completed)
  const overdueTasks = userTasks.filter((task) => new Date(task.dueDate) < new Date() && !task.completed)

  const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0

  const avgProgress =
    activeTasks.length > 0
      ? Math.round(activeTasks.reduce((sum, task) => sum + task.progress, 0) / activeTasks.length)
      : 0

  const stats = [
    {
      title: "Active Tasks",
      value: activeTasks.length,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedTasks.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Overdue",
      value: overdueTasks.length,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
