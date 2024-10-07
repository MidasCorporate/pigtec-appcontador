import { Checkbox } from '@radix-ui/react-checkbox'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, Video } from 'lucide-react'
import { useState } from 'react'

// import { approveOrder } from '@/api/approve-order'
// import { deliverOrder } from '@/api/deliver-order'
// import { dispatchOrder } from '@/api/dispatch-order'
// import { GetScores } from '@/api/get-pig-scores'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import { OrderDetails } from './order-details'
import { OrderDatailsVideo } from './order-details-video'

// export interface OrderTableRowProps {
//   order: {
//     orderId: string
//     createdAt: string
//     status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
//     customerName: string
//     total: number
//   }
// }

export interface ScoresTableRowProps {
  scores: {
    id: string
    start_date: string
    weight: string
    quantity: string
    lote: string
    name: string
    type: string
    progress: 'not_found' | 'canceled' | 'finalized' | 'happening'
    status: boolean
    created_at: string
    farmSender: {
      id: string
      name: string
    }
    farmReceived: {
      id: string
      name: string
    }
    farmInternal: {
      id: string
      name: string
    }
  }
}

export function OrderTableRow({ scores }: ScoresTableRowProps) {
  const [isDetailsOpen, setDetailsOpen] = useState(false)
  const [isDetailsOpenVideo, setDetailsOpenVideo] = useState(false)
  // const queryClient = useQueryClient()

  // function updateOrderStatusOnCache(
  //   scorId: string,
  //   progress: 'not_found' | 'canceled' | 'finalized' | 'happening',
  // ) {
  //   const cache = queryClient.getQueriesData<GetScores>({
  //     queryKey: ['scors'],
  //   })
  //   cache.forEach(([cacheKey, cacheData]) => {
  //     if (!cacheData) {
  //       return
  //     }
  //     queryClient.setQueryData<GetScores>(cacheKey, {
  //       ...cacheData,
  //       scores: cacheData.scores.map((scor) => {
  //         if (scor.id === scorId) {
  //           return { ...scor, progress }
  //         }

  //         return scor
  //       }),
  //     })
  //   })
  // }

  // const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
  //   useMutation({
  //     mutationFn: cancelOrder,
  //     async onSuccess(_, { orderId }) {
  //       updateOrderStatusOnCache(orderId, 'canceled')
  //     },
  //   })

  // const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
  //   useMutation({
  //     mutationFn: approveOrder,
  //     async onSuccess(_, { orderId }) {
  //       updateOrderStatusOnCache(orderId, 'not_found')
  //     },
  //   })

  // const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
  //   useMutation({
  //     mutationFn: dispatchOrder,
  //     async onSuccess(_, { orderId }) {
  //       updateOrderStatusOnCache(orderId, 'happening')
  //     },
  //   })

  // const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
  //   useMutation({
  //     mutationFn: deliverOrder,
  //     async onSuccess(_, { orderId }) {
  //       updateOrderStatusOnCache(orderId, 'finalized')
  //     },
  //   })
  return (
    <TableRow>
      <TableCell>
        <Checkbox id="terms" />
      </TableCell>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da contagem</span>
            </Button>
          </DialogTrigger>

          <OrderDetails scorId={scores.id} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {scores.id}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {scores.lote}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(scores.created_at, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={scores.progress} />
      </TableCell>
      <TableCell className="font-meduim">{scores.name}</TableCell>
      <TableCell className="font-medium">
        {/* {(Number(scores.weight) / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })} */}
        {scores.quantity}
      </TableCell>
      {/* <TableCell>
        {scores.progress === 'happening' && (
          <Button
            onClick={() => approveOrderFn({ orderId: scores.id })}
            disabled={isApprovingOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Aprovar
          </Button>
        )}
        {scores.progress === 'not_found' && (
          <Button
            onClick={() => dispatchOrderFn({ orderId: scores.id })}
            disabled={isDispatchingOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Em entrega
          </Button>
        )}
        {scores.progress === 'happening' && (
          <Button
            onClick={() => deliverOrderFn({ orderId: scores.id })}
            disabled={isDeliveringOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Em entrega
          </Button>
        )}
      </TableCell> */}
      <TableCell>
        <Dialog open={isDetailsOpenVideo} onOpenChange={setDetailsOpenVideo}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Video className="mr-1 h-3 w-3" />
              Visualizar
            </Button>
          </DialogTrigger>

          <OrderDatailsVideo
            scorId={scores.id}
            openVideo={isDetailsOpenVideo}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
