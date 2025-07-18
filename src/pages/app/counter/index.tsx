"use client"

import { useState } from "react"
import { DataForCounting } from "./components/data-for-counting"
import { CountingScreen } from "./components/counting-screen"

export interface CountingData {
  productorid?: string
  productorName?: string
  farmName?: string
  farmId?: string
  lote: string
  name: string
  qtdCounting: string
  balance: "online" | "offline"
  typeContage: "carregamento" | "desmame" | "teste"
  type: "destination_with_count" | "simple_count"
}

export default function HomeCounter() {
  const [currentScreen, setCurrentScreen] = useState<"selection" | "counting">("selection")
  const [countingData, setCountingData] = useState<CountingData | null>(null)

  const handleStartCounting = (data: CountingData) => {
    setCountingData(data)
    setCurrentScreen("counting")
  }

  const handleReturnToSelection = () => {
    setCurrentScreen("selection")
    setCountingData(null)
  }

  return (
      <div className="min-h-screen bg-background">
        {currentScreen === "selection" ? (
          <DataForCounting onStartCounting={handleStartCounting} />
        ) : (
          <CountingScreen data={countingData!} onReturn={handleReturnToSelection} />
        )}
      </div>
  )
}
