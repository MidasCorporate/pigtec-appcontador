"use client"

import { useQuery } from "@tanstack/react-query"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCardSkeleton } from "./metric-card-skeleton"
import { useDashboard } from "@/context/dashboard-context"
import { useDashboardData } from "./queryData"

export function DayCountsCard() {
  const { filters } = useDashboard()
  const { data, isLoading } = useDashboardData(filters)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Contagens (hoje)</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {data?.dayCountsAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tighter">{data?.dayCountsAmount.amount.toLocaleString("pt-BR")}</span>
            <p className="text-xs text-muted-foreground">
              {data?.dayCountsAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">+{data?.dayCountsAmount.diffFromLastMonth}%</span> em
                  relação a ontem
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">{data?.dayCountsAmount.diffFromLastMonth}%</span> em relação a
                  ontem
                </>
              )}
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
