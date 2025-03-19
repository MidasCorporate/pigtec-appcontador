import { useQuery } from '@tanstack/react-query'
import { DollarSign, Video } from 'lucide-react'

import { getMonthRevenuesAmount } from '@/api/get-month-revenue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export function CardEquipaments() {

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Equipamento de contagem
        </CardTitle>
        <Video className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">

        <>
          <span className="text-2xl font-bold tracking-tighter">
            Contador pigtec 01
          </span>
          <p className="text-xs text-muted-foreground">


            Equipamento destinado a contagem de Carregamentos, Maternidade e Recria.

          </p>
        </>

      </CardContent>
    </Card>
  )
}
