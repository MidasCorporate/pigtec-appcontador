"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Link, Shield, PiggyBank, ArrowRight, X } from "lucide-react"
import { toast } from "sonner"
import { createLinkRoleInFarms } from "@/api/role/link_role_in_farms"
import { listRole } from "@/api/role/list"
import { listFarms } from "@/api/farm/list"

interface Props {
  refetchRules: () => void
}

export function LinkRuleFarmModal({ refetchRules }: Props) {
  const [searchRules, setSearchRules] = useState("")
  const [searchFarms, setSearchFarms] = useState("")
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [selectedFarms, setSelectedFarms] = useState<string[]>([])
  const [draggedItem, setDraggedItem] = useState<any>(null)

  const { data: rules } = useQuery({
    queryKey: ["rules"],
    queryFn: listRole,
  })

  const { data: farms } = useQuery({
    queryKey: ["farms-for-linking"],
    queryFn: listFarms
  })

  console.log("Farms fetched:", farms)
  // const { data: farms } = useQuery({
  //   queryKey: ["farms-for-linking"],
  //   queryFn: async () => [
  //     { id: "1", name: "Fazenda São João", nickname: "SJ001", producer: "João Silva" },
  //     { id: "2", name: "Granja Santa Maria", nickname: "SM002", producer: "Maria Santos" },
  //     { id: "3", name: "Fazenda Boa Vista", nickname: "BV003", producer: "Pedro Costa" },
  //     { id: "4", name: "Granja do Vale", nickname: "GV004", producer: "Ana Oliveira" },
  //     { id: "5", name: "Fazenda Esperança", nickname: "FE005", producer: "Carlos Lima" },
  //   ],
  // })

  const { mutateAsync: linkRuleFarms } = useMutation({
    mutationFn: async (data: { ruleId: string; farmIds: string[] }) => {
      const dataFormated = {
        role_id: data.ruleId,
        farms_ids: data.farmIds,
      }
      await createLinkRoleInFarms(dataFormated)
      return data
    },
    onSuccess: () => {
      refetchRules()
      setSelectedRule(null)
      setSelectedFarms([])
      toast.success("Vinculação realizada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao vincular rule com farms")
    },
  })

  const filteredRules = rules?.filter((rule) => rule.name.toLowerCase().includes(searchRules.toLowerCase()))

  const filteredFarms = farms?.filter(
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

    if (dropZone === "rule" && draggedItem.type === "rule") {
      setSelectedRule(draggedItem)
    } else if (dropZone === "farms" && draggedItem.type === "farm") {
      if (!selectedFarms.includes(draggedItem.id)) {
        setSelectedFarms([...selectedFarms, draggedItem.id])
      }
    }

    setDraggedItem(null)
  }

  const removeFarm = (farmId: string) => {
    setSelectedFarms(selectedFarms.filter((id) => id !== farmId))
  }

  const handleLink = async () => {
    if (!selectedRule || selectedFarms.length === 0) {
      toast.error("Selecione uma rule e pelo menos uma farm")
      return
    }

    await linkRuleFarms({
      ruleId: selectedRule.id,
      farmIds: selectedFarms,
    })
  }

  return (
    <DialogContent className="max-w-6xl max-h-screen overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
           Vincular Funções a Permissões
        </DialogTitle>
        <DialogDescription>Arraste e solte para vincular rules com farms ou use os botões de seleção</DialogDescription>
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
                    {/* {rule.farms} farms vinculadas */}
                    0 farms vinculadas
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
              <Card className="w-full border-emerald-500">
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

          {/* Selected Farms Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-48 transition-colors hover:border-emerald-500"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "farms")}
          >
            {selectedFarms.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Farms Selecionadas:</p>
                {selectedFarms.map((farmId) => {
                  const farm = farms?.find((f) => f.id === farmId)
                  return farm ? (
                    <div
                      key={farmId}
                      className="flex items-center justify-between border border-emerald-200 rounded-md p-2"
                    >
                      <div className="flex items-center gap-2">
                        <PiggyBank className="h-3 w-3 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">{farm.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {farm.nickname} - {farm?.producer?.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFarm(farmId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                <div>
                  <PiggyBank className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Arraste farms aqui</p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleLink} className="w-full" disabled={!selectedRule || selectedFarms.length === 0}>
            Vincular Rule com Farms
          </Button>
        </div>

        {/* Farms Column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Farms Disponíveis
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar farms..."
                value={searchFarms}
                onChange={(e) => setSearchFarms(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFarms?.map((farm) => (
              <Card
                key={farm.id}
                className={`cursor-pointer transition-all hover:border-emerald-500 ${
                  selectedFarms.includes(farm.id) ? "border-emerald-500" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, farm, "farm")}
                onClick={() => {
                  if (!selectedFarms.includes(farm.id)) {
                    setSelectedFarms([...selectedFarms, farm.id])
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{farm.name}</CardTitle>
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
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
