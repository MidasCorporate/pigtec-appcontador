"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Shield, PiggyBank, X, Plus, Minus, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { updateFarmLinks } from "@/api/role/update-farm-links"
import { listFarms } from "@/api/farm/list"
import { UserFarmRole } from "@/types/user-farm-links"
import { Progress } from "@/components/ui/progress"
import { showFarmsOfRoles } from "@/api/role/show_farms_of_roles"

interface Props {
  roleId: string
  roleName: string
  refetchRoles: () => void
  onClose: () => void
  preSelectedFarmIds?: string[]
}

export function EditFarmRoleLinksModal({ roleId, roleName, refetchRoles, onClose, preSelectedFarmIds = [] }: Props) {
  const [searchFarms, setSearchFarms] = useState("")
  const [linkedFarms, setLinkedFarms] = useState<UserFarmRole[]>([])
  const [availableFarms, setAvailableFarms] = useState<any[]>([])
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [pendingChanges, setPendingChanges] = useState<{
    toAdd: string[]
    toRemove: string[]
  }>({ toAdd: [], toRemove: [] })
  const [initializationComplete, setInitializationComplete] = useState(false)

  // Fetch current farm-role links using showFarmsOfRoles function
  const {
    data: currentLinks,
    isLoading: isLoadingLinks,
    error: linksError,
  } = useQuery({
    queryKey: ["farms-of-role", roleId],
    queryFn: async () => {
      try {
        console.log(`Fetching farms for role: ${roleId}`)
        const data = await showFarmsOfRoles({ role_id: roleId })
        console.log(`Successfully fetched ${data.length} farm links for role ${roleId}`)
        toast.success(`Carregados ${data.length} links existentes`)
        return data
      } catch (error: any) {
        console.error("Error fetching farm links:", error)
        toast.error("Erro ao carregar links existentes")
        throw error
      }
    },
    enabled: !!roleId,
    retry: 2,
  })

  // Fetch all available farms
  const { data: allFarms, isLoading: isLoadingFarms } = useQuery({
    queryKey: ["all-farms"],
    queryFn: listFarms,
  })

  // Initialize modal data when both queries complete
  useEffect(() => {
    if (currentLinks && allFarms && !initializationComplete) {
      setLinkedFarms(currentLinks)

      // Handle pre-selected farms if provided
      if (preSelectedFarmIds.length > 0) {
        const validPreSelected = preSelectedFarmIds.filter(
          (id) => allFarms.some((farm) => farm.id === id) && !currentLinks.some((link) => link.farm_id === id),
        )

        if (validPreSelected.length > 0) {
          setPendingChanges((prev) => ({
            ...prev,
            toAdd: validPreSelected,
          }))
          toast.info(`${validPreSelected.length} granjas pré-selecionadas para adição`)
        }
      }

      setInitializationComplete(true)
    }
  }, [currentLinks, allFarms, preSelectedFarmIds, initializationComplete])

  // Update available farms based on current state
  useEffect(() => {
    if (allFarms && currentLinks) {
      const linkedFarmIds = currentLinks
        .map((link) => link.farm_id)
        .filter((id) => !pendingChanges.toRemove.includes(id))

      const available = allFarms.filter(
        (farm) => !linkedFarmIds.includes(farm.id) && !pendingChanges.toAdd.includes(farm.id),
      )
      setAvailableFarms(available)
    }
  }, [allFarms, currentLinks, pendingChanges])

  const { mutateAsync: updateLinks, isPending } = useMutation({
    mutationFn: updateFarmLinks,
    onSuccess: () => {
      refetchRoles()
      setPendingChanges({ toAdd: [], toRemove: [] })
      toast.success("Links atualizados com sucesso!", {
        description: `Alterações aplicadas para ${roleName}`,
      })
      onClose()
    },
    onError: (error) => {
      console.error("Error updating links:", error)
      toast.error("Erro ao atualizar links", {
        description: "Tente novamente ou contate o suporte",
      })
    },
  })

  const filteredAvailableFarms = availableFarms.filter(
    (farm) =>
      farm.name.toLowerCase().includes(searchFarms.toLowerCase()) ||
      farm.nickname.toLowerCase().includes(searchFarms.toLowerCase()),
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

    if (dropZone === "linked" && draggedItem.type === "available") {
      addFarmToRole(draggedItem.id)
      toast.success(`${draggedItem.name} adicionada aos links`)
    } else if (dropZone === "available" && draggedItem.type === "linked") {
      removeFarmFromRole(draggedItem.farm_id || draggedItem.id)
      toast.info(`${draggedItem.farm?.name || draggedItem.name} removida dos links`)
    }

    setDraggedItem(null)
  }

  const addFarmToRole = (farmId: string) => {
    if (pendingChanges.toRemove.includes(farmId)) {
      setPendingChanges((prev) => ({
        ...prev,
        toRemove: prev.toRemove.filter((id) => id !== farmId),
      }))
    } else {
      setPendingChanges((prev) => ({
        ...prev,
        toAdd: [...prev.toAdd, farmId],
      }))
    }
  }

  const removeFarmFromRole = (farmId: string) => {
    const existingLink = linkedFarms.find((link) => link.farm_id === farmId)

    if (existingLink && !pendingChanges.toAdd.includes(farmId)) {
      setPendingChanges((prev) => ({
        ...prev,
        toRemove: [...prev.toRemove, farmId],
      }))
    } else {
      setPendingChanges((prev) => ({
        ...prev,
        toAdd: prev.toAdd.filter((id) => id !== farmId),
      }))
    }
  }

  const handleSaveChanges = async () => {
    if (pendingChanges.toAdd.length === 0 && pendingChanges.toRemove.length === 0) {
      toast.info("Nenhuma alteração para salvar")
      return
    }

    const totalChanges = pendingChanges.toAdd.length + pendingChanges.toRemove.length
    toast.loading(`Aplicando ${totalChanges} alterações...`)

    await updateLinks({
      role_id: roleId,
      add_farm_ids: pendingChanges.toAdd,
      remove_farm_ids: pendingChanges.toRemove,
    })
  }

  const getDisplayedLinkedFarms = () => {
    return linkedFarms.filter((link) => !pendingChanges.toRemove.includes(link.farm_id))
  }

  const getDisplayedPendingFarms = () => {
    if (!allFarms) return []
    return allFarms.filter((farm) => pendingChanges.toAdd.includes(farm.id))
  }

  const hasChanges = pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0
  const isLoading = isLoadingLinks || isLoadingFarms || !initializationComplete

  if (isLoading) {
    return (
      <DialogContent className="max-w-6xl max-h-screen overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
            <div>
              <p className="font-medium">Inicializando Editor</p>
              <p className="text-sm text-muted-foreground">Carregando dados para {roleName}...</p>
            </div>
            <Progress value={33} className="w-48" />
          </div>
        </div>
      </DialogContent>
    )
  }

  if (linksError) {
    return (
      <DialogContent className="max-w-2xl">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Dados</h3>
          <p className="text-muted-foreground mb-4">Não foi possível carregar os links existentes para esta função.</p>
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-6xl max-h-screen overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Editar Links: {roleName}
        </DialogTitle>
        <DialogDescription>
          Gerencie as granjas vinculadas a esta função usando drag-and-drop ou os botões de ação.
          {currentLinks && (
            <span className="block mt-1 text-emerald-600">{currentLinks.length} links existentes carregados</span>
          )}
        </DialogDescription>
      </DialogHeader>

      {/* Progress indicator for pending changes */}
      {hasChanges && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {pendingChanges.toAdd.length + pendingChanges.toRemove.length} alterações pendentes. Clique em "Salvar
            Alterações" para aplicar.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-6 min-h-[600px]">
        {/* Available Farms Column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Granjas Disponíveis
              <Badge variant="outline">{filteredAvailableFarms.length}</Badge>
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar granjas..."
                value={searchFarms}
                onChange={(e) => setSearchFarms(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div
            className="space-y-2 max-h-96 overflow-y-auto border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-32 transition-colors hover:border-emerald-300"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "available")}
          >
            {filteredAvailableFarms.map((farm) => (
              <Card
                key={farm.id}
                className="cursor-pointer transition-all hover:border-emerald-500 hover:shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, farm, "available")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {farm.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                      onClick={() => addFarmToRole(farm.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Apelido:</span> {farm.nickname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Produtor:</span> {farm?.producer?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredAvailableFarms.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <PiggyBank className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma fazenda disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* Changes Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">Resumo das Alterações</h3>

          {hasChanges ? (
            <div className="space-y-4">
              {pendingChanges.toAdd.length > 0 && (
                <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar ({pendingChanges.toAdd.length})
                  </h4>
                  <div className="space-y-1">
                    {getDisplayedPendingFarms().map((farm) => (
                      <div key={farm.id} className="text-xs text-green-700">
                        • {farm.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingChanges.toRemove.length > 0 && (
                <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    Remover ({pendingChanges.toRemove.length})
                  </h4>
                  <div className="space-y-1">
                    {linkedFarms
                      .filter((link) => pendingChanges.toRemove.includes(link.farm_id))
                      .map((link) => (
                        <div key={link.id} className="text-xs text-red-700">
                          • {link.farm.name}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSaveChanges} disabled={isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPendingChanges({ toAdd: [], toRemove: [] })}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Edit className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma alteração pendente</p>
              <p className="text-xs mt-1">Use drag-and-drop ou os botões + para fazer alterações</p>
            </div>
          )}
        </div>

        {/* Linked Farms Column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Granjas Vinculadas
              <Badge variant="secondary">{getDisplayedLinkedFarms().length + pendingChanges.toAdd.length}</Badge>
            </h3>
          </div>

          <div
            className="space-y-2 max-h-96 overflow-y-auto border-2 border-dashed border-emerald-200 rounded-lg p-2 min-h-32 transition-colors hover:border-emerald-300"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "linked")}
          >
            {/* Existing linked farms */}
            {getDisplayedLinkedFarms().map((link) => (
              <Card
                key={link.id}
                className="cursor-pointer transition-all hover:border-red-500 border-emerald-200 hover:shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, link, "linked")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {link.farm.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                      onClick={() => removeFarmFromRole(link.farm_id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Apelido:</span> {link.farm.nickname}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Vinculado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pending additions */}
            {getDisplayedPendingFarms().map((farm) => (
              <Card
                key={`pending-${farm.id}`}
                className="cursor-pointer transition-all hover:border-red-500 border-green-200 bg-green-50 hover:shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, farm, "linked")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {farm.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                      onClick={() => removeFarmFromRole(farm.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Apelido:</span> {farm.nickname}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Pendente
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {getDisplayedLinkedFarms().length === 0 && pendingChanges.toAdd.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <PiggyBank className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma fazenda vinculada</p>
                <p className="text-xs mt-1">Arraste granjas da coluna esquerda para aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
