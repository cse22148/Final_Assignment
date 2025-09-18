"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { updateMemberStatus } from "../redux/slices/membersSlice"

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes in milliseconds

export function useAutoReset() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.role.currentUser)
  const members = useAppSelector((state) => state.members.members)

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout

    const resetToOffline = () => {
      const currentMember = members.find((member) => member.name === currentUser)
      if (currentMember && currentMember.status !== "Offline") {
        dispatch(
          updateMemberStatus({
            memberId: currentMember.id,
            status: "Offline",
          }),
        )
      }
    }

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(resetToOffline, INACTIVITY_TIMEOUT)
    }

    // Events that indicate user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true)
    })

    // Start the timer
    resetTimer()

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [dispatch, currentUser, members])
}
