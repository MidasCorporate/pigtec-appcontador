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
import { createRole } from "@/api/role/create"

const ruleSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  identification: z.string().min(1, { message: "Prioridade é obrigatória" }),
  isActive: z.boolean().default(true),
})

type RuleSchema = z.infer<typeof ruleSchema>

interface Props {
  refetch: () => void
  editData?: any
}

export function RuleModal({ refetch, editData }: Props) {
  const form = useForm<RuleSchema>({
    resolver: zodResolver(ruleSchema),
    mode: "onChange",
    defaultValues: editData
      ? {
        name: editData.name,
        description: editData.description,
        identification: editData.identification,
        isActive: true,
      }
      : {
        name: "",
        description: "",
        identification: "",
        isActive: true,
      },
  })

  const { mutateAsync: createOrUpdateRule } = useMutation({
    mutationFn: async (data: RuleSchema) => {
      await createRole(data)
      return data
    },
    onSuccess: () => {
      refetch()
      form.reset()
      toast.success(editData ? "Rule atualizada com sucesso!" : "Rule criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao salvar rule")
    },
  })

  async function handleSubmit(data: RuleSchema) {
    try {
      await createOrUpdateRule(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent className="max-h-screen overflow-auto max-w-2xl">
      <DialogHeader>
        <DialogTitle>{editData ? "Editar Rule" : "Criar Nova Rule"}</DialogTitle>
        <DialogDescription>
          {editData ? "Atualize as informações da rule" : "Defina uma nova rule de acesso"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Rule</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Admin Access" {...field} />
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
                    <Input placeholder="Ex: admin_acces" {...field} />
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
                  <Textarea placeholder="Descreva o propósito desta rule..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input type="checkbox" checked={field.value} onChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Rule ativa</FormLabel>
                  <p className="text-sm text-muted-foreground">Esta rule estará disponível para uso</p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <div />
            <Button type="submit">{editData ? "Atualizar Rule" : "Criar Rule"}</Button>
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
