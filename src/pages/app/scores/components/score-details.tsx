"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Printer, Save, Calendar, Weight, Hash, MapPin } from "lucide-react"
import QRCode from "qrcode.react"
import { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useReactToPrint } from "react-to-print"
import { toast } from "sonner"
import { z } from "zod"

import { getScorDetails, type GetScorDetailsResponse } from "@/api/get-scor-details"
import { updateScor } from "@/api/update-scor"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { handleFormatDate } from "@/utils/farmatDate"

import { ScoreDetailsSkeleton } from "./score-details-skeleton"

export interface ScoreDetailsProps {
  scoreId: string
  open: boolean
}

const scoreSchema = z.object({
  nfe: z.string().min(1),
  gta: z.string().min(1),
})
type ScoreSchema = z.infer<typeof scoreSchema>

export function ScoreDetails({ scoreId, open }: ScoreDetailsProps) {
  const queryClient = useQueryClient()
  const [update, setUpdate] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const userLanguage = navigator.language || navigator.languages[0]
  const isPortuguese = userLanguage === "pt-BR"

  const { data: score } = useQuery({
    queryKey: ["score", scoreId, update],
    queryFn: () => getScorDetails({ scorId: scoreId }),
    enabled: open,
  })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  const { mutateAsync: updateScoreFn, isPending: isUpdating } = useMutation({
    mutationFn: updateScor,
    onMutate({ nfe, gta }) {
      const { cached } = updateScoreCache({ nfe, gta })
      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateScoreCache(context.previousProfile)
      }
    },
  })

  function updateScoreCache({ nfe, gta }: ScoreSchema) {
    const cached = queryClient.getQueryData<GetScorDetailsResponse>(["score"])
    if (cached) {
      queryClient.setQueryData(["score"], { ...cached, nfe, gta })
    }
    return { cached }
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm<ScoreSchema>({
    resolver: zodResolver(scoreSchema),
    values: {
      gta: score?.gta ?? "",
      nfe: score?.nfe ?? "",
    },
  })

  async function handleUpdateScore(data: ScoreSchema) {
    try {
      await updateScoreFn({
        gta: data.gta || "",
        nfe: data.nfe || "",
        id: score?.id || "",
      })
      setUpdate("updated")
      toast.success(isPortuguese ? "Contagem atualizada com sucesso!" : "Count updated successfully!")
    } catch {
      toast.error(isPortuguese ? "Falha ao atualizar a contagem" : "Failed to update count")
    }
  }

  const weightTotalMale = useMemo(() => {
    if (!score?.markings) return "0"
    return score.markings
      .filter((a) => a.gender === "male")
      .reduce((a, b) => Number(a) + Number(b.weight), 0)
      .toFixed(2)
  }, [score])

  const weightTotalFemale = useMemo(() => {
    if (!score?.markings) return "0"
    return score.markings
      .filter((a) => a.gender === "female")
      .reduce((a, b) => Number(a) + Number(b.weight), 0)
      .toFixed(2)
  }, [score])

  if (!score) {
    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ScoreDetailsSkeleton />
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          {isPortuguese ? "Contagem" : "Count"}: {scoreId}
        </DialogTitle>
        <DialogDescription>
          {isPortuguese ? "Detalhes completos da contagem" : "Complete count details"}
        </DialogDescription>
      </DialogHeader>

      <div ref={printRef} className="space-y-6">
        <form onSubmit={handleSubmit(handleUpdateScore)}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  {isPortuguese ? "Peso Total" : "Total Weight"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{score.weight} kg</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {isPortuguese ? "Quantidade" : "Quantity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{score.quantity}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {isPortuguese ? "Média" : "Average"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(Number(score.weight) / Number(score.quantity)).toFixed(2)} kg
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {isPortuguese ? "Informações Gerais" : "General Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isPortuguese ? "Início:" : "Start:"}</span>
                    <span className="font-medium">{handleFormatDate(score.start_date)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isPortuguese ? "Fim:" : "End:"}</span>
                    <span className="font-medium">{handleFormatDate(score.end_date)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isPortuguese ? "Lote:" : "Batch:"}</span>
                    <Badge variant="outline">{score.lote}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nfe">NF</Label>
                    {score.nfe === null ? (
                      <Input
                        id="nfe"
                        className="no-print"
                        {...register("nfe")}
                        placeholder={isPortuguese ? "Digite a NF..." : "Enter NF..."}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md font-mono">{score.nfe}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gta">GTA</Label>
                    {score.gta === null ? (
                      <Input
                        id="gta"
                        className="no-print"
                        {...register("gta")}
                        placeholder={isPortuguese ? "Digite a GTA..." : "Enter GTA..."}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md font-mono">{score.gta}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gender Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isPortuguese ? "Machos" : "Males"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isPortuguese ? "Quantidade:" : "Quantity:"}</span>
                    <span className="font-bold">{score.male ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isPortuguese ? "Peso total:" : "Total weight:"}</span>
                    <span className="font-bold">{weightTotalMale} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isPortuguese ? "Fêmeas" : "Females"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{isPortuguese ? "Quantidade:" : "Quantity:"}</span>
                    <span className="font-bold">{score.female ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isPortuguese ? "Peso total:" : "Total weight:"}</span>
                    <span className="font-bold">{weightTotalFemale} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Markings Table */}
          {score.markings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isPortuguese ? "Pesagens" : "Weighings"} ({score.markings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isPortuguese ? "Sequência" : "Sequence"}</TableHead>
                        <TableHead className="text-right">{isPortuguese ? "Qtd. (cb)" : "Qty. (cb)"}</TableHead>
                        <TableHead className="text-right">{isPortuguese ? "Gênero" : "Gender"}</TableHead>
                        <TableHead className="text-right">{isPortuguese ? "Peso (kg)" : "Weight (kg)"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {score.markings.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.sequence}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={item.gender === "male" ? "default" : "secondary"}>
                              {item.gender === "male"
                                ? isPortuguese
                                  ? "Macho"
                                  : "Male"
                                : isPortuguese
                                  ? "Fêmea"
                                  : "Female"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{item.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} className="font-bold">
                          {isPortuguese ? "Total de animais pesados" : "Total weighed animals"}
                        </TableCell>
                        <TableCell className="text-right font-bold">{score.quantity}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code for print */}
          {score.files?.[0]?.file_url && (
            <div className="qr-code-print mt-6 flex flex-col items-center">
              <p className="mb-3 font-medium">
                {isPortuguese ? "Acesse o vídeo da contagem" : "Access the count video"}
              </p>
              <QRCode value={score.files[0].file_url} size={128} />
            </div>
          )}

          <DialogFooter className="no-print">
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {isPortuguese ? "Imprimir" : "Print"}
            </Button>

            {(score.nfe === null || score.gta === null) && (
              <Button type="submit" disabled={isSubmitted || isUpdating}>
                <Save className="mr-2 h-4 w-4" />
                {isUpdating ? (isPortuguese ? "Salvando..." : "Saving...") : isPortuguese ? "Salvar" : "Save"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  )
}

// Print styles
const printStyles = `
@media print {
  .qr-code-print {
    display: flex !important;
    align-items: center !important;
    flex-direction: column !important;
  }
  .no-print {
    display: none !important;
  }
  body {
    font-size: 12px !important;
    color: black !important;
  }
}
@media screen {
  .qr-code-print {
    display: none !important;
  }
}
`

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = printStyles
  document.head.appendChild(styleSheet)
}
