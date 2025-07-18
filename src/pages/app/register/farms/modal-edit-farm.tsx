"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect } from "react"
import { listConfig } from "@/api/config/list"
import { listProducers } from "@/api/producers/list"
import { updateFarm } from "@/api/farm/update"

const farmSchema = z.object({
  name: z.string().min(4, { message: "Nome Obrigatório" }),
  nickname: z.string().min(4, { message: "Apelido Obrigatório" }),
  config_id: z.string().min(4, { message: "Configuração Obrigatória" }),
  producer_id: z.string().min(4, { message: "Produtor obrigatório" }),
})

type FarmSchema = z.infer<typeof farmSchema>

interface Farm {
  id: string
  name: string
  nickname: string
  config_id: string
  producer_id: string
}

interface Props {
  farm: Farm
  refetch: () => void
  onClose: () => void
}

export function EditFarmModal({ farm, refetch, onClose }: Props) {
  
  const form = useForm<FarmSchema>({
    resolver: zodResolver(farmSchema),
    mode: "onChange",
    defaultValues: {
      name: farm.name,
      nickname: farm.nickname,
      config_id: farm.config_id,
      producer_id: farm.producer_id,
    },
  })

  // Atualizar o formulário quando os dados da granja mudarem
  useEffect(() => {
    form.reset({
      name: farm.name,
      nickname: farm.nickname,
      config_id: farm.config_id,
      producer_id: farm.producer_id,
    })
  }, [farm, form])

  const { data: configs } = useQuery({
    queryKey: ["configs"],
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
    queryKey: ["producers"],
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

  const { mutateAsync: updateFarmFn, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FarmSchema }) => updateFarm(id, data),
    onSuccess: () => {
      refetch()
      onClose()
      toast.success("Granja atualizada com sucesso!")
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.response?.data?.message || "Erro ao atualizar granja")
    },
  })

  async function handleUpdateFarm(data: FarmSchema) {
    try {
      await updateFarmFn({ id: farm.id, data })
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Erro ao atualizar granja")
    }
  }

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <DialogHeader>
        <DialogTitle>Editar granja</DialogTitle>
        <DialogDescription>Edite as informações da granja</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <div className="">
          <div className="flex flex-col justify-center gap-6">
            <form onSubmit={form.handleSubmit(handleUpdateFarm)} className="space-y-4">
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
                          <SelectValue placeholder="Selecione o produtor" />
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

              <div className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>

              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Ao continuar, você concorda com nossos{" "}
                <a href="" className="underline underline-offset-4">
                  termos de serviço
                </a>{" "}
                e{" "}
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
