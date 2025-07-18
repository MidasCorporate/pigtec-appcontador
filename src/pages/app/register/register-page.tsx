"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Helmet } from "react-helmet-async"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, PiggyBank, Video } from "lucide-react"

import { FarmCard } from "@/components/farms/farm-card"
import { FarmModal } from "@/components/farms/farm-modal"
import { EquipmentModal } from "@/components/equipment/equipment-modal"
import { SearchInput } from "@/components/search-input"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EquipmentCard } from "@/components/equipment/equipment-card"
import { listFarms } from "@/api/farm/list"
import { listConfig } from "@/api/config/list"
import { EditFarmModal } from "./farms/modal-edit-farm"
import { EditConfigModal } from "../../../components/equipment/modal-edit-config"

export function Register() {
  const [activeTab, setActiveTab] = useState("farms")
  const [farmModalOpen, setFarmModalOpen] = useState(false)
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [editFarmModalOpen, setEditFarmModalOpen] = useState(false)
  const [editingFarm, setEditingFarm] = useState<any>(null)

  const [editEquipmentModalOpen, setEditEquipmentModalOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<any>(null)

  // Simulated data fetching
  const {
    data: farms,
    isLoading: farmsLoading,
    refetch: refetchFarms,
  } = useQuery({
    queryKey: ["farmsRegister"],
    queryFn: async () => await listFarms(),
  })

  const {
    data: equipment,
    isLoading: equipmentLoading,
    refetch: refetchEquipment,
  } = useQuery({
    queryKey: ["equipment"],
    queryFn: listConfig,
  })
  console.log('farmswwww', farms)
  const filteredFarms = farms?.filter(
    (farm) =>
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredEquipment = equipment?.filter(
    (eq) =>
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <Helmet title="Cadastro de Granjas e Equipamentos" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento</h1>
              <p className="text-muted-foreground">Gerencie suas granjas e equipamentos de contagem</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="farms" className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Granjas
                  {farms && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                      {farms.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Equipamentos
                  {equipment && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {equipment.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <SearchInput
                  placeholder={activeTab === "farms" ? "Buscar granjas..." : "Buscar equipamentos..."}
                  value={searchTerm}
                  onChange={setSearchTerm}
                />

                <Dialog
                  open={activeTab === "farms" ? farmModalOpen : equipmentModalOpen}
                  onOpenChange={activeTab === "farms" ? setFarmModalOpen : setEquipmentModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 whitespace-nowrap">
                      <Plus className="h-4 w-4" />
                      {activeTab === "farms" ? "Nova Granja" : "Novo Equipamento"}
                    </Button>
                  </DialogTrigger>

                  {activeTab === "farms" ? (
                    <FarmModal refetch={refetchFarms} />
                  ) : (
                    <EquipmentModal refetch={refetchEquipment} />
                  )}
                </Dialog>

                {/* Modal de edição de granja */}
                {editingFarm && (
                  <Dialog open={editFarmModalOpen} onOpenChange={setEditFarmModalOpen}>
                    <EditFarmModal
                      farm={editingFarm}
                      refetch={refetchFarms}
                      onClose={() => {
                        setEditFarmModalOpen(false)
                        setEditingFarm(null)
                      }}
                    />
                  </Dialog>
                )}
                {editingEquipment && (
                  <Dialog open={editEquipmentModalOpen} onOpenChange={setEditEquipmentModalOpen}>
                    <EditConfigModal
                      equipment={editingEquipment}
                      refetch={refetchEquipment}
                      onClose={() => {
                        setEditEquipmentModalOpen(false)
                        setEditingEquipment(null)
                      }}
                    />
                  </Dialog>
                )}
              </div>
            </div>

            <TabsContent value="farms" className="space-y-4">
              {farmsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredFarms && filteredFarms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFarms.map((farm) => (
                    <FarmCard
                      key={farm.id}
                      id={farm.id}
                      name={farm.name}
                      nickname={farm.nickname}
                      equipmentName={farm.config?.name}
                      producerName={farm.producer?.name}
                      status={farm.status}
                      // lastActivity={farm.lastActivity}
                      onEdit={(id) => {
                        const farm = farms?.find((f) => f.id === id)
                        if (farm) {
                          setEditingFarm({
                            id: farm.id,
                            name: farm.name,
                            nickname: farm.nickname,
                            config_id: farm.config?.id || "",
                            producer_id: farm.producer?.id || "",
                          })
                          setEditFarmModalOpen(true)
                        }
                      }}
                      onDelete={(id) => console.log("Delete farm:", id)}
                      onView={(id) => console.log("View farm:", id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={PiggyBank}
                  title="Nenhuma granja encontrada"
                  description={searchTerm ? "Tente ajustar os filtros de busca" : "Comece criando sua primeira granja"}
                  action={
                    !searchTerm
                      ? {
                          label: "Criar Granja",
                          onClick: () => setFarmModalOpen(true),
                        }
                      : undefined
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              {equipmentLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredEquipment && filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEquipment.map((eq) => (
                    <EquipmentCard
                      key={eq.id}
                      id={eq.id}
                      name={eq.name}
                      description={eq.description}
                      type={eq.type}
                      status={eq.status}
                      connectedFarms={eq.connectedFarms}
                      lastSync={eq.lastSync}
                      // onEdit={(id) => console.log("Edit equipment:", id)}
                      onEdit={(id) => {
                        const equipt = equipment?.find((f) => f.id === id)
                        if (equipt) {
                              setEditingEquipment({
                              id: equipt.id,
                              rout: equipt.rout,
                              cfg: equipt.cfg,
                              name: equipt.name,
                              names: equipt.names,
                              weights: equipt.weights,
                              rout_view_video: equipt.rout_view_video,
                              mount_video: equipt.mount_video,
                              range_for_marking: equipt.range_for_marking,
                              marking_automatic: equipt.marking_automatic,
                              is_selected_view_video: equipt.is_selected_view_video,
                              name_network_contactor: equipt.name_network_contactor,
                              pass_word_contactor_network: equipt.pass_word_contactor_network,
                              description: equipt.description,
                              threshold: equipt.threshold,
                              access_remote_id: equipt.access_remote_id,
                              access_remote_password: equipt.access_remote_password,
                              stream: equipt.stream,
                              })
                          setEditEquipmentModalOpen(true)
                        }
                      }}
                      onDelete={(id) => console.log("Delete equipment:", id)}
                      onView={(id) => console.log("View equipment:", id)}
                      // onTerminal={(id) => console.log("Terminal equipment:", id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Video}
                  title="Nenhum equipamento encontrado"
                  description={
                    searchTerm ? "Tente ajustar os filtros de busca" : "Comece adicionando seu primeiro equipamento"
                  }
                  action={
                    !searchTerm
                      ? {
                          label: "Adicionar Equipamento",
                          onClick: () => setEquipmentModalOpen(true),
                        }
                      : undefined
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
