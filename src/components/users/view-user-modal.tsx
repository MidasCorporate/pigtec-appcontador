"use client"

import { useQuery } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Settings, Calendar, Eye } from "lucide-react"
import { LoadingSpinner } from "../ui/loading-spinner"
import { listConfig } from "@/api/config/list"

interface ViewUserModalProps {
  user: {
    id: string
    name: string
    email: string
    cpf?: string | null
    internal_code: string
    config_id?: string | null
    created_at?: string
    updated_at?: string
  }
}

export function ViewUserModal({ user }: ViewUserModalProps) {
  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: listConfig
  })

  const userConfig = configs?.find(config => config.id === user.config_id)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível"
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Detalhes do Usuário</DialogTitle>
            <DialogDescription>Visualize as informações completas do usuário</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Nome Completo
              </div>
              <p className="text-base font-medium">{user.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="text-base">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                CPF
              </div>
              <p className="text-base">{user.cpf || "Não informado"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                Código Interno
              </div>
              <p className="text-base font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                {user.internal_code}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Configuração */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Configuração</h3>
          
          {configsLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">Carregando configuração...</span>
            </div>
          ) : userConfig ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{userConfig.name}</span>
              </div>
              {userConfig.description && (
                <p className="text-sm text-muted-foreground ml-6">
                  {userConfig.description}
                </p>
              )}
              <div className="ml-6">
                <Badge variant="outline" className="text-xs">
                  ID: {userConfig.id}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma configuração associada</p>
          )}
        </div>

        <Separator />

        {/* Informações do Sistema */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Informações do Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data de Criação
              </div>
              <p className="text-sm">{formatDate(user.created_at)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Última Atualização
              </div>
              <p className="text-sm">{formatDate(user.updated_at)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                ID do Usuário
              </div>
              <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {user.id}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Badge className="h-4 w-4" />
                Status
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Ativo
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}