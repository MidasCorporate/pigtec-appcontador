"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
  // Detect if it's egg counting based on selected name
  const isEggCounting = name === "Contagem de ovos"
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
    { id: 7, nome: "Contagem de ovos" },
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
        isEggCounting,
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">
                Nova Contagem
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Configure os dados para iniciar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 pb-24 max-w-2xl">
        <div className="space-y-4">
          {/* Informações Básicas */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lote */}
              <div className="space-y-2">
                <Label htmlFor="lote" className="text-sm font-medium">
                  Lote <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="lote" 
                  placeholder="Ex: 42" 
                  value={lote} 
                  onChange={(e) => setLote(e.target.value)}
                  className="h-10"
                />
                {errors.lote && (
                  <p className="text-sm text-destructive">{errors.lote}</p>
                )}
              </div>

              {/* Produtor e Granja - Grid Layout */}
              {type === "destination_with_count" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="producer" className="text-sm font-medium">
                      Produtor <span className="text-destructive">*</span>
                    </Label>
                    <Select value={productorid} onValueChange={handleProducerChange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecionar produtor" />
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
                      <p className="text-sm text-destructive">{errors.producer}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farm" className="text-sm font-medium">
                      Granja <span className="text-destructive">*</span>
                    </Label>
                    <Select value={farmId} onValueChange={handleFarmChange} disabled={!productorid}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecionar granja" />
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
                      <p className="text-sm text-destructive">{errors.farm}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tipo de Contagem e Quantidade - Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="counting-type" className="text-sm font-medium">
                    Tipo de contagem <span className="text-destructive">*</span>
                  </Label>
                  <Select value={name} onValueChange={setName}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecionar tipo" />
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
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Qtd. Estimada
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Ex: 150"
                    value={qtdCounting}
                    onChange={(e) => setQtdCounting(e.target.value)}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Opcional</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Balança Online */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="balance"
                    checked={isSelectedBalance === "online"}
                    onCheckedChange={(checked) => setSelectionBalance(checked ? "online" : "offline")}
                  />
                  <Label htmlFor="balance" className="text-sm font-medium cursor-pointer">
                    Balança Online
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isSelectedBalance === "online" ? "Ativo" : "Inativo"}
                </span>
              </div>


              {/* Tipo de Contagem - Radio Group Style */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Modo de Contagem</Label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="carregamento"
                        checked={isSelectedTypeOfContage === "carregamento"}
                        onCheckedChange={(checked) => checked && setSelectionTypeOfContage("carregamento")}
                      />
                      <Label htmlFor="carregamento" className="text-sm cursor-pointer">
                        Carregamento
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="desmame"
                        checked={isSelectedTypeOfContage === "desmame"}
                        onCheckedChange={(checked) => checked && setSelectionTypeOfContage("desmame")}
                      />
                      <Label htmlFor="desmame" className="text-sm cursor-pointer">
                        Desmame
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="teste"
                        checked={isSelectedTypeOfContage === "teste"}
                        onCheckedChange={(checked) => checked && setSelectionTypeOfContage("teste")}
                      />
                      <Label htmlFor="teste" className="text-sm cursor-pointer">
                        Modo Teste
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isSelectedTypeOfContage === "teste" ? "Ativo" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="sticky bottom-0 z-40 border-t bg-card shadow-lg">
        <div className="container mx-auto px-4 py-3 max-w-2xl">
          <Button 
            onClick={handleStartCounting} 
            disabled={buttonDisabled || isLoading} 
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Iniciando Contagem...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Iniciar Contagem
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  )
}
