import { ReactNode } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Edit, Plus } from "lucide-react"

interface Props {
  isOpen: boolean
  handleSetOpen: (open: boolean) => void
  textButton: string
  children: ReactNode
  type?: string
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
}

export function DialogTriggerContainer({ isOpen, handleSetOpen, children, textButton, type, variant, ...restBtn }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={handleSetOpen}>
    <DialogTrigger asChild>
      <Button
          variant={variant ? variant : "outline"}
          size="sm"
          {...restBtn}
        >
          {type === 'create' ? (
             <Plus className="mr-2 h-3 w-3" />
          ) : (
            <>
            <Edit className="mr-2 h-3 w-3" />
            </>
          )}
        {textButton}
      </Button>
    </DialogTrigger>

    {children}
  </Dialog>
  )
}