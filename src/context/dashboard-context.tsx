"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DateRange } from "react-day-picker"
import { format, parseISO, subDays } from "date-fns"
import { listScors } from "@/api/scor/list"

export interface DashboardFilters {
  dateRange: DateRange | undefined
  selectedFarms: string[]
  countType: string
  status: string
}

export interface ChartConfig {
  id: string
  type: "line" | "pie" | "bar" | "metric"
  title: string
  component: string
  size: "small" | "medium" | "large"
  position: number
}

interface DashboardContextType {
  filters: DashboardFilters
  updateFilters: (filters: Partial<DashboardFilters>) => void
  charts: ChartConfig[]
  updateCharts: (charts: ChartConfig[]) => void
  addChart: (chart: Omit<ChartConfig, "id" | "position">) => void
  removeChart: (chartId: string) => void
  exportData: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const defaultCharts: ChartConfig[] = [
  { id: "1", type: "metric", title: "Contagens (mês)", component: "MonthCountsCard", size: "small", position: 0 },
  { id: "2", type: "metric", title: "Contagens (hoje)", component: "DayCountsCard", size: "small", position: 1 },
  { id: "3", type: "metric", title: "Granjas Ativas", component: "ActiveFarmsCard", size: "small", position: 2 },
  { id: "4", type: "metric", title: "Média por granja", component: "AverageCountsCard", size: "small", position: 3 },
  { id: "5", type: "metric", title: "Total de contagens ", component: "TotalCountsCard", size: "small", position: 4 },
  { id: "6", type: "line", title: "Contagens no Período", component: "CountsPeriodChart", size: "large", position: 5 },
  { id: "7", type: "pie", title: "Contagens por Fazenda", component: "CountsByFarmChart", size: "medium", position: 6 },
]

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      from: subDays(new Date(), 30),
      to: new Date(),
    },
    selectedFarms: [],
    countType: "all",
    status: "all",
  })

  const [charts, setCharts] = useState<ChartConfig[]>(defaultCharts)

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const updateCharts = (newCharts: ChartConfig[]) => {
    setCharts(newCharts)
  }

  const addChart = (chart: Omit<ChartConfig, "id" | "position">) => {
    const newChart: ChartConfig = {
      ...chart,
      id: Date.now().toString(),
      position: charts.length,
    }
    setCharts((prev) => [...prev, newChart])
  }

  const removeChart = (chartId: string) => {
    setCharts((prev) => prev.filter((chart) => chart.id !== chartId))
  }

async function exportData() {
  const allOperations = await listScors()

  const filtered = allOperations.filter((op) => {
    const date = parseISO(op.start_date)

    const isInDateRange =
      filters.dateRange &&
      filters.dateRange.from &&
      filters.dateRange.to &&
      date >= filters.dateRange.from &&
      date <= filters.dateRange.to

    const isFarmSelected =
      filters.selectedFarms.length === 0 || filters.selectedFarms.includes(op.farm_id_sender)

    const isStatusValid =
      filters.status === "all" ||
      (filters.status === "finalized" && op.progress === "finalized") ||
      (filters.status === "pending" && op.progress !== "finalized") || (filters.status === "happening" && op.progress !== "happening")

    const isCountTypeValid =
      filters.countType === "all" || op.name?.toLowerCase() === filters.countType.toLowerCase()

    return isInDateRange && isFarmSelected && isStatusValid && isCountTypeValid
  })

  if (filtered.length === 0) {
    alert("Nenhum dado encontrado para exportar.")
    return
  }

 const dataToExport = filtered.map((op) => ({
  granja: op.farmSender?.name || "Desconhecida",
  produtor: op.producerSender?.name || "Desconhecido",
  data: format(parseISO(op.start_date), "yyyy-MM-dd"),
  tipo: op.name,
  lote: op.lote || "-",
  quantidade: parseInt(op.quantity || "0", 10),
  peso_kg: parseFloat(op.weight || "0"),
  status: op.progress === "finalized" ? "Finalizado" : "Pendente",
}))

  const csvContent = [
    Object.keys(dataToExport[0]).join(","), // header
    ...dataToExport.map((row) => Object.values(row).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `contagens_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

  return (
    <DashboardContext.Provider
      value={{
        filters,
        updateFilters,
        charts,
        updateCharts,
        addChart,
        removeChart,
        exportData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
