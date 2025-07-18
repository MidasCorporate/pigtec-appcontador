"use client"

import { useQuery } from "@tanstack/react-query"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCardSkeleton } from "./metric-card-skeleton"
import { useDashboard } from "@/context/dashboard-context"
import { useDashboardData } from "./queryData"


export function ActiveFarmsCard() {
  const { filters } = useDashboard()
  const { data, isLoading } = useDashboardData(filters)


  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Granjas com contagens</CardTitle>
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {data?.activeFarmsAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tighter">{data?.activeFarmsAmount.amount.toLocaleString("pt-BR")}</span>
            <p className="text-xs text-muted-foreground">
              {typeof data?.activeFarmsAmount?.diffFromLastMonth === "number" && data.activeFarmsAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">+{ data?.activeFarmsAmount?.diffFromLastMonth }%</span> em
                  relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">{data?.activeFarmsAmount?.diffFromLastMonth  ?? 0}%</span> em relação
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
