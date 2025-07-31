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
import { User, Mail, Shield, Settings } from "lucide-react"
import { LoadingSpinner } from "../ui/loading-spinner"
import { createUsers } from "@/api/users/create"
import { listConfig } from "@/api/config/list"

const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().optional(),
  internal_code: z.string().min(1, { message: "Código interno é obrigatório" }),
  config_id: z.string().min(1, { message: "Selecione uma configuração" }),
})

type UserSchema = z.infer<typeof userSchema>

interface Props {
  refetch: () => void
}

export function UserModal({ refetch }: Props) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  })

  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: listConfig
  })

  const { mutateAsync: createUserFn, isPending } = useMutation({
    mutationFn: async (data: UserSchema) => {
      await createUsers(data)
      return data
    },
    onSuccess: () => {
      refetch()
      form.reset()
      toast.success("Usuário criado com sucesso!")
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar usuário"
      toast.error(errorMessage)
    },
  })

  async function handleCreateUser(data: UserSchema) {
    await createUserFn(data)
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Novo Usuário</DialogTitle>
            <DialogDescription>Cadastre um novo usuário no sistema</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: joao@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    CPF (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Código Interno
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: USR001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="config_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuração
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={configsLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={configsLoading ? "Carregando..." : "Selecione uma configuração"} />
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

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-xs text-muted-foreground max-w-md">
              Ao criar o usuário, você concorda com nossos{" "}
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
                "Criar Usuário"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
