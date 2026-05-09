"use client"

import { useState, useEffect } from "react"
import { getWatchHistory, removeDownload, type WatchHistory } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageUrl } from "@/lib/tmdb"
import Link from "next/link"
import { Trash2, PlayCircle } from "lucide-react"
import { format } from "date-fns"

export default function HistoryPage() {
  const [history, setHistory] = useState<WatchHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hist = getWatchHistory()
    setHistory(hist)
    setLoading(false)
  }, [])

  const handleRemoveFromHistory = (id: string, type: "movie" | "tv") => {
    setHistory(history.filter((h) => !(h.id === id && h.type === type)))
    // Also remove from storage
    const hist = getWatchHistory()
    const updated = hist.filter((h) => !(h.id === id && h.type === type))
    localStorage.setItem("fountainhome_watch_history", JSON.stringify(updated))
  }

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all watch history?")) {
      setHistory([])
      localStorage.removeItem("fountainhome_watch_history")
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Watch History</h1>
        {history.length > 0 && (
          <Button variant="outline" onClick={handleClearHistory} className="text-destructive">
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-8 text-center">
            <PlayCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No watch history yet</p>
            <Link href="/">
              <Button>Start Watching</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((item, index) => (
            <Card key={`${item.id}-${item.type}-${index}`} className="border-border/50 bg-card/50 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(item.posterPath, "w500")}
                    alt={item.title}
                    className="h-24 w-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "tv" && item.season && item.episode
                        ? `Season ${item.season}, Episode ${item.episode}`
                        : item.type === "tv"
                          ? "TV Show"
                          : "Movie"}
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.progress.toFixed(0)}% watched</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(item.timestamp), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 justify-between">
                    <Link href={`/watch/${item.type}/${item.id}`}>
                      <Button size="sm" variant="default">
                        Continue
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromHistory(item.id, item.type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
