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
import { useEffect } from "react"
import { listConfig } from "@/api/config/list"
import { updateUsers } from "@/api/users/update"

const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().optional(),
  internal_code: z.string().min(1, { message: "Código interno é obrigatório" }),
  config_id: z.string().min(1, { message: "Selecione uma configuração" }),
})

type UserSchema = z.infer<typeof userSchema>

interface EditUserModalProps {
  user: {
    id: string
    name: string
    email: string
    cpf?: string | null
    internal_code: string
    config_id?: string | null
  }
  refetch: () => void
  onClose: () => void
}

export function EditUserModal({ user, refetch, onClose }: EditUserModalProps) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
      cpf: user.cpf || "",
      internal_code: user.internal_code,
      config_id: user.config_id || "",
    }
  })

  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: listConfig
  })

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      cpf: user.cpf || "",
      internal_code: user.internal_code,
      config_id: user.config_id || "",
    })
  }, [user, form])

  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationFn: async (data: UserSchema) => {
      // For now, we'll just simulate the update
      // In a real app, you'd call an update API endpoint
      updateUsers( { id: user.id, ...data })
      return data},
    onSuccess: () => {
      refetch()
      onClose()
      toast.success("Usuário atualizado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar usuário")
    },
  })

  async function handleUpdateUser(data: UserSchema) {
    await updateUserFn(data)
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
            <DialogDescription>Edite as informações do usuário</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-6">
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}