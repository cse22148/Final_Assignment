"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
   
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="w-9 h-9 p-0">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  )
}
