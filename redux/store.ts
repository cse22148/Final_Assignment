import { configureStore } from "@reduxjs/toolkit"
import membersReducer from "./slices/membersSlice"
import roleReducer from "./slices/roleSlice"
import tasksReducer from "./slices/tasksSlice"

export const store = configureStore({
  reducer: {
    members: membersReducer,
    role: roleReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
