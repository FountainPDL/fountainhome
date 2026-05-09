"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, CheckCircle2 } from "lucide-react"

interface AppUpdate {
  version: string
  releaseDate: string
  features: string[]
  bugFixes: string[]
  improvements: string[]
  mandatory: boolean
}

const CURRENT_VERSION = "1.0.0"

const updates: AppUpdate[] = [
  {
    version: "1.2.0",
    releaseDate: "2024-01-20",
    mandatory: false,
    features: [
      "Offline mode with cached content",
      "Download management system",
      "Watch history tracking",
      "Content recommendations",
    ],
    bugFixes: ["Fixed video player crashes", "Resolved subtitle sync issues"],
    improvements: [
      "Improved app performance",
      "Better mobile optimization",
      "Enhanced caching system",
    ],
  },
  {
    version: "1.1.5",
    releaseDate: "2024-01-10",
    mandatory: false,
    features: ["Dark mode support", "Multi-language subtitles"],
    bugFixes: ["Fixed memory leaks", "Improved stability"],
    improvements: ["Better UI/UX", "Faster loading times"],
  },
  {
    version: "1.1.0",
    releaseDate: "2023-12-25",
    mandatory: true,
    features: ["Search functionality", "Content filtering"],
    bugFixes: ["Critical security patch"],
    improvements: ["Overall performance boost"],
  },
  {
    version: "1.0.0",
    releaseDate: "2023-12-01",
    mandatory: false,
    features: ["Initial release", "Video streaming", "Content browsing"],
    bugFixes: [],
    improvements: [],
  },
]

export default function UpdatesPage() {
  const [installedVersion, setInstalledVersion] = useState(CURRENT_VERSION)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("fountainhome_app_version")
    if (saved) {
      setInstalledVersion(saved)
    }
  }, [])

  const handleCheckUpdates = async () => {
    setCheckingUpdates(true)
    // Simulate checking for updates
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCheckingUpdates(false)
  }

  const handleInstallUpdate = (version: string) => {
    // Simulate update installation
    localStorage.setItem("fountainhome_app_version", version)
    setInstalledVersion(version)
  }

  const latestVersion = updates[0].version
  const hasUpdate = latestVersion !== installedVersion

  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Updates</h1>

      {/* Update Status Card */}
      <Card className="border-border/50 bg-card/50 mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Version</p>
              <p className="text-3xl font-bold">{installedVersion}</p>
              {!hasUpdate && (
                <div className="flex items-center gap-2 mt-4 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">You&apos;re up to date</span>
                </div>
              )}
              {hasUpdate && (
                <div className="flex items-center gap-2 mt-4 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Update available: {latestVersion}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCheckUpdates}
                disabled={checkingUpdates}
                variant="default"
              >
                {checkingUpdates ? "Checking..." : "Check for Updates"}
              </Button>
              <Button variant="outline" onClick={() => setAutoUpdate(!autoUpdate)}>
                {autoUpdate ? "Auto-update: ON" : "Auto-update: OFF"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Update History</h2>
        {updates.map((update) => {
          const isInstalled = installedVersion === update.version
          const isLatest = latestVersion === update.version

          return (
            <Card key={update.version} className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{update.version}</CardTitle>
                      {isInstalled && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Installed
                        </Badge>
                      )}
                      {isLatest && !isInstalled && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Latest
                        </Badge>
                      )}
                      {update.mandatory && (
                        <Badge variant="destructive">Mandatory</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{update.releaseDate}</p>
                  </div>
                  {!isInstalled && (
                    <Button
                      size="sm"
                      onClick={() => handleInstallUpdate(update.version)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Install
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {update.features.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Features</p>
                    <ul className="list-disc list-inside space-y-1">
                      {update.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {update.bugFixes.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Bug Fixes</p>
                    <ul className="list-disc list-inside space-y-1">
                      {update.bugFixes.map((fix, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {fix}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {update.improvements.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Improvements</p>
                    <ul className="list-disc list-inside space-y-1">
                      {update.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
