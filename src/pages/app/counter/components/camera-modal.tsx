"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

export function CameraModal({ isOpen, onClose, url }: CameraModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Visualização da Câmera
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center h-96 bg-muted rounded-lg">
          {url ? (
            <iframe src={url} className="w-full h-full rounded-lg" title="Camera Feed" />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">Câmera não configurada</p>
              <p className="text-sm text-muted-foreground mt-2">Configure a URL da câmera nas configurações</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
