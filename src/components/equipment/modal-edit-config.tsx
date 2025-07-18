import { useMutation, useQuery } from '@tanstack/react-query'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Acordion } from '@/components/Acordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ConfigForm, listConfig } from '@/api/config/list'
import { listProducers } from '@/api/producers/list'
import { createFarm } from '@/api/farm/create'
import { createConfig, FormDataEquipment } from '@/api/config/create'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect } from 'react'
import { updateConfig } from '@/api/config/update'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Wifi, Camera, Zap, Wallpaper, Computer, Shield } from 'lucide-react'
import { Switch } from '@/components/ui/switch'


const equipmentSchema = z.object({
  name: z.string().min(4, { message: "Nome do equipamento é obrigatório" }),
  rout: z.string().min(4, { message: "URL de comunicação é obrigatória" }),
  cfg: z.string().min(4, { message: "Arquivo .cfg é obrigatório" }),
  names: z.string().min(4, { message: "Arquivo .names é obrigatório" }),
  weights: z.string().min(4, { message: "Arquivo .weights é obrigatório" }),
  rout_view_video: z.string().optional(),
  mount_video: z.string().optional(),
  range_for_marking: z.string().optional(),
  marking_automatic: z.string().optional(),
  is_selected_view_video: z.string().optional(),
  name_network_contactor: z.string().optional(),
  pass_word_contactor_network: z.string().optional(),
  password_network: z.string().optional(),
  ssid_network: z.string().optional(),
  description: z.string().optional(),
  threshold: z.string().min(1, { message: "Nível de acurácia é obrigatório" }),
  access_remote_id: z.string().min(4, { message: "ID de acesso remoto é obrigatório" }),
  access_remote_password: z.string().min(4, { message: "Senha de acesso remoto é obrigatória" }),
  stream: z.boolean().optional(),
  view_camera: z.boolean().optional(),
  is_selected_auto_cnt: z.boolean().optional(),
})


type EquipmentSchema = z.infer<typeof equipmentSchema>

interface Props {
  equipment: ConfigForm
  refetch: () => void
  onClose: () => void
}

export function EditConfigModal({ refetch, equipment, onClose }: Props) {
  const form = useForm<EquipmentSchema>({
    resolver: zodResolver(equipmentSchema),
    mode: 'onChange',
    defaultValues: {
      name: equipment.name,
      rout: equipment.rout,
      cfg: equipment.cfg,
      names: equipment.names,
      weights: equipment.weights,
      rout_view_video: equipment.rout_view_video,
      mount_video: equipment.mount_video,
      range_for_marking: equipment.range_for_marking,
      marking_automatic: equipment.marking_automatic,
      is_selected_view_video: equipment.is_selected_view_video,
      name_network_contactor: equipment.name_network_contactor,
      pass_word_contactor_network: equipment.pass_word_contactor_network,
      ssid_network: equipment.ssid_network,
      password_network: equipment.password_network,
      description: equipment.description,
      threshold: equipment.threshold,
      access_remote_id: equipment.access_remote_id,
      access_remote_password: equipment.access_remote_password,
      stream: equipment.stream,
      view_camera: equipment.view_camera,
      is_selected_auto_cnt: equipment.is_selected_auto_cnt,
    },
  })

  // const { data: configs } = useQuery({
  //   queryKey: ['configs'],
  //   queryFn: async () => {} 
  // })

  // Atualizar o formulário quando os dados do equipamento mudarem
  // useEffect(() => {
  //   form.reset({
  //     name: equipment.name,
  //     rout: equipment.rout,
  //     cfg: equipment.cfg,
  //     names: equipment.names,
  //     weights: equipment.weights,
  //     rout_view_video: equipment.rout_view_video,
  //     mount_video: equipment.mount_video,
  //     range_for_marking: equipment.range_for_marking,
  //     marking_automatic: equipment.marking_automatic,
  //     is_selected_view_video: equipment.is_selected_view_video,
  //     name_network_contactor: equipment.name_network_contactor,
  //     pass_word_contactor_network: equipment.pass_word_contactor_network,
  //     description: equipment.description,
  //     threshold: equipment.threshold,
  //     access_remote_id: equipment.access_remote_id,
  //     access_remote_password: equipment.access_remote_password,
  //     stream: equipment.stream,
  //   })
  // }, [equipment, form])


  const { mutateAsync: updateEquipmentFn, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EquipmentSchema }) => updateConfig(id, data),
    onSuccess: () => {
      refetch()
      onClose()
      toast.success("Config atualizada com sucesso!")
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.response?.data?.message || "Erro ao atualizar config")
    },
  })

  async function handleUpdateConfig(data: EquipmentSchema) {
    try {
      await updateEquipmentFn({ id: equipment.id, data })
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Erro ao atualizar granja")
    }
  }


  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto ">
      <DialogHeader>
        <DialogTitle>Editar equipamento</DialogTitle>
        <DialogDescription>Edite este equipamento equipamento</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <div className="">
          <div className="flex flex-col justify-center gap-6">
            <form onSubmit={form.handleSubmit(handleUpdateConfig)} className="space-y-4">
              <Accordion type="single" defaultValue="" className="w-full">
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

                <AccordionItem value="network">
                  <AccordionTrigger>
                    <Computer className="h-4 w-4" />
                    Conexão Wi-Fi IoT</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ssid_network"
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
                        name="password_network"
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
              <div className='flex justify-between' >
                <div />

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Ao continuar, você concorda com nossos{' '}
                <a href="" className="underline underline-offset-4">
                  termos de serviço
                </a>{' '}
                e{' '}
                <a href="" className="underline underline-offset-4">
                  politicas de privacidade.
                </a>
              </p>

            </form>
          </div>
        </div>
      </Form>
    </DialogContent>
  )
}
