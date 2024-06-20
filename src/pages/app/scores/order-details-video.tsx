import { useQuery } from '@tanstack/react-query'

import { getScorDetails } from '@/api/get-scor-details'
// import { OrderStatus } from '@/components/order-status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { OrderDetailsSkeleton } from './order-details-skeleton'

export interface OrderDetailsProps {
  scorId: string
  openVideo: boolean
}

export function OrderDatailsVideo({ scorId, openVideo }: OrderDetailsProps) {
  const { data: scor } = useQuery({
    queryKey: ['scor', scorId],
    queryFn: () => getScorDetails({ scorId }),
    enabled: openVideo,
  })

  // if (!order) {
  //   return null
  // }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Contagem: {scorId}</DialogTitle>
        <DialogDescription>Detalhes da contagem</DialogDescription>
      </DialogHeader>

      {scor ? (
        <div className="items-center p-8">
          <video src={scor.file_url} autoPlay controls className="rounded-md" />
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  )
}
