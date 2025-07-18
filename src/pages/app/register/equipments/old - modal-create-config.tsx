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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { listConfig } from '@/api/config/list'
import { listProducers } from '@/api/producers/list'
import { createFarm } from '@/api/farm/create'
import { createConfig } from '@/api/config/create'
import { Accordion } from '@/components/ui/accordion'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


const farmSchema = z.object({
  name: z.string().min(4, { message: "Nome Obrigatório" }),
  rout: z.string().min(4, { message: "Nome Obrigatório" }),
  cfg: z.string().min(4, { message: "Nome Obrigatório" }),
  names: z.string().min(4, { message: "Nome Obrigatório" }),
  weights: z.string().min(4, { message: "Nome Obrigatório" }),
  rout_view_video: z.string().optional(),
  mount_video: z.string().optional(),
  range_for_marking: z.string().optional(),
  marking_automatic: z.string().optional(),
  is_selected_view_video: z.string().optional(),
  name_network_contactor: z.string().optional(),
  pass_word_contactor_network: z.string().optional(),
  description: z.string().optional(),
  threshold: z.string().min(4, { message: "Nome Obrigatório" }),
  access_remote_id: z.string().min(4, { message: "Nome Obrigatório" }),
  access_remote_password: z.string().min(4, { message: "Nome Obrigatório" }),
  stream: z.boolean().optional(),
})


type FarmSchema = z.infer<typeof farmSchema>

interface GroupInterface {
  id: string
  name: string
  description: string
}

interface Props {
  refetch: () => void
}

function ConfigModal({ refetch }: Props) {

  const form = useForm<FarmSchema>({
    resolver: zodResolver(farmSchema),
    mode: 'onChange',
  })

  const { data: configs } = useQuery({
    queryKey: ['configs'],
    queryFn: async () => {
      const config = await listConfig()
      const formatConfig = config.map((config) => {
        return {
          value: config.id,
          label: config.name,
        }
      })

      return formatConfig
    },
  })

  const { data: producers } = useQuery({
    queryKey: ['producers'],
    queryFn: async () => {
      const producer = await listProducers()
      const formatProducer = producer.map((prod) => {
        return {
          value: prod.id,
          label: prod.name,
        }
      })

      return formatProducer
    },
  })

  const { mutateAsync: createConfigFn } = useMutation({
    mutationFn: createConfig,
    onSuccess: () => {
      refetch()
      form.reset({
        name: '',
        rout: '',
        cfg: '',
        names: '',
        weights: '',
        rout_view_video: '',
        mount_video: '',
        range_for_marking: '',
        marking_automatic: '',
        is_selected_view_video: '',
        name_network_contactor: '',
        pass_word_contactor_network: '',
        description: '',
        threshold: '',
        access_remote_id: '',
        access_remote_password: '',
        stream: false,
      })
      toast.success('Granja criada com sucesso!')
    }
  })

  async function handleCreateFarm(data: FarmSchema) {
    try {
      const completeData = {
        ...data,
        rout_view_video: data.rout_view_video || '',
        mount_video: data.mount_video || '',
        range_for_marking: data.range_for_marking || '',
        marking_automatic: data.marking_automatic || '',
        is_selected_view_video: data.is_selected_view_video || '',
        name_network_contactor: data.name_network_contactor || '',
        pass_word_contactor_network: data.pass_word_contactor_network || '',
        description: data.description || '',
        stream: data.stream || false,
      }

      createConfigFn(completeData)

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <DialogContent className={`max-h-screen overflow-auto`} >
      <DialogHeader>
        <DialogTitle>OOOLLDDDwwwwwwwwwwAdicionar novo equipamento</DialogTitle>
        <DialogDescription>Adicione um novo equipamento</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <div className="">
          <div className="flex flex-col justify-center gap-6">
            <form onSubmit={form.handleSubmit(handleCreateFarm)} className="space-y-4">
              <Accordion type="single" collapsible >
                <Acordion title="Identificação">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição do equipamento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>

                <Acordion title="Configurações de comunicação" >
                  <FormField
                    control={form.control}
                    name="rout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de comunicação entre equip. e app</FormLabel>
                        <FormControl>
                          <Input placeholder="Rota de comunicação do equip." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </Acordion>
                <Acordion title="Configurações da analise de imagens" >
                  <FormField
                    control={form.control}
                    name="cfg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arquivo .cfg</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: /home/jet/pig.cfg" {...field} />
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
                          <Input placeholder="Ex: /home/jet/pig.names" {...field} />
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
                          <Input placeholder="Ex: /home/jet/pig.weights" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de aceite de acurácia</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 0.75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>
                <Acordion title="Configurações de saida" >

                  <FormField
                    control={form.control}
                    name="rout_view_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caminho do video de análise</FormLabel>
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
                        <FormLabel>Caminho de montagem do video</FormLabel>
                        <FormControl>
                          <Input placeholder="/home/jet/video" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </Acordion>
                <Acordion title="Configurações de marcações" >

                  <FormField
                    control={form.control}
                    name="marking_automatic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permitir marcação automaticas</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">
                              Sim
                            </SelectItem>
                            <SelectItem value="no">
                              Não
                            </SelectItem>
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
                        <FormLabel>Range de marcação automática</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 35 (quando passar 35 aniamis o sistema criara uma marcação)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>


                <Acordion title="Conexão WI-FI IOT" >

                  <FormField
                    control={form.control}
                    name="name_network_contactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da rede WI-FI</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da rede wifi do cliente" {...field} />
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
                        <FormLabel>Senha da rede WI-FI</FormLabel>
                        <FormControl>
                          <Input placeholder="Senha da rede wifi do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_selected_view_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visualizar camêra no app</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">
                              Sim
                            </SelectItem>
                            <SelectItem value="no">
                              Não
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>

                <Acordion title="Host do contador" >

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
                          <Input placeholder="Senha da rede wifi do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_selected_view_video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visualizar camêra no app</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">
                              Sim
                            </SelectItem>
                            <SelectItem value="no">
                              Não
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>




                <Acordion title="Acesso remoto" >
                  <FormField
                    control={form.control}
                    name="access_remote_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de Acesso Remoto</FormLabel>
                        <FormControl>
                          <Input placeholder="ID de acesso remoto" {...field} />
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
                          <Input placeholder="Senha de acesso remoto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stream"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmissão</FormLabel>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Acordion>
              </Accordion>
              <div className='flex justify-between' >
                <div />

                <Button type="submit" >
                  Finalizar cadastro
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
