import { DashboardFilters } from "@/context/dashboard-context"
import { useQuery } from "@tanstack/react-query"
import { differenceInDays, isWithinInterval, parseISO } from "date-fns"
import { listFarms } from "./list"
import { listScors, Scor } from "../scor/list"
import { api } from "@/services/api"

// Add or import the OperationDetails type
type OperationDetails = {
  start_date: string
  farm_id_internal: string
  progress: string
  farmInternal?: {
    name?: string
    status?: string
  }
  // Add other properties as needed
}

export async function fetchAndPrepareDashboardData(filters: DashboardFilters) {
  // const res = await fetch("https://node.pigtek.com.br/scores")
  // const allOperations: OperationDetails[] = await res.json()
  const allOperations = await listScors()
  const filtered = (allOperations ?? []).filter((op) => {
  const date = parseISO(op.start_date)

  const isInDateRange =
    filters.dateRange !== undefined &&
    filters.dateRange.from !== undefined &&
    filters.dateRange.to !== undefined &&
    isWithinInterval(date, {
      start: filters.dateRange.from,
      end: filters.dateRange.to,
    })

  const isFarmSelected =
    filters.selectedFarms.length === 0 ||
    filters.selectedFarms.includes(op.farm_id_sender)

  const isStatusValid =
    filters.status === "all" ||
    (filters.status === "finalized" && op.progress === "finalized") ||
    (filters.status === "pending" && op.progress !== "finalized") || (filters.status === "happening" && op.progress !== "happening")

  const isCountTypeValid =
    filters.countType === "all" || op.name === filters.countType

  return isInDateRange && isFarmSelected && isStatusValid && isCountTypeValid
})
  // === 1. Métrica: Total de contagens no mês ===
  const monthCountsAmount: MetricCard = {
    amount: filtered.length,
    diffFromLastMonth: 0, // (implementar se tiver dados anteriores)
  }

  // === 2. Métrica: Total de contagens no dia atual ===
  const today = new Date()
  const dayCountsAmount: MetricCard = {
    amount: filtered.filter((op) => {
      const date = parseISO(op.start_date)
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }).length,
    diffFromLastMonth: 0, // (ex: diferença do dia anterior)
  }

  // === 3. Média de contagens por fazenda (com base no quantity) ===
  const farmsQuantityMap = new Map<string, number>()
  
  for (const op of filtered) {

    const farmName = op.farmSender?.name || "Desconhecida"
    const quantity = parseInt(op.quantity || "0", 10)
    farmsQuantityMap.set(farmName, (farmsQuantityMap.get(farmName) || 0) + quantity)
  }

  const totalQuantity = Array.from(farmsQuantityMap.values()).reduce((sum, val) => sum + val, 0)
  const farmCount = farmsQuantityMap.size
  const averageCountsPerFarm: MetricCard = {
    amount: farmCount === 0 ? 0 : totalQuantity / farmCount,
    diffFromLastMonth: 0,
  }

  // === 4. Contagem por fazenda (baseado em quantity) ===
  const countsByFarm: FarmCount[] = Array.from(farmsQuantityMap).map(([farm, amount]) => ({
    farm,
    amount,
  }))
 // === 5. Contagens diárias (somando o quantity de cada operação) ===
const dailyMap = new Map<string, number>()

filtered.forEach((op) => {
  const date = parseISO(op.start_date)
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })

  const quantity = parseInt(op.quantity || "0", 10)
  dailyMap.set(formatted, (dailyMap.get(formatted) || 0) + quantity)
})

const dailyCountsInPeriod: DailyCount[] = Array.from(dailyMap.entries()).map(([date, counts]) => ({
  date,
  counts,
}))
  // === 6. Total de fazendas ativas ===
  const activeFarms = new Set<string>()
  filtered.forEach((op) => {
    if (op.farmSender?.status === "active") {
      activeFarms.add(op.farm_id_sender)
    }
  })

  const activeFarmsAmount: MetricCard = {
    amount: activeFarms.size,
    diffFromLastMonth: 0,
  }

  // === 7 Total de animais contados no período ===
const totalCountedInPeriod: MetricCard = {
  amount: filtered.reduce((sum, op) => sum + parseInt(op.quantity || "0", 10), 0),
  diffFromLastMonth: 0,
}

  return {
    monthCountsAmount,
    dayCountsAmount,
    countsByFarm,
    dailyCountsInPeriod,
    averageCountsPerFarm,
    activeFarmsAmount,
    totalCountedInPeriod
  }
}
