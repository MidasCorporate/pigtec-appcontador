"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Camera, Play, FlagIcon, Square, Trash2, Save, RotateCcw, Plus, Minus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import type { CountingData } from "../index"
import { CounterDisplay } from "./counter-display"
import { FlagsList } from "./flags-list"
import { ModalWeight } from "./modal-weight"
import { CameraModal } from "./camera-modal"
import { useToast } from "@/hooks/use-toast"
import { showConfig } from "@/api/config/show"
import axios from "axios"
import { api } from "@/services/api"
import { EggStatistics } from "./egg-statistics"

interface CountState {
  total: number
  current: number
  acumuled: number
  male: number
  female: number
}

interface Config {
  id: string
  rout: string
  cfg: string
  name: string
  names: string
  weights: string
  rout_view_video: string
  mount_video: string
  is_selected_view_video: string
  marking_automatic: string
  range_for_marking: string
  threshold: string
  stream: boolean
  view_camera: boolean
  description: string
  // Legacy fields for backward compatibility
  routViewVideo?: string
  mountVideo?: string
  isSelectedViewVideo?: boolean
  markingAutomatic?: "not" | "yes"
  rangeForMarking?: string
  viewCamera?: boolean
}

interface Counting {
  type: string
  lote: string
  name: string
  productorid: string
  farmId: string
  balance: string
  qtdCounting: number
  productorName: string
}

interface CountingScreenProps {
  data: CountingData
  onReturn: () => void
}

export function CountingScreen({ data, onReturn }: CountingScreenProps) {
  const { toast } = useToast()

  const [countState, setCountState] = useState<CountState>({
    total: 0,
    current: 0,
    acumuled: 0,
    male: 0,
    female: 0,
  })

  const [textHeader, setTextHeader] = useState("Pronto para iniciar")
  const [sex, setSex] = useState<"male" | "female">("male")
  const [flagsData, setFlagsData] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const [flagOpen, setFlagOpen] = useState("")
  const [qtdTotalVisualise, setQtdTotalVisualize] = useState(1)
  const [weight, setWeight] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRoud, setLoadingRoud] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [coutingId, setCoutingId] = useState("")
  const [loteFormated, setLotFormated] = useState("")
  const [dataConfig, setDataConfigs] = useState<Config | null>(null)
  const [url, setUrl] = useState("")
  const [countingStartTime, setCountingStartTime] = useState<Date | null>(null)

  const socket = useRef<WebSocket | null>(null)
  const sexRef = useRef(sex)

  // Get config_id from localStorage
  const getConfigId = () => {
    const userData = localStorage.getItem("@pigtek:user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        return user.config_id
      } catch (error) {
        console.error("Error parsing user data:", error)
        return null
      }
    }
    return null
  }

  // Fetch configuration from API
  const { data: configData, isLoading: configLoading, error: configError } = useQuery({
    queryKey: ["config", getConfigId()],
    queryFn: () => {
      const configId = getConfigId()
      if (!configId) {
        throw new Error("No config_id found in localStorage")
      }
      return showConfig({ config_id: configId })
    },
    enabled: !!getConfigId(),
    retry: 1
  })

  useEffect(() => {
    sexRef.current = sex
  }, [sex])

  useEffect(() => {
    handleVerifyLot()
  }, [data.lote])

  // Effect to handle configuration data from API
  useEffect(() => {
    if (configData) {
      loadConfigurations(configData)
    }
    // else if (configError) {
    //   // Fallback to localStorage or default config if API fails
    //   loadConfigurationsFromStorage()
    // }
  }, [configData, configError])

  const loadConfigurations = (apiConfig: Config) => {
    // Transform API config to internal format with backward compatibility
    const transformedConfig: Config = {
      ...apiConfig,
      // Map new field names to legacy ones for backward compatibility
      routViewVideo: apiConfig.rout_view_video,
      mountVideo: apiConfig.mount_video,
      isSelectedViewVideo: apiConfig.is_selected_view_video === "true" || apiConfig.is_selected_view_video === "1",
      markingAutomatic: apiConfig.marking_automatic === "yes" ? "yes" : "not",
      rangeForMarking: apiConfig.range_for_marking,
      viewCamera: apiConfig.view_camera,
    }
    console.log("Loaded configuration:", transformedConfig)
    setDataConfigs(transformedConfig)

    // Set URL based on route from config
    if (apiConfig.rout) {
      setUrl(`http://${apiConfig.rout.slice(0, -5)}:8080/bgr`)
    }
  }

  // const loadConfigurationsFromStorage = () => {
  //   // Fallback: Load configurations from localStorage
  //   const savedConfig = localStorage.getItem("@DataConfig")
  //   const savedRoute = localStorage.getItem("@DataConfigRoute")

  //   if (savedConfig && savedRoute) {
  //     try {
  //       const configData: Config = JSON.parse(savedConfig)
  //       setDataConfigs(configData)
  //       setUrl(`http://${savedRoute.slice(0, -5)}:8080/bgr`)
  //     } catch (error) {
  //       console.error("Error parsing saved config:", error)
  //       setDefaultConfiguration()
  //     }
  //   } else {
  //     setDefaultConfiguration()
  //   }
  // }

  // const setDefaultConfiguration = () => {
  //   // Default configuration
  //   const defaultConfig: Config = {
  //     id: "",
  //     rout: "",
  //     cfg: "default.cfg",
  //     name: "Default Configuration",
  //     names: "names.txt",
  //     weights: "weights.txt",
  //     rout_view_video: "/videos",
  //     mount_video: "/mount",
  //     is_selected_view_video: "false",
  //     marking_automatic: "not",
  //     range_for_marking: "10",
  //     threshold: "0.5",
  //     stream: true,
  //     view_camera: true,
  //     description: "Default configuration",
  //     // Legacy fields
  //     routViewVideo: "/videos",
  //     mountVideo: "/mount",
  //     isSelectedViewVideo: false,
  //     markingAutomatic: "not",
  //     rangeForMarking: "10",
  //     viewCamera: true,
  //   }
  //   setDataConfigs(defaultConfig)
  // }

  const handleVerifyLot = async () => {
    if (textHeader === "Pronto para iniciar") {
      // Get existing scores from localStorage
      const existingScores = JSON.parse(localStorage.getItem("@Scores") || "[]")

      if (existingScores.length > 0) {
        const formated = existingScores.filter((score: any) => {
          return score.lote.split("/")[0] === data.lote
        })
        setLotFormated(`${data.lote}/${formated.length + 1}`)
      } else {
        setLotFormated(`${data.lote}/1`)
      }
    }
  }

  const toggleSex = () => {
    setSex((prevSex) => (prevSex === "male" ? "female" : "male"))
  }

  const updateCounts = (newCount: number) => {
    setCountState((prev) => {
      const diff = newCount - prev.total
      return {
        total: newCount,
        current: prev.current + diff,
        acumuled: prev.acumuled + diff,
        male: sexRef.current === "male" ? prev.male + diff : prev.male,
        female: sexRef.current === "female" ? prev.female + diff : prev.female,
      }
    })
  }

  const createWebSocket = async () => {
    try {
      // Use route from API config or fallback to localStorage
      const route = dataConfig?.rout
      console.log('Creating WebSocket with route:', route)
      if (route && route !== "") {
        socket.current = new WebSocket(`ws://${route}/`)

        socket.current.onopen = () => {
          console.log("Conexão estabelecida com o servidor WebSocket")
        }

        socket.current.onmessage = async (event) => {
          const dataArray = event.data.split(" ")

          if (dataArray[0] === "scaleData") {
            setWeight(dataArray[1].replace(/(\r\n|\n|\r)/gm, ";").split(";")[20])
          }

          if (dataArray[0] === "data") {
            if (dataArray[3] === "counting" && dataArray[4] && dataArray[5] !== "Contagem em andamento") {
              setCoutingId(dataArray[4])
              setTextHeader("Contagem em andamento")
              setIsLoading(true)

              // Load existing flags
              const flags = JSON.parse(localStorage.getItem("@Flags") || "[]")
              if (flags.length > 0) {
                const flagsFiltred = flags.filter((flag: any) => flag.score_id === dataArray[4])
                setFlagsData(flagsFiltred)
              }
            }

            const newCount = Number.parseInt(dataArray[1], 10)
            updateCounts(newCount)
          }

          if (dataArray[0] === "station_started" && socket.current) {
            socket.current.send("startCounting")
            setTextHeader("Contagem em andamento")
            setIsLoading(true)
            setLoadingRoud(false)
          }

          if (dataArray[0] === "finalized" && socket.current) {
            setTextHeader("Contagem finalizada")
            setIsLoading(false)
            setLoadingRoud(false)
          }

          if (dataArray[0] === "program_finalized" && socket.current) {
            setTextHeader("Contagem finalizada")
            setIsLoading(false)
            setLoadingRoud(false)
            socket.current.close()
          }
        }

        socket.current.onclose = () => {
          console.log("Conexão WebSocket fechada")
          socket.current = null
        }

        socket.current.onerror = (error) => {
          console.error("Erro WebSocket:", error)
          toast({
            title: "Erro de Conexão",
            description: "Falha na conexão WebSocket",
            variant: "destructive",
          })
        }
      }
    } catch (e) {
      console.log("Erro createWebSocket", e)
    }
  }

  const checkBalance = async () => {
    if (data.balance === "online") {
      try {
        // Simulate balance check API call
        const response = await fetch("/api/activitie-balance")
        if (!response.ok) {
          throw new Error("Balance connection failed")
        }
      } catch (err) {
        console.log("Erro balance:", err)
        toast({
          title: "Falha na balança",
          description: "Verifique a conexão com a balança!",
          variant: "destructive",
        })
        setLoadingRoud(false)
        return false
      }
    }
    return true
  }

  const handleStartProgram = async () => {
    try {
      const idScores = crypto.randomUUID()
      setLoadingRoud(true)
      setCoutingId(idScores)
      setCountingStartTime(new Date())

      // const balanceOk = await checkBalance()
      // if (!balanceOk) return

      const scoreData = {
        id: idScores,
        // producer_id_internal: "user_producer_id",
        // farm_id_internal: "user_id",
        type: data.type,
        lote: loteFormated,
        name: data.name,
        // producer_id_sender: "user_producer_id",
        // farm_id_sender: "user_id",
        // producer_id_received: data.productorid || null,
        // farm_id_received: data.farmId || null,
        progress: "not_found",
        quantity: 0,
        weight: "0",
        start_date: new Date().toISOString(),
        status: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        markings: [],
        male: "0",
        female: "0",
      }

      // Simulate API call to start counting
      // if (balance === 'online') {
      //   try {
      //     await api.get('/activitie-balance').then((res) => {
      //       console.log('RESPOSTA: ', res)
      //     })
      //   } catch (err) {
      //     console.log('Erro handleRoudProgram:', err);
      //     Alert.alert('Falha na balança', 'Verifique a conexão com a balança!.');
      //     setLoadingRoud(false);
      //     return;
      //   }
      // }

      await axios
        .get(`http://${dataConfig?.rout}/spawn`, {
          params: {
            cfg: dataConfig?.cfg,
            names: dataConfig?.names,
            weights: dataConfig?.weights,
            saveVideo: dataConfig?.isSelectedViewVideo,
            roteViewVideo: dataConfig?.routViewVideo,
            mountVideo: dataConfig?.mountVideo,
            // scaleRout: dataConfig?.scaleRout,
            threshold: dataConfig?.threshold,
            stream: dataConfig?.stream,
            typeContage: data.typeContage,
            qtdCurrent: 0,
            viewCamera: dataConfig?.viewCamera,

            balance: data.balance,
            idScores,
          },
        })

        .then(async (response) => {
          try {
            if (response.status === 200) {
              // storageScorsSave({
              //   ...scoreData,
              //   male: "0",
              //   female: "0"
              // })
              // if (digitalOnline) {
              //   console.log('2-Salvando no banco online')
              await api
                .post('/scores', scoreData)

              //       handleSaveLocal({ score });
              //       setTimeout(async () => {
              //         await axios.get('https://node.pigtek.com.br/scores/validate');
              //       }, 3000)
              //     });
            }
            //  else {
            //   handleSaveLocal(scoreData);
            // }


          } catch (err) {
            console.log('Erro handleRoudProgram: ', err)
            // const score = {
            //   ...scoreData.score,
            //   status: false,
            // };
            // handleSaveLocal({ score });
          }
        });
      createWebSocket();


    } catch (err) {
      toast({
        title: "Falha na conexão",
        description: "Verifique a conexão com o contador.",
        variant: "destructive",
      })
      setLoadingRoud(false)
    } finally {
      setLoadingRoud(false)
    }
  }

  const handleStopProgram = async () => {
    try {
      await axios.post(`http://${dataConfig?.rout}/terminateProgram`).then((res) => {
        if (res.status === 200) {
          setTextHeader("Contagem finalizada")
          setIsLoading(false)
          setLoadingRoud(false)
        }
      })

    } catch (err) {
      console.log("err", err)
      // Fallback to local state change
      setTextHeader("Contagem finalizada")
      setIsLoading(false)
      setLoadingRoud(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoadingSave(true)

      const weightTotal = flagsData.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(currentValue.weight)
      }, 0)

      const dataScore = {
        id: coutingId,
        quantity: countState.acumuled,
        weight: weightTotal,
        progress: "finalized",
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        markings: JSON.stringify(flagsData),
        status: true,
        male: String(countState.male),
        female: String(countState.female),
      }

      try {
        await api
          .put(`/scores?id=${coutingId}`, dataScore)


        await api.post(
          `/markings/createAll`,
          flagsData
        );
      } catch (err) {
        console.log("Erro ao atualizar dados:", err);
      }

      // Update score in localStorage
      const existingScores = JSON.parse(localStorage.getItem("@Scores") || "[]")
      const updatedScores = existingScores.map((score: any) => {
        if (score.id === coutingId) {
          return { ...score, ...dataScore }
        }
        return score
      })
      localStorage.setItem("@Scores", JSON.stringify(updatedScores))

      // Clear flags and reset state
      localStorage.removeItem("@Flags")
      setTextHeader("Pronto para iniciar")
      setFlagsData([])
      setCountState({
        total: 0,
        acumuled: 0,
        current: 0,
        female: 0,
        male: 0,
      })
      setCountingStartTime(null)

      toast({
        title: "Contagem salva",
        description: "Contagem salva com sucesso!",
      })
    } catch (err) {
      console.log("Erro handleSave", err)
      toast({
        title: "Erro",
        description: "Problemas ao salvar a contagem!",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingRoud(false)
      setLoadingSave(false)
    }
  }

  const handleDeleteCount = async () => {
    try {
      setIsLoading(true)

      if (coutingId !== "") {
        // Remove from localStorage
        const existingScores = JSON.parse(localStorage.getItem("@Scores") || "[]")
        const filteredScores = existingScores.filter((score: any) => score.id !== coutingId)
        localStorage.setItem("@Scores", JSON.stringify(filteredScores))

        setTextHeader("Pronto para iniciar")
        setFlagsData([])
        localStorage.removeItem("@Flags")
        setCountState({
          total: 0,
          acumuled: 0,
          current: 0,
          female: 0,
          male: 0,
        })
        setCountingStartTime(null)
        setLoadingRoud(false)

        toast({
          title: "Contagem excluída",
          description: "Contagem excluída com sucesso!",
        })
      }
    } catch (err) {
      console.log("ERRO:", err)
      toast({
        title: "Erro ao excluir",
        description: "Problemas ao excluir a contagem!",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueProgram = async () => {
    try {
      setLoadingRoud(true)
      setLoadingSave(true)

      await axios
        .get(`http://${dataConfig?.rout}/spawn`, {
          params: {
            cfg: dataConfig?.cfg,
            names: dataConfig?.names,
            weights: dataConfig?.weights,
            saveVideo: dataConfig?.isSelectedViewVideo,
            roteViewVideo: dataConfig?.routViewVideo,
            mountVideo: dataConfig?.mountVideo,
            threshold: dataConfig?.threshold,
            stream: dataConfig?.stream,
            typeContage: data.typeContage,
            qtdCurrent: countState.acumuled,
            viewCamera: dataConfig?.viewCamera,
            balance: data.balance,
            idScores: coutingId,
          },
        })

      setTextHeader("Contagem em andamento")
      createWebSocket()
    } catch (err) {
      console.log("Erro handleContinueProgram", err)
    } finally {
      setLoadingRoud(false)
      setLoadingSave(false)
    }
  }

  const handleResetEggCountsToday = () => {
    try {
      localStorage.removeItem("@EggCountsToday")
      toast({
        title: "Reset realizado",
        description: "Contagens de ovos do dia foram resetadas!",
      })
    } catch (error) {
      console.error("Error resetting egg counts:", error)
      toast({
        title: "Erro",
        description: "Erro ao resetar contagens do dia!",
        variant: "destructive",
      })
    }
  }

  const handleSetQuantityCount = (type: "add" | "remove") => {
    setCountState((prev) => {
      if (type === "add") {
        return {
          ...prev,
          acumuled: prev.acumuled + 1,
          current: prev.current + 1,
          male: sex === "male" ? prev.male + 1 : prev.male,
          female: sex === "female" ? prev.female + 1 : prev.female,
        }
      } else if (type === "remove") {
        return {
          ...prev,
          acumuled: prev.acumuled > 0 ? prev.acumuled - 1 : 0,
          current: prev.current > 0 ? prev.current - 1 : 0,
          male: sex === "male" && prev.male > 0 ? prev.male - 1 : prev.male,
          female: sex === "female" && prev.female > 0 ? prev.female - 1 : prev.female,
        }
      }
      return prev
    })

    if (type === "add") {
      socket.current?.send("add")
    } else if (type === "remove") {
      socket.current?.send("subtract")
    }
  }

  const handleCreateFlag = async () => {
    try {
      const idMarkings = crypto.randomUUID()
      if (countState.total >= 0) {
        const newFlag = {
          quantity: countState.current,
          sequence: flagsData.length + 1,
          weight: data.balance === "online" ? Number(weight) : 0,
          score_id: coutingId,
          id: idMarkings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          gender: sexRef.current,
        }

        const updatedFlags = [...flagsData, newFlag]
        setFlagsData(updatedFlags)
        localStorage.setItem("@Flags", JSON.stringify(updatedFlags))

        setCountState((prev) => ({
          ...prev,
          current: 0,
        }))
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Problemas ao acessar balança!",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFlag = (flagSequence: number) => {
    const filtred = flagsData.filter((item) => item.sequence !== flagSequence)
    setFlagsData(filtred)
    localStorage.setItem("@Flags", JSON.stringify(filtred))
  }

  const handleOpenModal = useCallback(
    (sequence: string) => {
      setModalVisible(!modalVisible)
      setFlagOpen(sequence)
    },
    [modalVisible],
  )

  const handleVisualiseQtdTotal = () => {
    if (qtdTotalVisualise <= 2) {
      setQtdTotalVisualize(qtdTotalVisualise + 1)
    } else {
      setQtdTotalVisualize(1)
    }
  }

  // Automatic marking effect
  useEffect(() => {
    if (dataConfig?.markingAutomatic === "yes" || dataConfig?.marking_automatic === "yes") {
      const rangeForMarking = dataConfig.rangeForMarking || dataConfig.range_for_marking
      if (rangeForMarking && countState.total % Number(rangeForMarking) === 0 && countState.total > 0) {
        handleCreateFlag()
      }
    }
  }, [countState.total, dataConfig])

  const getCounterDisplayVariant = () => {
    switch (qtdTotalVisualise) {
      case 1:
        return "current"
      case 2:
        return "difference"
      case 3:
        return "total"
      default:
        return "current"
    }
  }

  const getCounterDisplayValue = () => {
    switch (qtdTotalVisualise) {
      case 1:
        return countState.current
      case 2:
        return countState.acumuled - Number(data.qtdCounting || 0)
      case 3:
        return countState.acumuled
      default:
        return countState.current
    }
  }

  const getStatusColor = () => {
    switch (textHeader) {
      case "Pronto para iniciar":
        return "text-muted-foreground"
      case "Contagem em andamento":
        return "text-green-600"
      case "Contagem finalizada":
        return "text-orange-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onReturn}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              {data.isEggCounting && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetEggCountsToday}
                  title="Reset contagens do dia"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              {(dataConfig?.viewCamera || dataConfig?.view_camera) && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={textHeader !== "Contagem em andamento"}
                  onClick={() => setCameraVisible(true)}
                >
                  <Camera className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {configLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Carregando configuração...</span>
            </div>
          </div>
        )}

        {configError && !dataConfig && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar configuração</p>
              <p className="text-sm text-muted-foreground">Usando configuração padrão</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Project Info */}
          {data.type === "destination_with_count" && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-lg font-medium">
                  Lote: {loteFormated} - {data.productorName}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status */}
          <div className="text-center">
            <p className={`text-xl font-semibold ${getStatusColor()}`}>{textHeader}</p>
          </div>

          {/* Counter Display */}
          <div className="flex justify-center">
            <CounterDisplay
              value={getCounterDisplayValue()}
              variant={getCounterDisplayVariant()}
              onPress={handleVisualiseQtdTotal}
            />
          </div>

          {/* Egg Statistics - Only show for egg counting */}
          {data.isEggCounting && (
            <EggStatistics 
              totalCount={countState.acumuled} 
              startTime={countingStartTime}
              estimatedQuantity={data.qtdCounting}
            />
          )}

          {/* Weight Display */}
          {data.balance === "online" && (
            <div className="flex justify-center">
              <CounterDisplay value={weight === undefined ? "-/-" : weight} variant="weight" />
            </div>
          )}

          {/* Statistics */}
          {data.isEggCounting ? (
            /* Para contagem de ovos, mostrar apenas o total */
            <div className="flex justify-center">
              <Card className="w-full max-w-xs">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{countState.acumuled.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">Total de Ovos</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Para outras contagens, mostrar total, machos e fêmeas */
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{countState.acumuled}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{countState.male}</p>
                  <p className="text-sm text-muted-foreground">♂ Machos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{countState.female}</p>
                  <p className="text-sm text-muted-foreground">♀ Fêmeas</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flags List */}
          <FlagsList flags={flagsData} onFlagPress={handleOpenModal} onFlagDelete={handleDeleteFlag} />

          {/* Manual Controls */}
          {textHeader === "Contagem em andamento" && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="lg" onClick={() => handleSetQuantityCount("remove")}>
                    <Minus className="h-6 w-6" />
                  </Button>

                  {/* Só mostrar seleção de sexo se não for contagem de ovos */}
                  {!data.isEggCounting && (
                    <Button
                      variant={sex === "male" ? "default" : "outline"}
                      onClick={toggleSex}
                      className="min-w-[120px]"
                    >
                      {sex === "male" ? "Macho" : "Fêmea"}
                    </Button>
                  )}

                  <Button variant="outline" size="lg" onClick={() => handleSetQuantityCount("add")}>
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="border-t bg-card p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center gap-4">
            {textHeader === "Pronto para iniciar" && (
              <Button
                onClick={handleStartProgram}
                disabled={loadingRoud || configLoading || !dataConfig}
                size="lg"
                className="min-w-[120px]"
              >
                {loadingRoud ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </div>
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            )}

            {textHeader === "Contagem em andamento" && (
              <>
                <Button variant="outline" onClick={handleCreateFlag}>
                  <FlagIcon className="h-4 w-4" />
                </Button>

                <Button variant="outline" onClick={handleStopProgram}>
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}

            {textHeader === "Contagem finalizada" && (
              <>
                <Button variant="destructive" onClick={handleDeleteCount} disabled={isLoading}>
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                <Button variant="outline" onClick={handleContinueProgram} disabled={loadingRoud}>
                  {loadingRoud ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                </Button>

                <Button onClick={handleSave} disabled={loadingSave}>
                  {loadingSave ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </footer>

      <ModalWeight
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        flagsData={flagsData}
        setFlagsData={setFlagsData}
        flagOpen={flagOpen}
        setFlagOpen={setFlagOpen}
      />

      <CameraModal isOpen={cameraVisible} onClose={() => setCameraVisible(false)} url={url} />
    </div>
  )
}
