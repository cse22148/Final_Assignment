"use client"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { setStatusFilter, setSortBy } from "../redux/slices/membersSlice"
import type { MemberStatus } from "../redux/slices/membersSlice"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Filter, ArrowUpDown } from "lucide-react"

export function TeamFilters() {
  const dispatch = useAppDispatch()
  const { statusFilter, sortBy } = useAppSelector((state) => state.members)

  const statusOptions: (MemberStatus | "All")[] = ["All", "Working", "Meeting", "Break", "Offline"]
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "activeTasks", label: "Active Tasks" },
    { value: "status", label: "Status" },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="status-filter" className="text-sm font-medium">
              Filter by Status:
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => dispatch(setStatusFilter(value as MemberStatus | "All"))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="sort-by" className="text-sm font-medium">
              Sort by:
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value) => dispatch(setSortBy(value as "name" | "activeTasks" | "status"))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
