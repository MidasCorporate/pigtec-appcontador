"use client"

import { Video, Wifi, Activity, MoreVertical, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TerminalModal } from "./terminal-modal"
import { EquipmentDetailsModal } from "./equipment-details-modal"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { showConfig } from "@/api/config/show"

interface EquipmentCardProps {
  id: string
  name: string
  description: string
  type?: string
  status?: "online" | "offline" | "maintenance"
  connectedFarms?: number
  lastSync?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function EquipmentCard({
  id,
  name,
  description,
  type = "Contador de Animais",
  status = "online",
  connectedFarms = 0,
  lastSync = "Agora mesmo",
  onEdit,
  onDelete,
  onView,
}: EquipmentCardProps) {
  const statusConfig = {
    online: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      label: "Online",
    },
    offline: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
      label: "Offline",
    },
    maintenance: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
      label: "Manutenção",
    },
  }

  const StatusIcon = statusConfig[status].icon
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data: equipmentDetails } = useQuery({
    queryKey: ["equipmentDetails", id],
    queryFn: async () => {
      const data = await showConfig({ config_id: id })
        
        return {
          ...data,
          version: "v2.1.3",
          serialNumber: "PTC-2024-001",
          lastSync: '2 horas atrás',
          connectedFarms: 1,
          status: "online" as "online" | "offline" | "maintenance",
          type: "Contador de Animais",
    
      }
    },
    enabled: !!id, // Only fetch if id is provided
  })
  console.log("Equipment Details:", equipmentDetails)
  // Mock detailed equipment data
  // const equipmentDetails = {
  //   id,
  //   name,
  //   description,
  //   type,
  //   status,
  //   connectedFarms,
  //   lastSync,
  //   rout: "http://192.168.1.105:8080/api",
  //   cfg: "/home/jet/pig.cfg",
  //   names: "/home/jet/pig.names",
  //   weights: "/home/jet/pig.weights",
  //   threshold: "0.75",
  //   access_remote_id: "123456789",
  //   access_remote_password: "SecurePass123!",
  //   rout_view_video: "/home/jet/video",
  //   mount_video: "/home/jet/video",
  //   range_for_marking: "35",
  //   marking_automatic: "yes",
  //   is_selected_view_video: "yes",
  //   name_network_contactor: "FarmWiFi_2024",
  //   pass_word_contactor_network: "WiFiPass456!",
  //   stream: true,
  //   createdAt: "2024-01-10T10:30:00Z",
  //   updatedAt: "2024-01-15T14:20:00Z",
  //   version: "v2.1.3",
  //   serialNumber: "PTC-2024-001",
  // }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 cursor-pointer">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{type}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDetailsOpen(true)}>Visualizar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(id)}>Configurar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-red-600">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <Badge className={statusConfig[status].color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[status].label}
          </Badge>
          <span className="text-xs text-muted-foreground">{lastSync}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Granjas:</span>
            <span className="font-medium">{connectedFarms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize">{status}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                Detalhes
              </Button>
            </DialogTrigger>

              {equipmentDetails && (
                <EquipmentDetailsModal
                  equipment={equipmentDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTerminal={() => setTerminalOpen(true)}
                />
              )}
          </Dialog>

          {status === "online" ? (
            <Dialog open={terminalOpen} onOpenChange={setTerminalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  Terminal
                </Button>
              </DialogTrigger>
              <TerminalModal equipmentName={name} equipmentId={id} />
            </Dialog>
          ) : (
            <Button size="sm" className="flex-1" onClick={() => onEdit?.(id)} disabled={status === "offline"}>
              Configurar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
