"use client"

import { useState, useEffect } from "react"
import { getDownloads, removeDownload, type Download } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl } from "@/lib/tmdb"
import Link from "next/link"
import { Trash2, Download as DownloadIcon, CheckCircle2, Clock } from "lucide-react"

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dl = getDownloads()
    setDownloads(dl.sort((a, b) => b.timestamp - a.timestamp))
    setLoading(false)
  }, [])

  const handleRemoveDownload = (id: string) => {
    removeDownload(id)
    setDownloads(downloads.filter((d) => d.id !== id))
  }

  const completedDownloads = downloads.filter((d) => d.completed)
  const inProgressDownloads = downloads.filter((d) => !d.completed)

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
      <h1 className="text-4xl font-bold mb-8">Downloads</h1>

      {downloads.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-8 text-center">
            <DownloadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No downloads yet</p>
            <Link href="/">
              <Button>Find Content to Download</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {inProgressDownloads.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6" />
                In Progress
              </h2>
              <div className="grid gap-4">
                {inProgressDownloads.map((download) => (
                  <DownloadCard
                    key={download.id}
                    download={download}
                    onRemove={handleRemoveDownload}
                  />
                ))}
              </div>
            </div>
          )}

          {completedDownloads.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" />
                Downloaded
              </h2>
              <div className="grid gap-4">
                {completedDownloads.map((download) => (
                  <DownloadCard
                    key={download.id}
                    download={download}
                    onRemove={handleRemoveDownload}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DownloadCard({
  download,
  onRemove,
}: {
  download: Download
  onRemove: (id: string) => void
}) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={getImageUrl(download.posterPath, "w500")}
            alt={download.title}
            className="h-24 w-16 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{download.title}</h3>
            <p className="text-sm text-muted-foreground">{download.quality}</p>
            <div className="mt-2">
              <div className="w-full bg-muted/50 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${download.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {download.completed
                  ? "Downloaded"
                  : `${download.progress.toFixed(0)}% - ${(download.downloaded / (1024 * 1024)).toFixed(1)} MB`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemove(download.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
