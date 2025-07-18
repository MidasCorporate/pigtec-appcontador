"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CountingData } from "../index"

interface Producer {
  id: string
  name: string
  farms: Array<{ id: string; name: string }>
}

interface DataForCountingProps {
  onStartCounting: (data: CountingData) => void
}

export function DataForCounting({ onStartCounting }: DataForCountingProps) {
  const [type] = useState<"destination_with_count" | "simple_count">("destination_with_count")
  const [productorid, setProductorid] = useState("")
  const [productorName, setProductorName] = useState("")
  const [farmName, setFarmName] = useState("")
  const [farmId, setFarmId] = useState("")
  const [lote, setLote] = useState("")
  const [name, setName] = useState("")
  const [qtdCounting, setQtdCounting] = useState("")
  const [isSelectedBalance, setSelectionBalance] = useState<"online" | "offline">("offline")
  const [isSelectedTypeOfContage, setSelectionTypeOfContage] = useState<"carregamento" | "desmame" | "teste">(
    "carregamento",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [farmsProductors, setFarmsProductors] = useState<Array<{ id: string; name: string }>>([])

  // Mock data for producers
  const producers: Producer[] = [
    {
      id: "1",
      name: "Fazenda São João",
      farms: [
        { id: "f1", name: "Granja Norte" },
        { id: "f2", name: "Granja Sul" },
      ],
    },
    {
      id: "2",
      name: "Agropecuária Silva",
      farms: [
        { id: "f3", name: "Unidade 1" },
        { id: "f4", name: "Unidade 2" },
      ],
    },
  ]

  const contagens = [
    { id: 1, nome: "Embarque 7kg" },
    { id: 2, nome: "Embarque 23kg" },
    { id: 3, nome: "Embarque terminação" },
    { id: 4, nome: "Saida de maternidade" },
    { id: 5, nome: "Transferência interna" },
    { id: 6, nome: "Abate" },
  ]

  useEffect(() => {
    // Set initial lot number based on current week
    const currentWeek = Math.ceil(
      (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    setLote(currentWeek.toString())
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!lote.trim()) {
      newErrors.lote = "Lote é obrigatório"
    }

    if (type === "destination_with_count") {
      if (!productorid) {
        newErrors.producer = "Produtor é obrigatório"
      }
      if (!farmName) {
        newErrors.farm = "Granja é obrigatória"
      }
    }

    if (!name) {
      newErrors.name = "Tipo de contagem é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartCounting = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const navigationData: CountingData = {
        productorid: type === "destination_with_count" ? productorid : undefined,
        productorName,
        name,
        type,
        lote,
        farmName,
        farmId,
        balance: isSelectedBalance,
        qtdCounting,
        typeContage: isSelectedTypeOfContage,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onStartCounting(navigationData)
    } catch (error) {
      console.error("Error starting counting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonDisabled = useMemo(() => {
    if (type === "destination_with_count") {
      return !(productorid && lote && farmName && name)
    }
    if (type === "simple_count") {
      return !(lote && name)
    }
    return true
  }, [productorid, lote, farmName, name, type])

  const handleProducerChange = (value: string) => {
    const selectedProducer = producers.find((p) => p.id === value)
    if (selectedProducer) {
      setProductorid(value)
      setProductorName(selectedProducer.name)
      setFarmsProductors(selectedProducer.farms)
      setFarmId("")
      setFarmName("")
    }
  }

  const handleFarmChange = (value: string) => {
    const selectedFarm = farmsProductors.find((f) => f.id === value)
    if (selectedFarm) {
      setFarmId(value)
      setFarmName(selectedFarm.name)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold">
                {type === "destination_with_count" ? "Informações de destino" : "Dados para contagem"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {type === "destination_with_count"
                  ? "Insira as informações de destino para iniciar a contagem"
                  : "Insira os dados necessários para iniciar a contagem"}
              </p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações básicas</CardTitle>
              <CardDescription>Preencha os dados necessários para a contagem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lote">
                  Lote <span className="text-destructive">*</span>
                </Label>
                <Input id="lote" placeholder="Número do lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                {errors.lote && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.lote}</AlertDescription>
                  </Alert>
                )}
              </div>

              {type === "destination_with_count" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="producer">
                      Produtor <span className="text-destructive">*</span>
                    </Label>
                    <Select value={productorid} onValueChange={handleProducerChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produtor" />
                      </SelectTrigger>
                      <SelectContent>
                        {producers.map((producer) => (
                          <SelectItem key={producer.id} value={producer.id}>
                            {producer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.producer && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.producer}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farm">
                      Granja <span className="text-destructive">*</span>
                    </Label>
                    <Select value={farmId} onValueChange={handleFarmChange} disabled={!productorid}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma granja" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmsProductors.map((farm) => (
                          <SelectItem key={farm.id} value={farm.id}>
                            {farm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.farm && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.farm}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="counting-type">
                  Tipo de contagem <span className="text-destructive">*</span>
                </Label>
                <Select value={name} onValueChange={setName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de contagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {contagens.map((item) => (
                      <SelectItem key={item.id} value={item.nome}>
                        {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade estimada</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Quantidade estimada"
                  value={qtdCounting}
                  onChange={(e) => setQtdCounting(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Campo opcional para referência</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Configure as opções de contagem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="balance"
                  checked={isSelectedBalance === "online"}
                  onCheckedChange={(checked) => setSelectionBalance(checked ? "online" : "offline")}
                />
                <Label htmlFor="balance">Balança online</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="desmame"
                  checked={isSelectedTypeOfContage === "desmame"}
                  onCheckedChange={(checked) => setSelectionTypeOfContage(checked ? "desmame" : "carregamento")}
                />
                <Label htmlFor="desmame">Contagem de desmame</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teste"
                  checked={isSelectedTypeOfContage === "teste"}
                  onCheckedChange={(checked) => setSelectionTypeOfContage(checked ? "teste" : "carregamento")}
                />
                <Label htmlFor="teste">Modo de teste</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
        <div className="container mx-auto max-w-2xl">
          <Button onClick={handleStartCounting} disabled={buttonDisabled || isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Iniciar contagem
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  )
}
