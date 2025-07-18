"use client"

import { useQuery } from "@tanstack/react-query"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCardSkeleton } from "./metric-card-skeleton"
import { useDashboard } from "@/context/dashboard-context"
import { useDashboardData } from "./queryData"

export function MonthCountsCard() {
  const { filters } = useDashboard()
  const { data, isLoading } = useDashboardData(filters)


  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Contagens (mês)</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {data?.monthCountsAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tighter">
               {data?.monthCountsAmount.amount}
              </span>
            <p className="text-xs text-muted-foreground">
              {typeof data?.monthCountsAmount?.diffFromLastMonth === "number" && data.monthCountsAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">+{data?.monthCountsAmount?.diffFromLastMonth}%</span> em
                  relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">{data?.monthCountsAmount?.diffFromLastMonth ?? 0}%</span> em relação
                  ao mês passado
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
