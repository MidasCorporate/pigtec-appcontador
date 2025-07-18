import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AcordionProps {
  children?: React.ReactNode;
  title: string;
}

export function Acordion({ title, children }: AcordionProps) {
  return (
    
      <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="p-2">
         { children }

        </AccordionContent>
      </AccordionItem>
  )
}