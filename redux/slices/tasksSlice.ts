import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Task {
  id: string
  title: string
  assignedTo: string
  assignedBy: string
  dueDate: string
  progress: number
  completed: boolean
  createdAt: string
}

interface TasksState {
  tasks: Task[]
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    assignedTo: "1", // John Doe
    assignedBy: "Team Lead",
    dueDate: "2024-01-15",
    progress: 60,
    completed: false,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Review code changes",
    assignedTo: "1", // John Doe
    assignedBy: "Team Lead",
    dueDate: "2024-01-12",
    progress: 80,
    completed: false,
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "Update user interface",
    assignedTo: "2", // Sarah Wilson
    assignedBy: "Team Lead",
    dueDate: "2024-01-18",
    progress: 30,
    completed: false,
    createdAt: "2024-01-09",
  },
  {
    id: "4",
    title: "Database optimization",
    assignedTo: "4", // Emily Davis
    assignedBy: "Team Lead",
    dueDate: "2024-01-20",
    progress: 100,
    completed: true,
    createdAt: "2024-01-05",
  },
]

const initialState: TasksState = {
  tasks: initialTasks,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "progress" | "completed">>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
    },
    updateTaskProgress: (state, action: PayloadAction<{ taskId: string; progress: number }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.progress = action.payload.progress
        task.completed = action.payload.progress >= 100
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
  },
})

export const { addTask, updateTaskProgress, deleteTask } = tasksSlice.actions
export default tasksSlice.reducer
