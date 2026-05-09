"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(
          (registration) => {
            console.log("[v0] Service Worker registered:", registration)
            
            // Check for updates periodically
            setInterval(() => {
              registration.update()
            }, 60000) // Check every minute
          },
          (error) => {
            console.log("[v0] Service Worker registration failed:", error)
          }
        )
      })

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[v0] Service Worker updated")
        // Show notification that app was updated
        if (Notification.permission === "granted") {
          new Notification("FountainHome Updated", {
            body: "App has been updated to the latest version",
            icon: "/fountain-icon.jpg",
          })
        }
      })
    }
  }, [])

  return null
}
