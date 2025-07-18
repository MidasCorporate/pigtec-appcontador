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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createPermission } from "@/api/permission/create"

const permissionSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  module: z.string().min(1, { message: "Módulo é obrigatório" }),
  identification: z.string().min(3, { message: "Identificador é obrigátorio" }),
  action: z.string().min(1, { message: "Ação é obrigatória" }),
  resource: z.string().min(1, { message: "Recurso é obrigatório" }),
  isActive: z.boolean().default(true),
})

type PermissionSchema = z.infer<typeof permissionSchema>

interface Props {
  refetch: () => void
  editData?: any
}

export function PermissionModal({ refetch, editData }: Props) {
  const form = useForm<PermissionSchema>({
    resolver: zodResolver(permissionSchema),
    mode: "onChange",
    defaultValues: editData
      ? {
          name: editData.name,
          description: editData.description,
          module: editData.module,
          action: "create",
          resource: "farm",
          isActive: true,
        }
      : {
          name: "",
          description: "",
          module: "",
          action: "",
          resource: "",
          isActive: true,
        },
  })

  const { mutateAsync: createOrUpdatePermission } = useMutation({
    mutationFn: async (data: PermissionSchema) => {
      await createPermission(data)
      return data
    },
    onSuccess: () => {
      refetch()
      form.reset()
      toast.success(editData ? "Permission atualizada com sucesso!" : "Permission criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao salvar permission")
    },
  })

  async function handleSubmit(data: PermissionSchema) {
    try {
      await createOrUpdatePermission(data)
    } catch (error) {
      console.error(error)
    }
  }

  const modules = [
    { value: "Farms", label: "granjas" },
    { value: "Equipment", label: "Equipamentos" },
    { value: "Reports", label: "Relatórios" },
    { value: "Users", label: "Usuários" },
    { value: "Settings", label: "Configurações" },
  ]

  const actions = [
    { value: "create", label: "Criar" },
    { value: "read", label: "Visualizar" },
    { value: "update", label: "Editar" },
    { value: "delete", label: "Excluir" },
    { value: "manage", label: "Gerenciar" },
  ]

  const resources = [
    { value: "farm", label: "Fazenda" },
    { value: "equipment", label: "Equipamento" },
    { value: "report", label: "Relatório" },
    { value: "user", label: "Usuário" },
    { value: "config", label: "Configuração" },
  ]

  return (
    <DialogContent className="max-h-screen overflow-auto max-w-2xl">
      <DialogHeader>
        <DialogTitle>{editData ? "Editar Permission" : "Criar Nova Permission"}</DialogTitle>
        <DialogDescription>
          {editData ? "Atualize as informações da permission" : "Defina uma nova permission do sistema"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Permission</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Create Farm" {...field} />
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
                  <Textarea
                    placeholder="Descreva o que esta permission permite fazer..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              control={form.control}
              name="identification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: create_farm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o módulo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.value} value={module.value}>
                          {module.label}
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
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
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
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurso</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o recurso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.value} value={resource.value}>
                          {resource.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Permission ativa</FormLabel>
                  <p className="text-sm text-muted-foreground">Esta permission estará disponível para uso</p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <div />
            <Button type="submit">{editData ? "Atualizar Permission" : "Criar Permission"}</Button>
          </div>

          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="underline underline-offset-4">
              termos de serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline underline-offset-4">
              políticas de privacidade.
            </a>
          </p>
        </form>
      </Form>
    </DialogContent>
  )
}
