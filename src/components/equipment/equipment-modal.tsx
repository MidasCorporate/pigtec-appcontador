"use client"

import { useMutation } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Video, Settings, Wifi, Camera, Shield, Zap, Wallpaper, Computer } from "lucide-react"
import { LoadingSpinner } from "../ui/loading-spinner"
import { createConfig } from "@/api/config/create"

const equipmentSchema = z.object({
  rout: z.string().min(4, { message: "URL de comunicação é obrigatória" }),
  cfg: z.string().min(4, { message: "Arquivo .cfg é obrigatório" }),
  name: z.string().min(4, { message: "Nome deve ter pelo menos 4 caracteres" }),
  names: z.string().min(4, { message: "Arquivo .names é obrigatório" }),
  weights: z.string().min(4, { message: "Arquivo .weights é obrigatório" }),
  rout_view_video: z.string(),
  mount_video: z.string(),
  range_for_marking: z.string(),
  marking_automatic: z.string(),
  is_selected_view_video: z.string(),
  name_network_contactor: z.string(),
  pass_word_contactor_network: z.string(),
  description: z.string(),
  threshold: z.string().min(1, { message: "Nível de acurácia é obrigatório" }),
  access_remote_id: z.string().min(4, { message: "ID de acesso remoto é obrigatório" }),
  access_remote_password: z.string().min(4, { message: "Senha de acesso remoto é obrigatória" }),
  stream: z.boolean(),
  view_camera: z.boolean(),
  is_selected_auto_cnt: z.boolean().optional(),
})

type EquipmentSchema = z.infer<typeof equipmentSchema>

interface Props {
  refetch: () => void
}

export function EquipmentModal({ refetch }: Props) {
  
  const form = useForm<EquipmentSchema>({
    resolver: zodResolver(equipmentSchema),
    mode: "onChange",
    defaultValues: {
      stream: false,
      marking_automatic: "no",
      is_selected_view_video: "no",
    },
  })

  const { mutateAsync: createEquipmentFn, isPending } = useMutation({
    mutationFn: async (data: EquipmentSchema) => {
      // Simulated API call
      await createConfig(data)
      return data
    },
    onSuccess: () => {
      refetch()
      form.reset()
      toast.success("Equipamento criado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar equipamento")
    },
  })

  async function handleCreateEquipment(data: EquipmentSchema) {
    const completeData = {
      ...data,
      rout_view_video: data.rout_view_video || "",
      mount_video: data.mount_video || "",
      range_for_marking: data.range_for_marking || "",
      marking_automatic: data.marking_automatic || "no",
      is_selected_view_video: data.is_selected_view_video || "no",
      name_network_contactor: data.name_network_contactor || "",
      pass_word_contactor_network: data.pass_word_contactor_network || "",
      description: data.description || "",
      stream: data.stream || false,
      view_camera: data.view_camera,
      is_selected_auto_cnt: data.is_selected_auto_cnt,
    }

    await createEquipmentFn(completeData)
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Novo Equipamento</DialogTitle>
            <DialogDescription>Configure um novo equipamento de contagem</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateEquipment)} className="space-y-6">
          <Accordion type="multiple" defaultValue={[""]} className="w-full">
            <AccordionItem value="identification">
              <AccordionTrigger className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Identificação
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Equipamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Contador Pigtec 01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o equipamento e sua função..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="communication">
              <AccordionTrigger className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Configurações de Comunicação
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="rout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Comunicação</FormLabel>
                      <FormControl>
                        <Input placeholder="http://192.168.1.100:8080/api" {...field} />
                      </FormControl>
                      <FormDescription>URL para comunicação entre equipamento e aplicação</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="image-analysis">
              <AccordionTrigger className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Análise de Imagens
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cfg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arquivo .cfg</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/pig.cfg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="names"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arquivo .names</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/pig.names" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arquivo .weights</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/pig.weights" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Acurácia</FormLabel>
                      <FormControl>
                        <Input placeholder="0.75" {...field} />
                      </FormControl>
                      <FormDescription>Valor entre 0 e 1 para definir o nível mínimo de confiança</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="output">
              <AccordionTrigger className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Configurações de Saída
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="is_selected_view_video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salvar video no equipamento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Sim</SelectItem>
                          <SelectItem value="no">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rout_view_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caminho do Vídeo de Análise</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/video" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mount_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caminho de Montagem do Vídeo</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/video" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stream"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Transmissão Ativa</FormLabel>
                        <FormDescription>Habilitar transmissão de vídeo em tempo real</FormDescription>
                      </div>
                      <FormControl>
                        <Switch name="stream" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="view_camera"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Visualizar a câmera do contador no app</FormLabel>
                        <FormDescription>Habilitar a câmera do contador no app</FormDescription>
                      </div>
                      <FormControl>
                        <Switch name="view_camera" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="marking">
              <AccordionTrigger>
                <Wallpaper className="h-4 w-4" />
                Configurações de Marcação</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marking_automatic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marcação Automática</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Sim</SelectItem>
                            <SelectItem value="no">Não</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="range_for_marking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Range de Marcação</FormLabel>
                        <FormControl>
                          <Input placeholder="35" {...field} />
                        </FormControl>
                        <FormDescription>Número de animais para criar marcação automática</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="network_local">
              <AccordionTrigger>
                <Computer className="h-4 w-4" />
                Conexão Wi-Fi IoT</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name_network_contactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Rede Wi-Fi</FormLabel>
                        <FormControl>
                          <Input placeholder="MinhaRede_WiFi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pass_word_contactor_network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha da Rede Wi-Fi</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="host">
              <AccordionTrigger>
                <Computer className="h-4 w-4" />
                Host do contador</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name_network_contactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome host Wi-Fi</FormLabel>
                        <FormControl>
                          <Input placeholder="CONTADOR-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pass_word_contactor_network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha do host Wi-Fi</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="is_selected_auto_cnt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Autoconexão com equipamento</FormLabel>
                        <FormDescription>Permitir que o app se conecte automaticamente com o contador</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />


              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="remote-access">
              <AccordionTrigger className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Acesso Remoto
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="access_remote_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de Acesso Remoto</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="access_remote_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha de Acesso Remoto</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between items-center pt-6 border-t">
            <p className="text-xs text-muted-foreground max-w-md">
              Ao criar o equipamento, você concorda com nossos{" "}
              <a href="#" className="underline hover:text-foreground">
                termos de serviço
              </a>
            </p>

            <Button type="submit" disabled={isPending} className="min-w-[140px]">
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Equipamento"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
