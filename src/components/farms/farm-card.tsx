"use client"

import { PiggyBank, MapPin, Settings, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FarmCardProps {
  id: string
  name: string
  nickname: string
  equipmentName?: string
  producerName?: string
  status?: "active" | "inactive" | "maintenance"
  lastActivity?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function FarmCard({
  id,
  name,
  nickname,
  equipmentName = "Contador pigtec 01",
  producerName,
  status = "active",
  lastActivity = "2 horas atrás",
  onEdit,
  onDelete,
  onView,
}: FarmCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }

  const statusLabels = {
    active: "Ativo",
    inactive: "Inativo",
    maintenance: "Manutenção",
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-emerald-500/50 cursor-pointer">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Apelido: <span className="font-medium">{nickname}</span>
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(id)}>Visualizar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(id)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-red-600">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
          <span className="text-xs text-muted-foreground">{lastActivity}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Equipamento:</span>
            <span className="font-medium">{equipmentName}</span>
          </div>

          {producerName && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Produtor:</span>
              <span className="font-medium">{producerName}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView?.(id)}>
            Visualizar
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onEdit?.(id)}>
            Configurar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
