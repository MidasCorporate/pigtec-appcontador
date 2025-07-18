"use client"

import { useState } from "react"
import { Shield, Users, PiggyBank, MoreVertical, Edit, Trash2, Copy, Link, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog } from "@/components/ui/dialog"
import { RuleModal } from "./modal-rule"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface Rule {
  id: string
  name: string
  description: string
  identification: string
  farmCount?: number
  userCount?: number
}

interface Props {
  rule: Rule
  isSelected: boolean
  onSelect: (selected: boolean) => void
  refetch: () => void
  onEditLinks: (roleId: string, roleName: string) => void
  isEditingLinks?: boolean
}

export function CardRules({ rule, isSelected, onSelect, refetch, onEditLinks, isEditingLinks = false }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const { mutateAsync: deleteRule } = useMutation({
    mutationFn: async (id: string) => {
      // Mock delete API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      refetch()
      toast.success("Rule excluída com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao excluir rule")
    },
  })

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta rule?")) {
      await deleteRule(rule.id)
    }
  }

  const handleCopyIdentification = async () => {
    try {
      await navigator.clipboard.writeText(rule.identification)
      toast.success("Identificador copiado!")
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = rule.identification
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      toast.success("Identificador copiado!")
    }
  }

  const handleEditLinksClick = () => {
    onEditLinks(rule.id, rule.name)
    toast.info(`Abrindo editor de links para: ${rule.name}`)
  }

  return (
    <Card
      className={`min-w-[250px] transition-all rounded-xl cursor-pointer relative group ${
        isSelected ? "border-emerald-500 bg-emerald-50/50" : ""
      } ${isEditingLinks ? "ring-2 ring-blue-500 ring-opacity-50 border-blue-500" : "hover:border-emerald-500"}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "rule", data: rule }))
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Loading overlay for editing state */}
      {isEditingLinks && (
        <div className="absolute inset-0 bg-blue-50/80 rounded-xl flex items-center justify-center z-20">
          <div className="text-center">
            <Settings className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">Editando Links...</p>
          </div>
        </div>
      )}

      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className={`transition-opacity ${isHovering ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Quick action button for edit links */}
      <div className="absolute top-3 right-12 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 transition-all duration-200 ${
            isHovering ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } hover:bg-blue-100 hover:text-blue-700`}
          onClick={handleEditLinksClick}
          title="Editar Links com Granjas"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 transition-opacity ${isHovering ? "opacity-100" : "opacity-0"}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Função
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditLinksClick} className="text-blue-600">
              <Link className="h-4 w-4 mr-2" />
              Gerenciar Links
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 pt-8">
        <CardTitle className="text-base font-semibold">{rule.name}</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{rule.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <PiggyBank className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Farms</span>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs transition-colors ${
              rule.farmCount && rule.farmCount > 0 ? "bg-emerald-100 text-emerald-800" : ""
            }`}
          >
            {rule.farmCount || 0}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Usuários</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {rule.userCount || 0}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Identificador</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs font-mono">
              {rule.identification}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 transition-opacity hover:bg-emerald-100 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              onClick={handleCopyIdentification}
              title="Copiar identificador"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <RuleModal refetch={refetch} editData={rule} />
      </Dialog>
    </Card>
  )
}
