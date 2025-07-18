"use client"

import { Card, CardContent } from "@/components/ui/card"

interface CounterDisplayProps {
  value: number | string
  variant: "current" | "difference" | "total" | "weight"
  onPress?: () => void
}

export function CounterDisplay({ value, variant, onPress }: CounterDisplayProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "current":
        return "text-6xl md:text-8xl text-blue-600"
      case "difference":
        return "text-6xl md:text-8xl text-orange-600"
      case "total":
        return "text-6xl md:text-8xl text-green-600"
      case "weight":
        return "text-4xl md:text-6xl text-purple-600"
      default:
        return "text-6xl md:text-8xl text-primary"
    }
  }

  const getLabel = () => {
    switch (variant) {
      case "current":
        return "Atual"
      case "difference":
        return "Diferença"
      case "total":
        return "Total"
      case "weight":
        return "Peso (kg)"
      default:
        return ""
    }
  }

  return (
    <Card className={onPress ? "cursor-pointer hover:bg-accent" : ""} onClick={onPress}>
      <CardContent className="pt-6 text-center">
        <div className={`font-mono font-bold ${getVariantStyles()}`}>{value}</div>
        <p className="text-sm text-muted-foreground mt-2">{getLabel()}</p>
      </CardContent>
    </Card>
  )
}
