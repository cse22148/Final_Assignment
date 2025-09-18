"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { addTask } from "../redux/slices/tasksSlice"
import { updateActiveTasks } from "../redux/slices/membersSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"

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

    // Add task to Redux store
    dispatch(
      addTask({
        title,
        assignedTo: selectedMember,
        assignedBy: currentUser,
        dueDate: format(dueDate, "yyyy-MM-dd"),
      }),
    )

    // Update member's active task count
    const memberTasks = tasks.filter((task) => task.assignedTo === selectedMember && !task.completed).length + 1 // +1 for the new task

    dispatch(
      updateActiveTasks({
        memberId: selectedMember,
        count: memberTasks,
      }),
    )

    // Reset form
    setTitle("")
    setSelectedMember("")
    setDueDate(undefined)
  }

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
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date)
                    setIsCalendarOpen(false)
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
