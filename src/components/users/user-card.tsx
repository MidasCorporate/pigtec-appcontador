"use client"

import { User, Mail, Shield, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserCardProps {
  id: string
  name: string
  email: string
  cpf?: string | null
  internal_code?: string
  status?: "active" | "inactive" | "blocked"
  created_at?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function UserCard({
  id,
  name,
  email,
  cpf,
  internal_code,
  status = "active",
  created_at,
  onEdit,
  onDelete,
  onView,
}: UserCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    blocked: "bg-red-100 text-red-800 border-red-200",
  }

  const statusLabels = {
    active: "Ativo",
    inactive: "Inativo",
    blocked: "Bloqueado",
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 cursor-pointer">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium">{email}</span>
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
          <span className="text-xs text-muted-foreground">
            {created_at ? new Date(created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium truncate">{email}</span>
          </div>

          {cpf && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">CPF:</span>
              <span className="font-medium">{cpf}</span>
            </div>
          )}

          {internal_code && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Código:</span>
              <span className="font-medium">{internal_code}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView?.(id)}>
            Visualizar
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onEdit?.(id)}>
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
