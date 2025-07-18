"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Flag {
  quantity: number
  sequence: number
  score_id: string
  weight: number
  id: string
  created_at: string
  updated_at: string
  gender: string
}

interface ModalWeightProps {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  flagsData: Flag[]
  setFlagsData: (flags: Flag[]) => void
  flagOpen: string
  setFlagOpen: (flag: string) => void
}

export function ModalWeight({
  modalVisible,
  setModalVisible,
  flagsData,
  setFlagsData,
  flagOpen,
  setFlagOpen,
}: ModalWeightProps) {
  const [weight, setWeight] = useState("")

  useEffect(() => {
    if (modalVisible && flagOpen) {
      const flag = flagsData.find((f) => f.sequence.toString() === flagOpen)
      if (flag) {
        setWeight(flag.weight.toString())
      }
    }
  }, [modalVisible, flagOpen, flagsData])

  const handleSave = () => {
    if (flagOpen) {
      const updatedFlags = flagsData.map((flag) => {
        if (flag.sequence.toString() === flagOpen) {
          return {
            ...flag,
            weight: Number(weight) || 0,
            updated_at: new Date().toISOString(),
          }
        }
        return flag
      })
      setFlagsData(updatedFlags)
    }
    setModalVisible(false)
    setFlagOpen("")
    setWeight("")
  }

  const handleClose = () => {
    setModalVisible(false)
    setFlagOpen("")
    setWeight("")
  }

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Peso da Marcação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Digite o peso"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
