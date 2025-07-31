"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { Plus, Merge, RefreshCw } from "lucide-react"

import { getOrders } from "@/api/get-pig-scores"
import { UnifiqScors } from "@/api/Unifiq-scors"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { ScoresTable } from "./components/scores-table"
import { ScoresFilters } from "./components/scores-filters"
import { ScoresTableSkeleton } from "./components/scores-table-skeleton"
import { handleVerify } from "@/api/scor/verify"

export function Scores() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedScores, setSelectedScores] = useState<string[]>([])

  const orderId = searchParams.get("orderId")
  const customerName = searchParams.get("customerName")
  const status = searchParams.get("status")

   const navigate = useNavigate()

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1")

  const {
    data: result,
    isLoading: isLoadingScores,
    refetch,
  } = useQuery({
    queryKey: ["scores", pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        pageIndex: pageIndex + 1, // Convert back to 1-based for API
        orderId,
        customerName,
        status: status === "all" ? null : status,
      }),
  })
  console.log('result', result)
  const { mutateAsync: unifyScores, isPending: isUnifying } = useMutation({
    mutationFn: UnifiqScors,
    onSuccess: () => {
      refetch()
      setSelectedScores([])
      toast.success("Contagens unificadas com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao unificar contagens")
    },
  })

  function handlePaginate(page: number) {
    setSearchParams((state) => {
      state.set("page", (page + 1).toString())
      return state
    })
  }

  const handleUnifyScores = async () => {
    if (selectedScores.length !== 2) {
      toast.error("Selecione exatamente 2 contagens para unificar")
      return
    }

    try {
      await unifyScores(selectedScores)
    } catch (error) {
      console.error("Erro ao unificar:", error)
    }
  }


  const {mutateAsync: handleUpdateVerify, isPending} = useMutation({
    mutationFn: async () => handleVerify(),
    onSuccess: () => {
        refetch()
        toast.success("Base atualizada!")
      },
    onError: (error: any) => {
        toast.error(error.message || "Erro ao sincronizar")
      },
  })
  
  const userLanguage = navigator.language || navigator.languages[0]
  const isPortuguese = userLanguage === "pt-BR"

  return (
    <>
      <Helmet title={isPortuguese ? "Contagens" : "Counts"} />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isPortuguese ? "Contagens" : "Counts"}</h1>
            <p className="text-muted-foreground">
              {isPortuguese
                ? "Gerencie e visualize todas as contagens de animais"
                : "Manage and view all animal counts"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {result && (
              <Badge variant="secondary" className="text-sm">
                {result.pagination.total} {isPortuguese ? "contagens" : "counts"}
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleUpdateVerify()} 
              disabled={isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              {isPortuguese ? "Atualizar Imagens" : "Update Images"}
            </Button>
            
            <Button 
              size="sm" 
              onClick={() => navigate('/counter')}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isPortuguese ? "Nova Contagem" : "New Count"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <ScoresFilters />
          </CardContent>
        </Card>

        {/* Unify Alert */}
        {selectedScores.length > 0 && (
          <Alert>
            <Merge className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {selectedScores.length} {isPortuguese ? "contagem(ns) selecionada(s)" : "count(s) selected"}
                {selectedScores.length === 2 && (
                  <span className="ml-2 text-green-600">
                    {isPortuguese ? "- Pronto para unificar" : "- Ready to unify"}
                  </span>
                )}
              </span>
              <Button
                onClick={handleUnifyScores}
                disabled={selectedScores.length !== 2 || isUnifying}
                size="sm"
                variant="destructive"
              >
                <Merge className="mr-2 h-4 w-4" />
                {isUnifying ? (isPortuguese ? "Unificando..." : "Unifying...") : isPortuguese ? "Unificar" : "Unify"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isPortuguese ? "Lista de Contagens" : "Counts List"}</CardTitle>
          </CardHeader>


          <CardContent>
            {isLoadingScores ? (
              <ScoresTableSkeleton />
            ) : result ? (
              <ScoresTable
                scores={result.scores}
                selectedScores={selectedScores}
                onSelectionChange={setSelectedScores}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isPortuguese ? "Nenhuma contagem encontrada" : "No counts found"}
                </h3>
                <p className="text-muted-foreground">
                  {isPortuguese
                    ? "Não há contagens para exibir com os filtros atuais."
                    : "There are no counts to display with the current filters."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {result && result.pagination.total > result.pagination.take && (
          <div className="flex justify-center">
            <Pagination
              pageIndex={pageIndex}
              totalCount={result.pagination.total}
              perPage={result.pagination.take}
              onPageChange={handlePaginate}
            />
          </div>
        )}
      </div>
    </>
  )
}
