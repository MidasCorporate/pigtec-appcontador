"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Link, Shield, Key, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { listRole } from "@/api/role/list"
import { listPermission } from "@/api/permission/list"
import { createLinkPermissionInRole } from "@/api/role/link_permission_in_role"

interface Props {
  refetchRules: () => void
  refetchPermissions: () => void
}

export function LinkRulePermissionModal({ refetchRules, refetchPermissions }: Props) {
  const [searchRules, setSearchRules] = useState("")
  const [searchPermissions, setSearchPermissions] = useState("")
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [draggedItem, setDraggedItem] = useState<any>(null)

  // Mock data
  const { data: rules } = useQuery({
    queryKey: ["rules"],
    queryFn: listRole,
  })

  const { data: permissions } = useQuery({
    queryKey: ["permissions-for-linking"],
    queryFn: listPermission,
  })

  const { mutateAsync: linkRulePermissions } = useMutation({
    mutationFn: async (data: { ruleId: string; permissionIds: string[] }) => {
      const dataFormated = {
        role_id: data.ruleId,
        permissions_ids: data.permissionIds,
      };

      await createLinkPermissionInRole(dataFormated)

      return data
    },
    onSuccess: () => {
      refetchRules()
      refetchPermissions()
      setSelectedRule(null)
      setSelectedPermissions([])
      toast.success("Vinculação realizada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao vincular rule e permissions")
    },
  })

  const filteredRules = rules?.filter((rule) => rule.name.toLowerCase().includes(searchRules.toLowerCase()))

  const filteredPermissions = permissions?.filter((permission) =>
    permission.name.toLowerCase().includes(searchPermissions.toLowerCase()),
  )

  const handleDragStart = (e: React.DragEvent, item: any, type: string) => {
    setDraggedItem({ ...item, type })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropZone: string) => {
    e.preventDefault()

    if (!draggedItem) return

    if (dropZone === "rule" && draggedItem.type === "rule") {
      setSelectedRule(draggedItem)
    } else if (dropZone === "permissions" && draggedItem.type === "permission") {
      if (!selectedPermissions.includes(draggedItem.id)) {
        setSelectedPermissions([...selectedPermissions, draggedItem.id])
      }
    }

    setDraggedItem(null)
  }

  const removePermission = (permissionId: string) => {
    setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
  }

  const handleLink = async () => {
    if (!selectedRule || selectedPermissions.length === 0) {
      toast.error("Selecione uma rule e pelo menos uma permission")
      return
    }

    await linkRulePermissions({
      ruleId: selectedRule.id,
      permissionIds: selectedPermissions,
    })
  }

  return (
    <DialogContent className="max-w-6xl max-h-screen overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Vincular Funções a Permissões
        </DialogTitle>
        <DialogDescription>
          Arraste e solte para vincular rules com permissions ou use os botões de seleção
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-3 gap-6 min-h-[600px]">
        {/* Rules Column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rules Disponíveis
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar rules..."
                value={searchRules}
                onChange={(e) => setSearchRules(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredRules?.map((rule) => (
              <Card
                key={rule.id}
                className={`cursor-pointer transition-all hover:border-emerald-500 ${
                  selectedRule?.id === rule.id ? "border-emerald-500" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, rule, "rule")}
                onClick={() => setSelectedRule(rule)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{rule.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                     {rule.identification}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Linking Area */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">Área de Vinculação</h3>

          {/* Selected Rule Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-32 flex items-center justify-center transition-colors hover:border-emerald-500"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "rule")}
          >
            {selectedRule ? (
              <Card className="w-full border-emerald-500 ">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {selectedRule.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{selectedRule.description}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Arraste uma rule aqui</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Selected Permissions Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-48 transition-colors hover:border-emerald-500"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "permissions")}
          >
            {selectedPermissions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Permissions Selecionadas:</p>
                {selectedPermissions.map((permissionId) => {
                  const permission = permissions?.find((p) => p.id === permissionId)
                  return permission ? (
                    <Badge
                      key={permissionId}
                      variant="secondary"
                      className="flex items-center justify-between w-full p-2"
                    >
                      <span className="flex items-center gap-2">
                        <Key className="h-3 w-3" />
                        {permission.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removePermission(permissionId)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                <div>
                  <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Arraste permissions aqui</p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleLink} className="w-full" disabled={!selectedRule || selectedPermissions.length === 0}>
            Vincular Função a permissão
          </Button>
        </div>

        {/* Permissions Column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Permissions Disponíveis
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar permissions..."
                value={searchPermissions}
                onChange={(e) => setSearchPermissions(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPermissions?.map((permission) => (
              <Card
                key={permission.id}
                className={`cursor-pointer transition-all hover:border-emerald-500 ${
                  selectedPermissions.includes(permission.id) ? "border-emerald-500" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, permission, "permission")}
                onClick={() => {
                  if (!selectedPermissions.includes(permission.id)) {
                    setSelectedPermissions([...selectedPermissions, permission.id])
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{permission.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {permission.identification}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
