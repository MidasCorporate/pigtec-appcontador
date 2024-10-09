/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable spaced-comment */
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { getOrders } from '@/api/get-pig-scores'
import { UnifiqScors } from '@/api/Unifiq-scors'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { OrderTableFilter } from './order-table-filter'
import { OrderTableRow } from './order-table-row'
import { OrderTableSkeleton } from './order-table-skeleton'

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [arrayScores, setArrayScores] = useState<string[]>([])

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page + 1)
    // .parse(searchParams.get('1'))
    //@ts-ignore
    .parse(searchParams.get('page' ?? '1'))

  const {
    data: result,
    isLoading: isLoadingOrders,
    refetch,
  } = useQuery({
    queryKey: ['scors', pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customerName,
        status: status === 'all' ? null : status,
      }),
  })
  function handlePaginate(page: number) {
    setSearchParams((state) => {
      state.set('page', page.toString())

      return state
    })
  }

  const { mutateAsync: joined } = useMutation({
    mutationFn: UnifiqScors,
    onSuccess: () => {
      refetch()
      toast.success('Contagem unificada!')
    },
  })

  const handleUnifiqueScores = () => {
    try {
      joined(arrayScores)
      setArrayScores([])
    } catch (err) {
      console.log('eeeroorr', err)
    }
  }

  return (
    <>
      <Helmet title="Contagens" />
      <div className="flex flex-col gap-4">
        <h1>Contagens</h1>

        <div className="space-y-2.5">
          <OrderTableFilter />

          <div className={arrayScores.length > 1 ? '' : 'hidden'}>
            <span>Unificar contagens? </span>
            <Button
              onClick={handleUnifiqueScores}
              size="xs"
              variant="destructive"
            >
              Unificar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]">selec</TableHead>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[140px]">Lote</TableHead>
                  <TableHead className="w-[180px]">Iniciado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead className="w-[140px]">Total da contagem</TableHead>
                  {/* <TableHead className="w-[164px]"></TableHead> */}
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingOrders && <OrderTableSkeleton />}

                {result &&
                  result.scores.map((score) => {
                    return (
                      <OrderTableRow
                        key={score.id}
                        scores={score}
                        setArrayScores={setArrayScores}
                        arrayScores={arrayScores}
                      />
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={result.pagination.page}
              totalCount={result.pagination.total}
              perPage={result.pagination.take}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
