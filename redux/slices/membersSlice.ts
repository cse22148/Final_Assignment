import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type MemberStatus = "Working" | "Break" | "Meeting" | "Offline"

export interface Member {
  id: string
  name: string
  email: string
  status: MemberStatus
  avatar: string
  activeTasks: number
  lastActivity: string
}

interface MembersState {
  members: Member[]
  statusFilter: MemberStatus | "All"
  sortBy: "name" | "activeTasks" | "status"
}

// Mock data simulating randomuser.me API
const initialMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    status: "Working",
    avatar: "/professional-male-avatar.png",
    activeTasks: 3,
    lastActivity: "2 minutes ago",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    status: "Meeting",
    avatar: "/professional-female-avatar.png",
    activeTasks: 2,
    lastActivity: "5 minutes ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    status: "Break",
    avatar: "/professional-male-avatar-2.png",
    activeTasks: 1,
    lastActivity: "15 minutes ago",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    status: "Working",
    avatar: "/professional-female-avatar-2.png",
    activeTasks: 4,
    lastActivity: "1 minute ago",
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex.chen@company.com",
    status: "Offline",
    avatar: "/professional-avatar-3.png",
    activeTasks: 0,
    lastActivity: "2 hours ago",
  },
]

const initialState: MembersState = {
  members: initialMembers,
  statusFilter: "All",
  sortBy: "name",
}

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    updateMemberStatus: (state, action: PayloadAction<{ memberId: string; status: MemberStatus }>) => {
      const member = state.members.find((m) => m.id === action.payload.memberId)
      if (member) {
        member.status = action.payload.status
        member.lastActivity = "Just now"
      }
    },
    setStatusFilter: (state, action: PayloadAction<MemberStatus | "All">) => {
      state.statusFilter = action.payload
    },
    setSortBy: (state, action: PayloadAction<"name" | "activeTasks" | "status">) => {
      state.sortBy = action.payload
    },
    updateActiveTasks: (state, action: PayloadAction<{ memberId: string; count: number }>) => {
      const member = state.members.find((m) => m.id === action.payload.memberId)
      if (member) {
        member.activeTasks = action.payload.count
      }
    },
  },
})

export const { updateMemberStatus, setStatusFilter, setSortBy, updateActiveTasks } = membersSlice.actions
export default membersSlice.reducer
