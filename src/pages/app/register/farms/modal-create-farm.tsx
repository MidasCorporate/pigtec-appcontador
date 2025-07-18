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
import { useAuth } from '@/hooks/auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator';
import { useState } from 'react'
import { listConfig } from '@/api/config/list'
import { id } from 'date-fns/locale'
import { listProducers } from '@/api/producers/list'
import { createFarm } from '@/api/farm/create'

const farmSchema = z.object({
  name: z.string().min(4, { message: "Nome Obrigatório" }),
  nickname: z.string().min(4, { message: "Apelido Obrigatório" }),
  config_id: z.string().min(4, { message: "Configuração Obrigatória" }),
  producer_id: z.string().min(4, { message: "Produtor obrigatório" })
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

export function FarmModal({ refetch }: Props) {

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

  const { mutateAsync: createFarmFn } = useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      refetch()
      form.reset({
        name: '',
        nickname: '',
        config_id: '',
        producer_id: ''
      })
      toast.success('Granja criada com sucesso!')
    }
  })

  async function handleCreateFarm(data: FarmSchema) {
    try {
      createFarmFn(data)

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <DialogContent className={`max-h-screen overflow-auto`} >
      <DialogHeader>
        <DialogTitle>Adicionar granja</DialogTitle>
        <DialogDescription>Adicione uma nova granja</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <div className="">
          <div className="flex flex-col justify-center gap-6">
            <form onSubmit={form.handleSubmit(handleCreateFarm)} className="space-y-4">
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
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apelido da granja</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o equipamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configs?.map((config) => (
                          <SelectItem key={config.value} value={config.value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="producer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produtor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o equipamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {producers?.map((producer) => (
                          <SelectItem key={producer.value} value={producer.value}>
                            {producer.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
