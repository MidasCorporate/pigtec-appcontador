export type OrderStatus = 'not_found' | 'canceled' | 'happening' | 'finalized'

interface OrderStatusProps {
  status: OrderStatus
}

const orderStatusMap: Record<OrderStatus, string> = {
  not_found: 'Pendente',
  canceled: 'Cancelado',
  finalized: 'Finalizado',
  happening: 'Acontecendo',
}

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'not_found' && (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}

      {status === 'canceled' && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {status === 'finalized' && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}

      {['processing', 'happening'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      )}

      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  )
}
