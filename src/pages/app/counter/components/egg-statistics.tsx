"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface EggStatisticsProps {
  totalCount: number
  startTime: Date | null
  estimatedQuantity?: string
}

interface EggStats {
  totalEggsToday: number
  totalDozens: number
  eggsPerHour: number
  currentCount: number
}

interface ChartData {
  time: string
  count: number
}

export function EggStatistics({ totalCount, startTime, estimatedQuantity }: EggStatisticsProps) {
  const [stats, setStats] = useState<EggStats>({
    totalEggsToday: 0,
    totalDozens: 0,
    eggsPerHour: 0,
    currentCount: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])

  // Função para calcular estatísticas de ovos
  const calculateEggStats = (): EggStats => {
    const currentCount = totalCount

    // Total de ovos hoje (contagens anteriores + atual)
    const existingTodayCount = getTodayExistingCount()
    const totalEggsToday = existingTodayCount + currentCount

    // Total de dúzias (a cada 12 ovos)
    const totalDozens = Math.floor(totalEggsToday / 12)

    // Ovos por hora baseado na velocidade atual
    const eggsPerHour = calculateEggsPerHour(currentCount, startTime)

    return {
      totalEggsToday,
      totalDozens,
      eggsPerHour,
      currentCount,
    }
  }

  // Função para obter contagens existentes do dia atual (apenas contagens finalizadas)
  const getTodayExistingCount = (): number => {
    try {
      const today = new Date().toDateString()
      const savedScores = localStorage.getItem("@Scores")
      
      if (savedScores) {
        const scores = JSON.parse(savedScores)
        // Somar apenas contagens de ovos finalizadas do dia atual
        const todayEggScores = scores.filter((score: any) => {
          if (!score.created_at || !score.name) return false
          
          const scoreDate = new Date(score.created_at).toDateString()
          const isToday = scoreDate === today
          const isEggCounting = score.name.toLowerCase().includes("ovo") || score.name === "Contagem de ovos"
          const isFinalized = score.status === true
          
          return isToday && isEggCounting && isFinalized
        })
        
        // Somar as quantidades
        const totalCount = todayEggScores.reduce((total: number, score: any) => {
          const quantity = parseInt(score.quantity) || 0
          return total + quantity
        }, 0)
        
        console.log(`Contagens de ovos finalizadas hoje: ${todayEggScores.length}, Total: ${totalCount}`)
        return totalCount
      }
      return 0
    } catch (error) {
      console.error("Error getting today's existing count:", error)
      return 0
    }
  }

  // Função para calcular ovos por hora baseado na velocidade atual
  const calculateEggsPerHour = (count: number, start: Date | null): number => {
    if (!start || count === 0) return 0

    const now = new Date()
    const minutesElapsed = (now.getTime() - start.getTime()) / (1000 * 60)
    
    if (minutesElapsed <= 0) return 0
    
    // Calcula a velocidade atual (ovos por minuto) e extrapola para hora
    const eggsPerMinute = count / minutesElapsed
    return Math.round(eggsPerMinute * 60)
  }


  // Atualizar dados do gráfico
  const updateChartData = (count: number) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    setChartData(prev => {
      const newData = [...prev, { time: timeString, count }]
      // Manter apenas os últimos 20 pontos para não sobrecarregar
      return newData.slice(-20)
    })
  }

  // Atualizar estatísticas quando totalCount mudar
  useEffect(() => {
    const newStats = calculateEggStats()
    setStats(newStats)

    // Atualizar gráfico apenas se houver mudança significativa
    if (totalCount > 0 && totalCount % 5 === 0) {
      updateChartData(totalCount)
    }
  }, [totalCount, startTime])

  // Função para formatar números completos
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR')
  }

  // Componente do gráfico de linhas simples
  const SimpleLineChart = () => {
    if (chartData.length < 2) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Aguardando dados do gráfico</p>
              <p className="text-xs text-gray-400">O gráfico será atualizado a cada 5 ovos contados</p>
            </div>
          </div>
        </div>
      )
    }

    const maxCount = Math.max(...chartData.map(d => d.count))
    const minCount = Math.min(...chartData.map(d => d.count))
    const range = maxCount - minCount || 1

    // Dimensões do gráfico
    const chartWidth = 280
    const chartHeight = 50
    const chartPadding = 10

    // Criar pontos SVG com coordenadas corrigidas
    const points = chartData.map((data, index) => {
      const x = chartPadding + (index / (chartData.length - 1)) * chartWidth
      const y = chartPadding + chartHeight - ((data.count - minCount) / range) * chartHeight
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Progresso da Contagem em Tempo Real</p>
          {estimatedQuantity && parseInt(estimatedQuantity) > 0 && (
            <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
              Previsão de término: {getEstimatedCompletion()}
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          {/* Gráfico */}
          <div className="flex-1">
            <svg width="100%" height="80" viewBox="0 0 320 80" className="w-full">
              {/* Grid de fundo */}
              <defs>
                <pattern id="grid" width="32" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 16" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="320" height="80" fill="url(#grid)" />
              
              {/* Linha do gráfico */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points={points}
              />
              
              {/* Pontos no gráfico */}
              {chartData.map((data, index) => {
                const x = chartPadding + (index / (chartData.length - 1)) * chartWidth
                const y = chartPadding + chartHeight - ((data.count - minCount) / range) * chartHeight
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="1"
                    />
                    {/* Tooltip no hover */}
                    <title>{`${data.time}: ${data.count} ovos`}</title>
                  </g>
                )
              })}
            </svg>
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{chartData[0]?.time}</span>
              <span>{chartData[chartData.length - 1]?.time}</span>
            </div>
          </div>
          
          {/* Caixa de informações */}
          <div className="w-40 bg-white rounded border p-3">
            <div className="text-xs space-y-2">
              <div>
                <p className="font-medium text-gray-700">Sobre o gráfico:</p>
                <p className="text-gray-600">Mostra a evolução da contagem de ovos ao longo do tempo</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Pontos azuis:</p>
                <p className="text-gray-600">Cada ponto representa uma medição a cada 5 ovos contados</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Velocidade atual:</p>
                <p className="text-blue-600 font-medium">{stats.eggsPerHour} ovos/hora</p>
              </div>
              {estimatedQuantity && parseInt(estimatedQuantity) > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Meta:</p>
                  <p className="text-gray-600">{parseInt(estimatedQuantity)} ovos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calcular progresso da meta se quantidade estimada foi fornecida
  const getProgressPercentage = (current: number): number => {
    if (!estimatedQuantity || estimatedQuantity === "0") return 0
    const estimated = parseInt(estimatedQuantity) || 0
    if (estimated === 0) return 0
    return Math.min((current / estimated) * 100, 100)
  }

  // Calcular previsão de término baseado na velocidade atual
  const getEstimatedCompletion = (): string => {
    if (!estimatedQuantity || !startTime || stats.eggsPerHour === 0) return "Calculando..."
    
    const estimated = parseInt(estimatedQuantity) || 0
    const remaining = estimated - stats.currentCount
    
    if (remaining <= 0) return "Meta atingida!"
    
    // Calcular apenas se temos velocidade suficiente (mais de 10 minutos de dados)
    const now = new Date()
    const minutesElapsed = (now.getTime() - startTime.getTime()) / (1000 * 60)
    
    if (minutesElapsed < 3) return "Coletando dados..."
    
    const hoursToComplete = remaining / stats.eggsPerHour
    const hours = Math.floor(hoursToComplete)
    const minutes = Math.round((hoursToComplete - hours) * 60)
    
    // Formatar tempo de forma mais inteligente
    if (hoursToComplete < 0.1) {
      return "Menos de 6min"
    } else if (hours === 0) {
      return `${minutes}min`
    } else if (minutes === 0) {
      return `${hours}h`
    } else if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}d ${remainingHours}h`
    } else {
      return `${hours}h ${minutes}min`
    }
  }

  return (
    <div className="space-y-4">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Total Eggs Today */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(stats.totalEggsToday)}
              </p>
              <p className="text-xs text-blue-700 font-medium">Total Eggs Today</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Dozens */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(stats.totalDozens)}
              </p>
              <p className="text-xs text-green-700 font-medium">Total Dozens</p>
              <p className="text-xs text-green-600 mt-1">
                ({stats.totalEggsToday % 12} ovos para próxima dúzia)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Eggs per Hour */}
        <Card className="border-purple-200 bg-purple-50 md:col-span-1 col-span-2">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">
                {formatNumber(stats.eggsPerHour)}
              </p>
              <p className="text-xs text-purple-700 font-medium">Eggs per Hour</p>
              <p className="text-xs text-purple-600 mt-1">
                Velocidade atual
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso da meta estimada */}
      {estimatedQuantity && parseInt(estimatedQuantity) > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4 pb-3">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-900 mb-2">
                Progresso da Meta Estimada
              </p>
              <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
                <span>{formatNumber(stats.currentCount)}</span>
                <span>{formatNumber(parseInt(estimatedQuantity))}</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(stats.currentCount)}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                {getProgressPercentage(stats.currentCount).toFixed(1)}% concluído
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de linha */}
      <SimpleLineChart />
    </div>
  )
}