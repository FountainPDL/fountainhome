"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"
import { updateOfflineStatus } from "@/lib/storage"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      updateOfflineStatus(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      updateOfflineStatus(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!mounted) return null

  if (isOnline) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-700 dark:text-green-400 text-xs z-40">
        <Wifi className="h-4 w-4" />
        <span>Online</span>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs z-40">
      <AlertCircle className="h-4 w-4" />
      <span>Offline mode - Limited functionality</span>
    </div>
  )
}
