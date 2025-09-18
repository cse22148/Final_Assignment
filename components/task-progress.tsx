"use client"

import { useAppDispatch } from "../redux/hooks"
import { updateTaskProgress } from "../redux/slices/tasksSlice"
import type { Task } from "../redux/slices/tasksSlice"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Calendar, Minus, Plus, CheckCircle } from "lucide-react"
import { format, isAfter, parseISO } from "date-fns"

interface TaskProgressProps {
  task: Task
}

export function TaskProgress({ task }: TaskProgressProps) {
  const dispatch = useAppDispatch()

  const handleProgressChange = (change: number) => {
    const newProgress = Math.max(0, Math.min(100, task.progress + change))
    dispatch(
      updateTaskProgress({
        taskId: task.id,
        progress: newProgress,
      }),
    )
  }

  const isOverdue = isAfter(new Date(), parseISO(task.dueDate)) && !task.completed
  const dueDate = parseISO(task.dueDate)

  return (
    <Card className={`${task.completed ? "opacity-75" : ""} ${isOverdue ? "border-destructive" : ""}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Task Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground">Assigned by: {task.assignedBy}</p>
            </div>
            {task.completed && (
              <Badge variant="default" className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              Due: {format(dueDate, "MMM dd, yyyy")}
              {isOverdue && " (Overdue)"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>

          {/* Progress Controls */}
          {!task.completed && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(-10)}
                disabled={task.progress <= 0}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium px-3">Adjust Progress</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressChange(10)}
                disabled={task.progress >= 100}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
