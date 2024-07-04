import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ReactPlayer from 'react-player'

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
  const [error, setError] = useState(false)
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
          {/* <video src={scor.file_url} autoPlay controls className="rounded-md" />  http://167.71.20.221:82/live/df1d7b31-2e78-4c97-baf6-e28d8e7da75c.flv */}
          {error ? (
            <p>Problemas para reproduzir o video!</p>
          ) : (
            <ReactPlayer
              style={{ maxWidth: 400, margin: 0 }}
              url={scor.file_url}
              controls
              playing
              onError={() => setError(true)}
            />
          )}
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  )
}
