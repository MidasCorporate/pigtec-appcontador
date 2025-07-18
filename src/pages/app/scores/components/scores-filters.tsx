"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Search, X, Filter } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const filtersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})

type FiltersSchema = z.infer<typeof filtersSchema>

export function ScoresFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get("orderId")
  const customerName = searchParams.get("customerName")
  const status = searchParams.get("status")

  const userLanguage = navigator.language || navigator.languages[0]
  const isPortuguese = userLanguage === "pt-BR"

  const { register, handleSubmit, control, reset } = useForm<FiltersSchema>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      orderId: orderId ?? "",
      customerName: customerName ?? "",
      status: status ?? "all",
    },
  })

  function handleFilter({ orderId, customerName, status }: FiltersSchema) {
    setSearchParams((state) => {
      if (orderId) {
        state.set("orderId", orderId)
      } else {
        state.delete("orderId")
      }
      if (customerName) {
        state.set("customerName", customerName)
      } else {
        state.delete("customerName")
      }
      if (status && status !== "all") {
        state.set("status", status)
      } else {
        state.delete("status")
      }
      state.set("page", "1")
      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("orderId")
      state.delete("customerName")
      state.delete("status")
      state.set("page", "1")
      return state
    })
    reset({
      orderId: "",
      customerName: "",
      status: "all",
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFilter)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <span className="font-medium">{isPortuguese ? "Filtros" : "Filters"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="orderId">{isPortuguese ? "ID da Contagem" : "Count ID"}</Label>
          <Input id="orderId" placeholder={isPortuguese ? "Digite o ID..." : "Enter ID..."} {...register("orderId")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">{isPortuguese ? "Lote" : "Batch"}</Label>
          <Input
            id="customerName"
            placeholder={isPortuguese ? "Digite o lote..." : "Enter batch..."}
            {...register("customerName")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{isPortuguese ? "Status" : "Status"}</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isPortuguese ? "Todos os status" : "All statuses"}</SelectItem>
                  <SelectItem value="pending">{isPortuguese ? "Pendente" : "Pending"}</SelectItem>
                  <SelectItem value="happening">{isPortuguese ? "Em andamento" : "In progress"}</SelectItem>
                  <SelectItem value="finalized">{isPortuguese ? "Finalizado" : "Completed"}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            {isPortuguese ? "Filtrar" : "Filter"}
          </Button>
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
