"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useDashboard } from "@/context/dashboard-context"

interface AddChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableCharts = [
  { type: "line", title: "Gráfico de Linha", component: "CountsPeriodChart", size: "large" },
  { type: "pie", title: "Gráfico de Pizza", component: "CountsByFarmChart", size: "medium" },
  { type: "bar", title: "Gráfico de Barras", component: "CountsByTypeChart", size: "medium" },
  { type: "metric", title: "Card de Métrica", component: "CustomMetricCard", size: "small" },
]

export function AddChartDialog({ open, onOpenChange }: AddChartDialogProps) {
  const { addChart } = useDashboard()
  const [selectedChart, setSelectedChart] = useState("")
  const [customTitle, setCustomTitle] = useState("")

  const handleAddChart = () => {
    const chartConfig = availableCharts.find((chart) => chart.component === selectedChart)
    if (chartConfig) {
      addChart({
        type: chartConfig.type as any,
        title: customTitle || chartConfig.title,
        component: chartConfig.component,
        size: chartConfig.size as any,
      })
      setSelectedChart("")
      setCustomTitle("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Gráfico</DialogTitle>
          <DialogDescription>Escolha o tipo de gráfico que deseja adicionar ao dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="chart-type">Tipo de Gráfico</Label>
            <Select value={selectedChart} onValueChange={setSelectedChart}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                {availableCharts.map((chart) => (
                  <SelectItem key={chart.component} value={chart.component}>
                    {chart.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="chart-title">Título Personalizado (opcional)</Label>
            <Input
              id="chart-title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Digite um título personalizado"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddChart} disabled={!selectedChart}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Gráfico
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
