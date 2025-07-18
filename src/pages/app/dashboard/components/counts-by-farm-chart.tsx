"use client"

import { useQuery } from "@tanstack/react-query"
import { BarChart as BarChartIcon, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import colors from "tailwindcss/colors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"
import { useDashboardData } from "./queryData"

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
  colors.indigo[500],
  colors.orange[500],
  colors.teal[500],
]

export function CountsByFarmChart() {
  const { filters } = useDashboard()
  const { data, isLoading } = useDashboardData(filters)

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Animais contados por granja</CardTitle>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {data?.countsByFarm ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data.countsByFarm}
              margin={{ top: 12, right: 12, left: 0, bottom: 40 }}
              style={{ fontSize: 12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="farm"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => value.toString()}
              />
              <Tooltip
                formatter={(value: number) => [`${value} animais`, "Total"]}
                labelFormatter={(label) => `Granja: ${label}`}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {data.countsByFarm.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="amount"
                  position="top"
                  style={{ fill: "#4B5563", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
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
