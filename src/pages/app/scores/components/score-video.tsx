"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ReactPlayer from "react-player"
import { AlertCircle, Play } from "lucide-react"

import { getScorDetails } from "@/api/get-scor-details"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

import { ScoreDetailsSkeleton } from "./score-details-skeleton"

export interface ScoreVideoProps {
  scoreId: string
  open: boolean
}

export function ScoreVideo({ scoreId, open }: ScoreVideoProps) {
  const [error, setError] = useState(false)

  const userLanguage = navigator.language || navigator.languages[0]
  const isPortuguese = userLanguage === "pt-BR"

  const { data: score, isLoading } = useQuery({
    queryKey: ["score", scoreId],
    queryFn: () => getScorDetails({ scorId: scoreId }),
    enabled: open,
  })

  if (isLoading) {
    return (
      <DialogContent className="max-w-2xl">
        <ScoreDetailsSkeleton />
      </DialogContent>
    )
  }

  if (!score) {
    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isPortuguese ? "Erro" : "Error"}</DialogTitle>
          <DialogDescription>
            {isPortuguese ? "Não foi possível carregar os dados" : "Could not load data"}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          {isPortuguese ? "Vídeo da Contagem" : "Count Video"}: {scoreId}
        </DialogTitle>
        <DialogDescription>
          {isPortuguese ? "Visualização do vídeo da contagem" : "Count video visualization"}
        </DialogDescription>
      </DialogHeader>

      <Card>
        <CardContent className="p-6">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isPortuguese
                  ? "Não foi possível reproduzir o vídeo. Verifique sua conexão ou tente novamente."
                  : "Could not play the video. Check your connection or try again."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex justify-center">
              {score.files.map((file) => (
                <div key={file.id}>
                  {file.type === "video" && score.progress !== "happening" && (
                    <ReactPlayer
                      url={file.file_url}
                      controls
                      playing
                      width="100%"
                      height="400px"
                      onError={() => setError(true)}
                    />
                  )}

                  {file.type === "stream" && score.progress === "happening" && (
                    <ReactPlayer
                      url={file.file_url}
                      controls
                      playing
                      width="100%"
                      height="400px"
                      onError={() => setError(true)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DialogContent>
  )
}
