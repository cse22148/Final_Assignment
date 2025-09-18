'use client'

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { addTask } from "../redux/slices/tasksSlice"
import { updateActiveTasks } from "../redux/slices/membersSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus } from "lucide-react"
import { format, startOfDay } from "date-fns"

export function TaskForm() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.members.members)
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const currentUser = useAppSelector((state) => state.role.currentUser)

  const [title, setTitle] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [dueDate, setDueDate] = useState<string>("") // store as yyyy-MM-dd string

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selectedMember || !dueDate) return

    dispatch(
      addTask({
        title,
        assignedTo: selectedMember,
        assignedBy: currentUser,
        dueDate,
      })
    )

    const memberTasks =
      tasks.filter((task) => task.assignedTo === selectedMember && !task.completed).length + 1

    dispatch(
      updateActiveTasks({
        memberId: selectedMember,
        count: memberTasks,
      })
    )

    setTitle("")
    setSelectedMember("")
    setDueDate("")
  }

  // min date for input
  const today = format(new Date(), "yyyy-MM-dd")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Assign New Task
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
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

          {/* Member Select */}
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
                      <span className="text-xs text-muted-foreground">
                        ({member.activeTasks} active tasks)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              required
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
