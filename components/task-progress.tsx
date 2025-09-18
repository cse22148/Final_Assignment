 'use client'

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { addTask, updateTaskProgress } from "../redux/slices/tasksSlice"
import { updateActiveTasks } from "../redux/slices/membersSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Progress } from "./ui/progress"   // ✅ Import Progress!
import { CalendarIcon, Plus, Minus, CheckCircle } from "lucide-react"
import { format, startOfDay, isAfter, parseISO } from "date-fns"
import { Badge } from "./ui/badge"

export function TaskForm() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.members.members)
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const currentUser = useAppSelector((state) => state.role.currentUser)

  const [title, setTitle] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selectedMember || !dueDate) return

    dispatch(
      addTask({
        title,
        assignedTo: selectedMember,
        assignedBy: currentUser,
        dueDate: format(dueDate, "yyyy-MM-dd"),
        progress: 0,
        completed: false,
      })
    )

    const memberTasks = tasks.filter((task) => task.assignedTo === selectedMember && !task.completed).length + 1
    dispatch(updateActiveTasks({ memberId: selectedMember, count: memberTasks }))

    setTitle("")
    setSelectedMember("")
    setDueDate(undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Assign New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task description..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-select">Assign to Member</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember} required>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground">({member.activeTasks} active tasks)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    if (date) {
                      setDueDate(date)
                      setIsCalendarOpen(false)
                    }
                  }}
                  disabled={(date) => date < startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Assign Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

 export function TaskProgress({ task }: { task: any }) {
  const dispatch = useAppDispatch()

  const handleProgressChange = (change: number) => {
    const newProgress = Math.max(0, Math.min(100, task.progress + change))
    dispatch(updateTaskProgress({ taskId: task.id, progress: newProgress }))
  }

  const dueDate = parseISO(task.dueDate)
  const isOverdue = isAfter(new Date(), dueDate) && !task.completed

  return (
    <Card className={`${task.completed ? "opacity-75" : ""} ${isOverdue ? "border-destructive" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">Assigned by: {task.assignedBy}</p>
          </div>

          {task.completed && (
            <Badge variant="default" className="bg-green-500 text-white flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Completed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
            Due: {format(dueDate, "MMM dd, yyyy")}
            {isOverdue && " (Overdue)"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {!task.completed && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleProgressChange(-10)} disabled={task.progress <= 0}>
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-medium px-3">Adjust Progress</span>
            <Button variant="outline" size="sm" onClick={() => handleProgressChange(10)} disabled={task.progress >= 100}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
