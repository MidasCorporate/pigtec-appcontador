"use client"

import { useState } from "react"
import { Plus, Search, Filter, Users, Shield, Edit, Settings, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CardRules } from "./card-rules"
import { CardPermissions } from "./card-permissions"
import { RuleModal } from "./modal-rule"
import { PermissionModal } from "./modal-permission"
import { EditFarmRoleLinksModal } from "./modal-edit-farm-role-links"
import { useQuery } from "@tanstack/react-query"
import { LinkRuleFarmModal } from "./modal-link-rule-farm"
import { LinkRulePermissionModal } from "./modal-link-rule-permission"
import { listRole } from "@/api/role/list"
import { listPermission } from "@/api/permission/list"
import { useEditFarmRoleModal } from "@/hooks/use-edit-farm-role-modal"
import { toast } from "sonner"
import { LinkRuleUserModal } from "./modal-link-rule-user"

export function RulesPermissions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("rules")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [lastEditedRole, setLastEditedRole] = useState<string | null>(null)

  const { modalState, openModal, closeModal } = useEditFarmRoleModal()

  // Data fetching
  const { data: rules, refetch: refetchRules } = useQuery({
    queryKey: ["rules"],
    queryFn: listRole,
  })

  const { data: permissions, refetch: refetchPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: listPermission,
  })

  const filteredRules = rules?.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPermissions = permissions?.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBulkDelete = () => {
    console.log("Deleting items:", selectedItems)
    setSelectedItems([])
  }

  // Main trigger function for editing farm-role links
  const handleEditLinks = (roleId: string, roleName: string, preSelectedFarmIds?: string[]) => {
    // Visual feedback
    toast.info(`Carregando editor para: ${roleName}`)

    // Track the role being edited for visual feedback
    setLastEditedRole(roleId)

    // Open the modal with required parameters
    openModal(roleId, roleName, preSelectedFarmIds)
  }

  // Handle successful edit completion
  const handleEditComplete = () => {
    const editedRoleName = modalState.roleName

    // Refetch data to reflect changes
    refetchRules()

    // Close modal
    closeModal()

    // Clear editing state
    setLastEditedRole(null)

    // Success feedback
    toast.success(`Links atualizados para: ${editedRoleName}`, {
      description: "As alterações foram salvas com sucesso",
      duration: 4000,
    })
  }

  // Quick access function for bulk operations
  const handleBulkEditLinks = () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos uma função para editar")
      return
    }

    if (selectedItems.length === 1) {
      const rule = rules?.find((r) => r.id === selectedItems[0])
      if (rule) {
        handleEditLinks(rule.id, rule.name)
      }
    } else {
      toast.info("Edição em lote será implementada em breve")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Success notification for recent edits */}
      {lastEditedRole && !modalState.isOpen && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Links da função foram atualizados com sucesso. As alterações já estão ativas.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules & Permissions</h1>
          <p className="text-muted-foreground">Gerencie regras de acesso e permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          {/* Bulk edit button */}
          {selectedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkEditLinks}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Links ({selectedItems.length})
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Vincular com farm app
              </Button>
            </DialogTrigger>
            <LinkRuleFarmModal refetchRules={refetchRules} />
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Vincular com usuário web
              </Button>
            </DialogTrigger>
            <LinkRuleUserModal refetchRules={refetchRules} />
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Vincular Permissão
              </Button>
            </DialogTrigger>
            <LinkRulePermissionModal refetchPermissions={refetchPermissions} refetchRules={refetchRules} />
          </Dialog>

          {/* Quick access to edit any role's links */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Links
              </Button>
            </DialogTrigger>
            <DialogContent>
            <div className="max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Selecionar Função</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Escolha uma função para editar seus links com granjas
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {rules?.map((rule) => (
                  <Button
                    key={rule.id}
                    variant="ghost"
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => handleEditLinks(rule.id, rule.name)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-xs text-muted-foreground">{rule.identification}</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {/* Show farm count if available */}0 farms
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar rules ou permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        {selectedItems.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Excluir ({selectedItems.length})
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rules
              <Badge variant="secondary">{rules?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Permissions
              <Badge variant="secondary">{permissions?.length || 0}</Badge>
            </TabsTrigger>
          </TabsList>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === "rules" ? "Nova Rule" : "Nova Permission"}
              </Button>
            </DialogTrigger>
            {activeTab === "rules" ? (
              <RuleModal refetch={refetchRules} />
            ) : (
              <PermissionModal refetch={refetchPermissions} />
            )}
          </Dialog>
        </div>

        <TabsContent value="rules" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRules?.map((rule) => (
              <CardRules
                key={rule.id}
                rule={rule}
                isSelected={selectedItems.includes(rule.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedItems([...selectedItems, rule.id])
                  } else {
                    setSelectedItems(selectedItems.filter((id) => id !== rule.id))
                  }
                }}
                refetch={refetchRules}
                onEditLinks={handleEditLinks}
                isEditingLinks={modalState.isOpen && modalState.roleId === rule.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPermissions?.map((permission) => (
              <CardPermissions
                key={permission.id}
                permission={permission}
                isSelected={selectedItems.includes(permission.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedItems([...selectedItems, permission.id])
                  } else {
                    setSelectedItems(selectedItems.filter((id) => id !== permission.id))
                  }
                }}
                refetch={refetchPermissions}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Farm Role Links Modal */}
      {modalState.isOpen && modalState.roleId && modalState.roleName && (
        <Dialog open={modalState.isOpen} onOpenChange={(open) => !open && closeModal()}>
          <EditFarmRoleLinksModal
            roleId={modalState.roleId}
            roleName={modalState.roleName}
            refetchRoles={refetchRules}
            onClose={handleEditComplete}
            preSelectedFarmIds={modalState.preSelectedFarmIds}
          />
        </Dialog>
      )}
    </div>
  )
}
