"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

interface Flag {
  quantity: number
  sequence: number
  score_id: string
  weight: number
  id: string
  created_at: string
  updated_at: string
  gender: string
}

interface FlagsListProps {
  flags: Flag[]
  onFlagPress: (sequence: string) => void
  onFlagDelete: (sequence: number) => void
}

export function FlagsList({ flags, onFlagPress, onFlagDelete }: FlagsListProps) {
  if (flags.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marcações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onFlagPress(flag.sequence.toString())}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline">#{flag.sequence}</Badge>
                <div>
                  <p className="font-medium">Qtd: {flag.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Peso: {flag.weight}kg | {flag.gender === "male" ? "Macho" : "Fêmea"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onFlagDelete(flag.sequence)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
