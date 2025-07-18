"use client"

import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { Loader2 } from "lucide-react"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import colors from "tailwindcss/colors"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useDashboard } from "@/context/dashboard-context"
import { useDashboardData } from "./queryData"


export function CountsPeriodChart() {
  const { filters } = useDashboard()
  const { data, isLoading } = useDashboardData(filters)


  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Contagens no Período</CardTitle>
          <CardDescription>Contagens diárias no período selecionado</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label>Período</Label>
        </div>
      </CardHeader>
      <CardContent>
        {data?.dailyCountsInPeriod ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data?.dailyCountsInPeriod} style={{ fontSize: 12 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value: number) => value.toString()}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
               <Tooltip
                  formatter={(value: number) => [`${value} animais contados`, ""]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
              <Line
                type="linear"
                strokeWidth={2}
                dataKey="counts"
                stroke={colors.blue[500]}
                dot={{ fill: colors.blue[500], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.blue[500], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
