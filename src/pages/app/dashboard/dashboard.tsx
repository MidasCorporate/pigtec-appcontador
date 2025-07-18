"use client"

import { useState } from "react"
import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardFilters } from "./components/dashboard-filters"
import { DashboardGrid } from "./components/dashboard-grid"
import { AddChartDialog } from "./components/add-chart-dialog"

function DashboardContent() {
  const [addChartOpen, setAddChartOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard BI - Contagens</h1>
      </div>

      <DashboardFilters onAddChart={() => setAddChartOpen(true)} />

      <DashboardGrid />

      <AddChartDialog open={addChartOpen} onOpenChange={setAddChartOpen} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
