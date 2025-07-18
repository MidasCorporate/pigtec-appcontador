"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"

interface TerminalLine {
  id: string
  type: "command" | "output" | "error" | "system"
  content: string
  timestamp: Date
}

interface TerminalModalProps {
  equipmentName: string
  equipmentId: string
}

export function TerminalModal({ equipmentName, equipmentId }: TerminalModalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "1",
      type: "system",
      content: `Conectado ao ${equipmentName} (ID: ${equipmentId})`,
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "system",
      content: "Digite 'help' para ver os comandos disponíveis",
      timestamp: new Date(),
    },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isConnected, setIsConnected] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [lines])

  // Focus input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const addLine = (type: TerminalLine["type"], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setLines((prev) => [...prev, newLine])
  }

  const simulateCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim()

    // Simulate processing delay
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))
    setIsProcessing(false)

    switch (cmd) {
      case "help":
        addLine("output", "Comandos disponíveis:")
        addLine("output", "  status        - Mostra status do equipamento")
        addLine("output", "  camera        - Informações da câmera")
        addLine("output", "  count         - Última contagem realizada")
        addLine("output", "  network       - Status da rede")
        addLine("output", "  restart       - Reinicia o equipamento")
        addLine("output", "  logs          - Mostra logs recentes")
        addLine("output", "  config        - Configurações atuais")
        addLine("output", "  clear         - Limpa o terminal")
        addLine("output", "  disconnect    - Desconecta do equipamento")
        break

      case "status":
        addLine("output", "═══ STATUS DO EQUIPAMENTO ═══")
        addLine("output", `Nome: ${equipmentName}`)
        addLine("output", `ID: ${equipmentId}`)
        addLine("output", "Status: ONLINE")
        addLine("output", "CPU: 45% | RAM: 2.1GB/4GB | Temp: 42°C")
        addLine("output", "Uptime: 15d 8h 32m")
        addLine("output", "Última contagem: 2 minutos atrás")
        break

      case "camera":
        addLine("output", "═══ STATUS DA CÂMERA ═══")
        addLine("output", "Resolução: 1920x1080 @ 30fps")
        addLine("output", "Codec: H.264")
        addLine("output", "Qualidade: Boa (85%)")
        addLine("output", "Zoom: 1.0x | Foco: Auto")
        addLine("output", "Iluminação: Adequada")
        break

      case "count":
        const randomCount = Math.floor(Math.random() * 50) + 10
        addLine("output", "═══ ÚLTIMA CONTAGEM ═══")
        addLine("output", `Animais detectados: ${randomCount}`)
        addLine("output", "Confiança média: 92.5%")
        addLine("output", "Tempo de processamento: 1.2s")
        addLine("output", "Data/Hora: " + new Date().toLocaleString())
        break

      case "network":
        addLine("output", "═══ STATUS DA REDE ═══")
        addLine("output", "Interface: wlan0")
        addLine("output", "IP: 192.168.1.105")
        addLine("output", "Gateway: 192.168.1.1")
        addLine("output", "DNS: 8.8.8.8, 8.8.4.4")
        addLine("output", "Sinal WiFi: -45 dBm (Excelente)")
        addLine("output", "Velocidade: 150 Mbps")
        break

      case "restart":
        addLine("output", "Iniciando reinicialização do equipamento...")
        addLine("output", "Salvando configurações...")
        addLine("output", "Parando serviços...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        addLine("output", "Reiniciando sistema...")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        addLine("system", "Equipamento reiniciado com sucesso!")
        addLine("system", "Reconectando...")
        break

      case "logs":
        addLine("output", "═══ LOGS RECENTES ═══")
        addLine("output", "[2024-01-15 14:32:15] INFO: Contagem iniciada")
        addLine("output", "[2024-01-15 14:32:16] INFO: 23 animais detectados")
        addLine("output", "[2024-01-15 14:32:17] INFO: Processamento concluído")
        addLine("output", "[2024-01-15 14:30:45] WARN: Baixa luminosidade detectada")
        addLine("output", "[2024-01-15 14:28:12] INFO: Conexão WiFi estável")
        break

      case "config":
        addLine("output", "═══ CONFIGURAÇÕES ATUAIS ═══")
        addLine("output", "Threshold: 0.75")
        addLine("output", "Marcação automática: Habilitada")
        addLine("output", "Range de marcação: 35 animais")
        addLine("output", "Transmissão: Ativa")
        addLine("output", "Gravação local: Habilitada")
        break

      case "clear":
        setLines([
          {
            id: Date.now().toString(),
            type: "system",
            content: `Conectado ao ${equipmentName} (ID: ${equipmentId})`,
            timestamp: new Date(),
          },
        ])
        break

      case "disconnect":
        addLine("output", "Desconectando do equipamento...")
        setIsConnected(false)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        addLine("system", "Desconectado com sucesso.")
        break

      case "":
        // Empty command, do nothing
        break

      default:
        addLine("error", `Comando não reconhecido: ${command}`)
        addLine("output", "Digite 'help' para ver os comandos disponíveis")
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCommand.trim() || !isConnected || isProcessing) return

    // Add command to lines
    addLine("command", `$ ${currentCommand}`)

    // Add to history
    setCommandHistory((prev) => [...prev, currentCommand])
    setHistoryIndex(-1)

    // Execute command
    await simulateCommand(currentCommand)

    // Clear input
    setCurrentCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      }
    }
  }

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-blue-400"
      case "output":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "system":
        return "text-yellow-400"
      default:
        return "text-gray-300"
    }
  }

  const getLinePrefix = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return ""
      case "output":
        return "  "
      case "error":
        return "❌ "
      case "system":
        return "🔧 "
      default:
        return "  "
    }
  }

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] p-0">
      <DialogHeader className="px-6 py-4 border-b bg-gray-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Terminal - {equipmentName}</DialogTitle>
              <p className="text-sm text-gray-400">Sessão remota ativa</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
        </div>
      </DialogHeader>

      <div className="flex flex-col h-[500px] bg-gray-950 text-gray-100">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="font-mono text-sm space-y-1">
            {lines.map((line) => (
              <div key={line.id} className={`${getLineColor(line.type)} whitespace-pre-wrap`}>
                {getLinePrefix(line.type)}
                {line.content}
              </div>
            ))}
            {isProcessing && <div className="text-yellow-400 animate-pulse">🔄 Processando comando...</div>}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-blue-400 font-mono">$</span>
            <Input
              ref={inputRef}
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? "Digite um comando..." : "Desconectado"}
              disabled={!isConnected || isProcessing}
              className="flex-1 bg-transparent border-none text-gray-100 font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!isConnected || isProcessing || !currentCommand.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Executar
            </Button>
          </form>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>↑↓ Histórico</span>
            <span>Enter: Executar</span>
            <span>help: Comandos</span>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
