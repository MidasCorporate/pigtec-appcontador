"use client"

import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import {
  Video,
  Copy,
  CheckCircle,
  AlertCircle,
  Settings,
  Wifi,
  Camera,
  Shield,
  Zap,
  Edit,
  Trash2,
  Terminal,
  Eye,
  EyeOff,
  Wallpaper,
  Computer,
} from "lucide-react"

interface EquipmentDetailsModalProps {
  equipment: {
    id: string
    name: string
    description: string
    type: string
    status: "online" | "offline" | "maintenance"
    connectedFarms: number
    lastSync: string
    // Configuration details
    rout: string
    cfg: string
    names: string
    weights: string
    threshold: string
    access_remote_id: string
    access_remote_password: string
    rout_view_video?: string
    mount_video?: string
    range_for_marking?: string
    marking_automatic?: string
    is_selected_view_video?: string
    name_network_contactor?: string
    pass_word_contactor_network?: string
    stream?: boolean
    view_camera?: boolean
    is_selected_auto_cnt?: boolean
    // Additional info
    created_at: string
    updated_at: string
    version: string
    serialNumber: string

  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onTerminal?: (id: string) => void
}

export function EquipmentDetailsModal({ equipment, onEdit, onDelete, onTerminal }: EquipmentDetailsModalProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  const statusConfig = {
    online: {
      color: "border-green-200",
      icon: CheckCircle,
      label: "Online",
    },
    offline: {
      color: "border-red-200",
      icon: AlertCircle,
      label: "Offline",
    },
    maintenance: {
      color: "border-yellow-200",
      icon: AlertCircle,
      label: "Manutenção",
    },
  }

  const StatusIcon = statusConfig[equipment.status].icon

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copiado para a área de transferência`)
    } catch (error) {
      toast.error("Erro ao copiar para a área de transferência")
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const InfoField = ({
    label,
    value,
    isPassword = false,
    fieldKey,
  }: {
    label: string
    value: string
    isPassword?: boolean
    fieldKey?: string
  }) => {
    const displayValue = isPassword && fieldKey && !showPasswords[fieldKey] ? "••••••••" : value

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-sm text-gray-900 font-mono break-all">{displayValue || "Não configurado"}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isPassword && fieldKey && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePasswordVisibility(fieldKey)}
              className="h-8 w-8 p-0"
            >
              {showPasswords[fieldKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(value, label)}
            className="h-8 w-8 p-0"
            disabled={!value}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{equipment.name}</DialogTitle>
              <p className="text-muted-foreground">{equipment.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusConfig[equipment.status].color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[equipment.status].label}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit?.(equipment.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          {equipment.status === "online" && (
            <Button variant="outline" size="sm" onClick={() => onTerminal?.(equipment.id)}>
              <Terminal className="h-4 w-4 mr-2" />
              Terminal
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete?.(equipment.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* System Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Status Operacional</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{statusConfig[equipment.status].label}</p>
              <p className="text-sm text-blue-700">Última verificação: {equipment.lastSync}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Conexões Ativas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{equipment.connectedFarms}</p>
              <p className="text-sm text-green-700">Granjas conectadas</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Transmissão</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{equipment.stream ? "ON" : "OFF"}</p>
              <p className="text-sm text-purple-700">Stream de vídeo</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações Gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="ID do Equipamento" value={equipment.id} />
            <InfoField label="Número de Série" value={equipment.serialNumber} />
            <InfoField label="Versão do Firmware" value={equipment.version} />
            <InfoField label="Granjas Conectadas" value={equipment.connectedFarms.toString()} />
            <InfoField label="Última Sincronização" value={equipment.lastSync} />
            <InfoField label="Data de Criação" value={new Date(equipment.created_at).toLocaleString()} />
          </div>
          {equipment.description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Descrição</p>
              <p className="text-sm text-gray-900">{equipment.description}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Detailed Configuration */}
        <Accordion type="multiple" defaultValue={[""]} className="w-full">
          <AccordionItem value="communication">
            <AccordionTrigger className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Configurações de Comunicação
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField label="URL de Comunicação" value={equipment.rout} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="image-analysis">
            <AccordionTrigger className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Análise de Imagens
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField label="Arquivo .cfg" value={equipment.cfg} />
              <InfoField label="Arquivo .names" value={equipment.names} />
              <InfoField label="Arquivo .weights" value={equipment.weights} />
              <InfoField label="Nível de Acurácia (Threshold)" value={equipment.threshold} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="output">
            <AccordionTrigger className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Configurações de Saída
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField
                label="Salvar video no equipamento"
                value={equipment.is_selected_view_video === "yes" ? "Habilitado" : "Desabilitado"}
              />
              <InfoField label="Caminho do Vídeo de Análise" value={equipment.rout_view_video || ""} />
              <InfoField label="Caminho de Montagem do Vídeo" value={equipment.mount_video || ""} />

               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Transmissão Ativa</p>
                  <p className="text-sm text-gray-900">{equipment.stream ? "Habilitada" : "Desabilitada"}</p>
                </div>
                <Badge variant={equipment.stream ? "default" : "secondary"}>
                  {equipment.stream ? "Ativo" : "Inativo"}
                </Badge>
              </div>

                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Visualizar a câmera do contador no app</p>
                  <p className="text-sm text-gray-900">{equipment.view_camera ? "Habilitada" : "Desabilitada"}</p>
                </div>
                <Badge variant={equipment.view_camera ? "default" : "secondary"}>
                  {equipment.view_camera ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="marking">
            <AccordionTrigger>
              <Wallpaper className="h-4 w-4" />

              Configurações de Marcação</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField
                label="Marcação Automática"
                value={equipment.marking_automatic === "yes" ? "Habilitada" : "Desabilitada"}
              />
              <InfoField label="Range de Marcação" value={equipment.range_for_marking || ""} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="network">
            <AccordionTrigger>
              <Computer className="h-4 w-4" />
              Conexão Wi-Fi IoT</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField label="Nome da Rede Wi-Fi" value={equipment.name_network_contactor || ""} />
              <InfoField
                label="Senha da Rede Wi-Fi"
                value={equipment.pass_word_contactor_network || ""}
                isPassword={true}
                fieldKey="wifi_password"
              />
            </AccordionContent>
          </AccordionItem>


          <AccordionItem value="host">
            <AccordionTrigger>
              <Computer className="h-4 w-4" />
              Host do contador</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField label="Nome host Wi-Fi" value={equipment.name_network_contactor || ""} />
              <InfoField
                label="Senha do host Wi-Fi"
                value={equipment.pass_word_contactor_network || ""}
                isPassword={true}
                fieldKey="wifi_password"
              />
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Autoconexão com o contador</p>
                  <p className="text-sm text-gray-900">{equipment.is_selected_auto_cnt ? "Habilitada" : "Desabilitada"}</p>
                </div>
                <Badge variant={equipment.is_selected_auto_cnt ? "default" : "secondary"}>
                  {equipment.is_selected_auto_cnt ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="remote-access">
            <AccordionTrigger className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Acesso Remoto
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <InfoField label="ID de Acesso Remoto" value={equipment.access_remote_id} />
              <InfoField
                label="Senha de Acesso Remoto"
                value={equipment.access_remote_password}
                isPassword={true}
                fieldKey="remote_password"
              />
             
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />



        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button onClick={() => copyToClipboard(equipment.id, "ID do Equipamento")} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copiar ID
          </Button>
          <Button
            onClick={() => copyToClipboard(equipment.access_remote_id, "ID de Acesso Remoto")}
            variant="outline"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar ID Remoto
          </Button>
          <Button onClick={() => copyToClipboard(equipment.rout, "URL de Comunicação")} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copiar URL
          </Button>
          <Button
            onClick={() =>
              copyToClipboard(
                `ID: ${equipment.access_remote_id}\nSenha: ${equipment.access_remote_password}`,
                "Credenciais de Acesso Remoto",
              )
            }
            variant="outline"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Credenciais
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
