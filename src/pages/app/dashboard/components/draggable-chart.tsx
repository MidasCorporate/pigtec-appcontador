"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"
import type { ChartConfig } from "@/context/dashboard-context"

// Import all chart components
import { MonthCountsCard } from "./month-counts-card"
import { DayCountsCard } from "./day-counts-card"
import { ActiveFarmsCard } from "./active-farms-card"
import { AverageCountsCard } from "./average-counts-card"
import { CountsByFarmChart } from "./counts-by-farm-chart"
import { CountsPeriodChart } from "./counts-period-chart"
import { TotalCountsCard } from "./total-counts-card"

const chartComponents = {
  MonthCountsCard,
  DayCountsCard,
  ActiveFarmsCard,
  AverageCountsCard,
  TotalCountsCard,
  CountsByFarmChart,
  CountsPeriodChart,
}

interface DraggableChartProps {
  chart: ChartConfig
}

export function DraggableChart({ chart }: DraggableChartProps) {
  const { removeChart } = useDashboard()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chart.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const ChartComponent = chartComponents[chart.component as keyof typeof chartComponents]

  const getGridClass = () => {
    switch (chart.size) {
      case "small":
        return "col-span-1"
      case "medium":
        return "col-span-1 lg:col-span-3"
      case "large":
        return "col-span-1 lg:col-span-6"
      default:
        return "col-span-1"
    }
  }

  if (!ChartComponent) {
    return (
      <Card className={`p-4 ${getGridClass()}`}>
        <div className="text-center text-muted-foreground">Componente não encontrado: {chart.component}</div>
      </Card>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${getGridClass()}`} {...attributes}>
      {/* Drag Handle and Remove Button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm" {...listeners}>
          <GripVertical className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => removeChart(chart.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <ChartComponent />
    </div>
  )
}
