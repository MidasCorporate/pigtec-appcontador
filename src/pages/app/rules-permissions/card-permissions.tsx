"use client"

import { useState } from "react"
import { Key, Tag, MoreVertical, Edit, Trash2, Users, Shield, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog } from "@/components/ui/dialog"
import { PermissionModal } from "./modal-permission"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface Permission {
  id: string
  name: string
  description: string
  identification: string
  // module: string
  // users: number
}

interface Props {
  permission: Permission
  isSelected: boolean
  onSelect: (selected: boolean) => void
  refetch: () => void
}

export function CardPermissions({ permission, isSelected, onSelect, refetch }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { mutateAsync: deletePermission } = useMutation({
    mutationFn: async (id: string) => {
      // Mock delete API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      refetch()
      toast.success("Permission excluída com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao excluir permission")
    },
  })

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta permission?")) {
      await deletePermission(permission.id)
    }
  }

  const getModuleColor = (module: string) => {
    const colors = {
      Farms: "bg-green-100 text-green-800",
      Equipment: "bg-blue-100 text-blue-800",
      Reports: "bg-purple-100 text-purple-800",
      Users: "bg-orange-100 text-orange-800",
    }
    return colors[module as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }


  const handleCopyIdentification = async () => {
    try {
      await navigator.clipboard.writeText(permission.identification)
      toast.success("Identificador copiado!")
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = permission.identification
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      toast.success("Identificador copiado!")
    }
  }

  return (
    <Card
      className={`min-w-[250px] hover:border-emerald-500 transition-all rounded-xl cursor-pointer relative group ${
        isSelected ? "border-emerald-500 bg-emerald-50/50" : ""
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "permission", data: permission }))
      }}
    >
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 pt-8">
        <CardTitle className="text-base font-semibold">{permission.name}</CardTitle>
        <Key className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{permission.description}</p>

        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Módulo</span>
          </div>
          <Badge className={`text-xs ${getModuleColor(permission.module)}`}>{permission.module}</Badge>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Usuários</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {/* {permission.users} */}
            0
          </Badge>
        </div>
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Identificador</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs font-mono">
              {permission.identification}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-100"
              onClick={handleCopyIdentification}
              title="Copiar identificador"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <PermissionModal refetch={refetch} editData={permission} />
      </Dialog>
    </Card>
  )
}
