"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Video, Eye } from "lucide-react"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"

import { OrderStatus } from "@/components/order-status"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import { ScoreDetails } from "./score-details"
import { ScoreVideo } from "./score-video"

interface Score {
  id: string
  start_date: string
  weight: string
  quantity: string
  lote: string
  name: string
  type: string
  progress: "not_found" | "canceled" | "finalized" | "happening"
  status: boolean
  created_at: string
  farmSender: { id: string; name: string }
  farmReceived: { id: string; name: string }
  farmInternal: { id: string; name: string }
  files: { id: string; file_url: string; type: string }[]
}

interface ScoresTableProps {
  scores: Score[]
  selectedScores: string[]
  onSelectionChange: (scores: string[]) => void
}

export function ScoresTable({ scores, selectedScores, onSelectionChange }: ScoresTableProps) {
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null)
  const [videoOpen, setVideoOpen] = useState<string | null>(null)

  const userLanguage = navigator.language || navigator.languages[0]
  const isPortuguese = userLanguage === "pt-BR"

  const handleSelectScore = (scoreId: string) => {
    const isSelected = selectedScores.includes(scoreId)

    if (isSelected) {
      onSelectionChange(selectedScores.filter((id) => id !== scoreId))
    } else {
      if (selectedScores.length >= 2) {
        toast.error(
          isPortuguese ? "Máximo de 2 contagens podem ser selecionadas" : "Maximum of 2 counts can be selected",
        )
        return
      }
      onSelectionChange([...selectedScores, scoreId])
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">{isPortuguese ? "Sel." : "Sel."}</TableHead>
            <TableHead className="w-20">{isPortuguese ? "Ações" : "Actions"}</TableHead>
            <TableHead className="min-w-[140px]">{isPortuguese ? "Identificador" : "Identifier"}</TableHead>
            <TableHead className="w-[100px]">{isPortuguese ? "Lote" : "Batch"}</TableHead>
            <TableHead className="w-[120px]">{isPortuguese ? "Status" : "Status"}</TableHead>
            <TableHead className="w-[140px]">{isPortuguese ? "Iniciado há" : "Started"}</TableHead>
            <TableHead>{isPortuguese ? "Tipo" : "Type"}</TableHead>
            <TableHead className="w-[120px] text-right">{isPortuguese ? "Quantidade" : "Quantity"}</TableHead>
            <TableHead className="w-[100px]">{isPortuguese ? "Vídeo" : "Video"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={score.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedScores.includes(score.id)}
                  onCheckedChange={() => handleSelectScore(score.id)}
                />
              </TableCell>

              <TableCell>
                <Dialog open={detailsOpen === score.id} onOpenChange={(open) => setDetailsOpen(open ? score.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <ScoreDetails scoreId={score.id} open={detailsOpen === score.id} />
                </Dialog>
              </TableCell>

              <TableCell className="font-mono text-sm">
                <div className="max-w-[140px] truncate" title={score.id}>
                  {score.id}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {score.lote}
                </Badge>
              </TableCell>

              <TableCell>
                <OrderStatus status={score.progress} />
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(score.created_at), {
                  locale: isPortuguese ? ptBR : undefined,
                  addSuffix: true,
                })}
              </TableCell>

              <TableCell className="max-w-[200px] truncate" title={score.name}>
                {score.name}
              </TableCell>

              <TableCell className="text-right font-medium">{score.quantity}</TableCell>

              <TableCell>
                {score.files.length > 0 && (
                  <Dialog open={videoOpen === score.id} onOpenChange={(open) => setVideoOpen(open ? score.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <ScoreVideo scoreId={score.id} open={videoOpen === score.id} />
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
