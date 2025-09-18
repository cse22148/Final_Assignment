import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface RoleState {
  currentRole: "lead" | "member"
  currentUser: string
}

const initialState: RoleState = {
  currentRole: "member",
  currentUser: "John Doe",
}

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<"lead" | "member">) => {
      state.currentRole = action.payload
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload
    },
  },
})

export const { switchRole, setUser } = roleSlice.actions
export default roleSlice.reducer
