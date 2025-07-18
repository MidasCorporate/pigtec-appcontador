"use client"

import { Download, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useDashboard } from "@/context/dashboard-context"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { listFarms } from "@/api/farm/list"


interface DashboardFiltersProps {
  onAddChart: () => void
}

export function DashboardFilters({ onAddChart }: DashboardFiltersProps) {
  const { filters, updateFilters, exportData } = useDashboard()
  const [farmsOpen, setFarmsOpen] = useState(false)

  const { data: availableFarms} = useQuery({
   queryKey: ['farms'],
   queryFn: async () => {
    const farm = listFarms()
    return (await farm).map((fm) => {
      return {
        value: fm.id,
        label: fm.name
      }
    })
   } 
  })

  const handleFarmToggle = (farm: string) => {
    const newSelectedFarms = filters.selectedFarms.includes(farm)
      ? filters.selectedFarms.filter((f) => f !== farm)
      : [...filters.selectedFarms, farm]

    updateFilters({ selectedFarms: newSelectedFarms })
  }

  const clearFarmFilters = () => {
    updateFilters({ selectedFarms: [] })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Período */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Período:</Label>
            <DatePickerWithRange
              date={filters.dateRange}
              onDateChange={(dateRange) => updateFilters({ dateRange })}
              className="w-auto"
            />
          </div>

          {/* Fazendas */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Granjas:</Label>
            <Popover open={farmsOpen} onOpenChange={setFarmsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {filters.selectedFarms.length === 0
                      ? "Todas as granjas"
                      : `${filters.selectedFarms.length} selecionada(s)`}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Selecionar Granjas</h4>
                    {filters.selectedFarms.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFarmFilters}>
                        Limpar
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {availableFarms?.map((farm) => (
                      <div key={farm.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={farm.value}
                          checked={filters.selectedFarms.includes(farm.value)}
                          onCheckedChange={() => handleFarmToggle(farm.value)}
                        />
                        <Label htmlFor={farm.label} className="text-sm">
                          {farm.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Tipo de Contagem */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Tipo:</Label>
            <Select value={filters.countType} onValueChange={(value) => updateFilters({ countType: value })}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Embarque 7kg">Embarque 7kg</SelectItem>
                <SelectItem value="Embarque 23kg">Embarque 23kg</SelectItem>
                <SelectItem value="Embarque terminação">Embarque terminação</SelectItem>
                <SelectItem value="Saida de maternidade">Saida de maternidade</SelectItem>
                <SelectItem value="Transferência interna">Transferência interna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Status:</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="finalized">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="happening">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 ml-auto">
            <Button onClick={onAddChart} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Gráfico
            </Button>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Filtros Ativos */}
        {(filters.selectedFarms.length > 0 || filters.countType !== "all" || filters.status !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <Label className="text-sm font-medium">Filtros ativos:</Label>
            {filters.selectedFarms.map((farm) => (
              <Badge key={farm} variant="secondary" className="text-xs">
                {farm}
                <button
                  onClick={() => handleFarmToggle(farm)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.countType !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Tipo: {filters.countType}
                <button
                  onClick={() => updateFilters({ countType: "all" })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Status: {filters.status}
                <button
                  onClick={() => updateFilters({ status: "all" })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
