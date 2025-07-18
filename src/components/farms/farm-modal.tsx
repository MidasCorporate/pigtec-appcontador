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
import { Textarea } from "@/components/ui/textarea"
import { PiggyBank, Settings, User } from "lucide-react"
import { LoadingSpinner } from "../ui/loading-spinner"
import { listConfig } from "@/api/config/list"
import { listProducers } from "@/api/producers/list"
import { createFarm } from "@/api/farm/create"

const farmSchema = z.object({
  name: z.string().min(4, { message: "Nome deve ter pelo menos 4 caracteres" }),
  nickname: z.string().min(4, { message: "Apelido deve ter pelo menos 4 caracteres" }),
  description: z.string().optional(),
  config_id: z.string().min(1, { message: "Selecione um equipamento" }),
  producer_id: z.string().min(1, { message: "Selecione um produtor" }),
})

type FarmSchema = z.infer<typeof farmSchema>

interface Props {
  refetch: () => void
}

export function FarmModal({ refetch }: Props) {
  const form = useForm<FarmSchema>({
    resolver: zodResolver(farmSchema),
    mode: "onChange",
  })

  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: listConfig
  })

  const { data: producers, isLoading: producersLoading } = useQuery({
    queryKey: ["producers"],
    queryFn: listProducers
  })

  const { mutateAsync: createFarmFn, isPending } = useMutation({
    mutationFn: async (data: FarmSchema) => {
      await createFarm(data)
      return data
    },
    onSuccess: () => {
      refetch()
      form.reset()
      toast.success("Granja criada com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar granja")
    },
  })

  async function handleCreateFarm(data: FarmSchema) {
    await createFarmFn(data)
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Nova Granja</DialogTitle>
            <DialogDescription>Cadastre uma nova granja no sistema</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateFarm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" />
                    Nome da Granja
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Granja São João" {...field} />
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
                  <FormLabel>Apelido</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SJ-001" {...field} />
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
                <FormLabel>Descrição (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a granja, localização, características especiais..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="config_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Equipamento
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={configsLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={configsLoading ? "Carregando..." : "Selecione o equipamento"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {configs?.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          <div className="flex flex-col">
                            <span>{config.name}</span>
                            <span className="text-xs text-muted-foreground">{config.description}</span>
                          </div>
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
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Produtor
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={producersLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={producersLoading ? "Carregando..." : "Selecione o produtor"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {producers?.map((producer) => (
                        <SelectItem key={producer.id} value={producer.id}>
                          <div className="flex flex-col">
                            <span>{producer.name}</span>
                            <span className="text-xs text-muted-foreground">{producer.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-xs text-muted-foreground max-w-md">
              Ao criar a granja, você concorda com nossos{" "}
              <a href="#" className="underline hover:text-foreground">
                termos de serviço
              </a>
            </p>

            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Granja"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
