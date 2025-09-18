"use client"

import { useAppSelector } from "../redux/hooks"
import { StatusSelector } from "./status-selector"
import { TaskProgress } from "./task-progress"
import { MemberStats } from "./member-stats"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckSquare, User } from "lucide-react"

export function TeamMemberDashboard() {
  const currentUser = useAppSelector((state) => state.role.currentUser)
  const members = useAppSelector((state) => state.members.members)
  const tasks = useAppSelector((state) => state.tasks.tasks)

  // Find current user's member data
  const currentMember = members.find((member) => member.name === currentUser)
  const currentMemberId = currentMember?.id

  // Get user's tasks
  const userTasks = tasks.filter((task) => task.assignedTo === currentMemberId)
  const activeTasks = userTasks.filter((task) => !task.completed)
  const completedTasks = userTasks.filter((task) => task.completed)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {currentUser}!</h1>
              <p className="text-muted-foreground">
                You have {activeTasks.length} active tasks and {completedTasks.length} completed tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Statistics */}
      <MemberStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Selector */}
        <div>
          <StatusSelector />
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Your Tasks ({userTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks assigned yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Active Tasks */}
                  {activeTasks.length > 0 && (
                    <div>
                      <h3 className="font-medium text-foreground mb-3">Active Tasks</h3>
                      <div className="space-y-3">
                        {activeTasks.map((task) => (
                          <TaskProgress key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {completedTasks.length > 0 && (
                    <div>
                      <h3 className="font-medium text-foreground mb-3 mt-6">Completed Tasks</h3>
                      <div className="space-y-3">
                        {completedTasks.map((task) => (
                          <TaskProgress key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
