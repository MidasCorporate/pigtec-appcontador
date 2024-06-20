import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import QRCode from 'qrcode.react'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { z } from 'zod'

import { getScorDetails, GetScorDetailsResponse } from '@/api/get-scor-details'
import { updateScor } from '@/api/update-scor'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { handleFormatDate } from '@/utils/farmatDate'

import { OrderDetailsSkeleton } from './order-details-skeleton'

export interface OrderDetailsProps {
  scorId: string
  open: boolean
}

const scorSchema = z.object({
  nfe: z.string().min(1),
  gta: z.string().min(1),
})
type ScorSchema = z.infer<typeof scorSchema>

export function OrderDetails({ scorId, open }: OrderDetailsProps) {
  const queryClient = useQueryClient()
  const { data: scor } = useQuery({
    queryKey: ['scor', scorId],
    queryFn: () => getScorDetails({ scorId }),
    enabled: open,
  })

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  const { mutateAsync: updateScorFn } = useMutation({
    mutationFn: updateScor,
    onMutate({ nfe, gta }) {
      const { cached } = updateScorCache({ nfe, gta })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateScorCache(context.previousProfile)
      }
    },
  })

  function updateScorCache({ nfe, gta }: ScorSchema) {
    const cached = queryClient.getQueryData<GetScorDetailsResponse>(['scor'])

    if (cached) {
      queryClient.setQueryData(['scor'], {
        ...cached,
        nfe,
        gta,
      })
    }

    return { cached }
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm<ScorSchema>({
    resolver: zodResolver(scorSchema),
    values: {
      gta: scor?.gta ?? '',
      nfe: scor?.nfe ?? '',
    },
  })

  async function handleUpdateScor(data: ScorSchema) {
    try {
      await updateScorFn({
        gta: data.gta || '',
        nfe: data.nfe || '',
        id: scor?.id || '',
      })
      toast.success('Contagem atualizado com sucesso!')
    } catch {
      toast.error('Falha ao atualizar a contagem, tente novamente')
    }
  }

  const weightTotalMale = useMemo(() => {
    const weight = scor?.markings
      .filter((a) => a.gender === 'male')
      .reduce((a, b) => {
        return Number(a) + Number(b.weight)
      }, 0)
      .toFixed(2)
    return weight
  }, [scor])
  console.log('eeeeeee', weightTotalMale)
  const weightTotalFemale = useMemo(() => {
    const weight = scor?.markings
      .filter((a) => a.gender === 'female')
      .reduce((a, b) => {
        return Number(a) + Number(b.weight)
      }, 0)
      .toFixed(2)
    return weight
  }, [scor])

  return (
    <DialogContent className="scrollbar-hide mt-6 max-h-[42rem] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Contagem: {scorId}</DialogTitle>
        <DialogDescription>Detalhes da contagem</DialogDescription>
      </DialogHeader>

      {scor ? (
        <div className="card space-y-6" ref={printRef}>
          <form onSubmit={handleSubmit(handleUpdateScor)}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Início
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {handleFormatDate(scor.start_date)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Fim</TableCell>
                  <TableCell className="flex justify-end">
                    {handleFormatDate(scor.end_date)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Lote contagem
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {scor.lote}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">NF</TableCell>
                  <TableCell className="flex justify-end">
                    {scor.nfe === null ? (
                      <>
                        <Input
                          className="no-print col-span-3 max-w-20"
                          id="nfe"
                          {...register('nfe')}
                        />
                      </>
                    ) : (
                      scor.nfe
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">GTA</TableCell>
                  <TableCell className="flex justify-end">
                    {' '}
                    {scor.gta === null ? (
                      <>
                        <Input
                          className="no-print col-span-3 max-w-20"
                          id="gta"
                          {...register('gta')}
                        />
                      </>
                    ) : (
                      scor.gta
                    )}
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell className="text-muted-foreground">Lote</TableCell>
                  <TableCell className="flex justify-end">
                    {scor.lote}
                  </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Qtd macho (cb)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {scor.male ?? 'Não informado'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Peso macho (kg)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {weightTotalMale ?? 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Qtd fêmea (cb)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {scor.female ?? 'Não informado'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Peso fêmea (kg)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {weightTotalFemale ?? 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Peso total (kg)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {scor.weight}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Média total (kg)
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {/* {formatDistanceToNow(scor.created_at, {
                      locale: ptBR,
                      addSuffix: true,
                    })} */}
                    {(Number(scor.weight) / Number(scor.quantity)).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {scor.markings.length <= 0 ? (
              <></>
            ) : (
              <>
                <p>Pesagens ({scor.markings.length})</p>
                <div className="max-h-56 w-full overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sequência</TableHead>
                        <TableHead className="text-right">Qtd. (cb)</TableHead>
                        <TableHead className="text-right">Gênero</TableHead>
                        <TableHead className="text-right">peso (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scor.markings.map((item) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.sequence}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.gender === 'male' ? 'Macho' : 'Fêmea'}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.weight}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
            <TableFooter>
              <TableRow>
                <TableCell className="w-full">
                  Total de animais pesados
                </TableCell>
                <TableCell className="text-right font-medium">
                  {scor.quantity}
                </TableCell>
              </TableRow>
            </TableFooter>

            {/* QR Code for print only */}
            {scor.file_url && (
              <div className="qr-code-print mt-4 items-center p-0">
                <p className="mb-3">Acesse o vídeo da contagem</p>
                <QRCode value={scor.file_url} size={128} />
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button
                variant="secondary"
                // size="xs"
                onClick={handlePrint}
                className="no-print"
                type="button"
              >
                <Printer className="mr-1 h-3 w-3" />
                Imprimir
              </Button>
              {scor.nfe !== null || scor.gta !== null ? (
                <></>
              ) : (
                <Button
                  className="no-print"
                  type="submit"
                  variant="success"
                  disabled={isSubmitted}
                >
                  Salvar
                </Button>
              )}
            </DialogFooter>
          </form>
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  )
}

// CSS for print
const styles = `
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Oculta a scrollbar do Chrome/Safari */
}

.scrollbar-hide {
  -ms-overflow-style: none; /* Oculta a scrollbar do IE 10+ */
  scrollbar-width: none; /* Oculta a scrollbar do Firefox */
}

@media print {
  .qr-code-print {
    display: flex !important;
    // width: 100%;
    align-items: center !important;
    flex-direction: column;
  }
  .card {
    padding: 20px 0px 0px 15px;
    color: black !important; 
    font-weight: 700;
    font-size: 10px;
    th {
       font-size: 12px;
       color: black !important; 
       padding: 0px;
       margin: 0px;
    }
        td {
       font-size: 12px;
       color: black !important; 
       padding: 0px;
       margin: 0px;
    }
      table {
       font-size: 10px;
       color: black !important; 
       padding: 0px;
       margin: 0px;
    }
       div {
        padding: 0px;
         margin: 0px;
       }

       span {
        padding: 10px;
        margin: 0px;
       }
  }
   .no-print {
   display: none !important;
  }
}
@media screen {
  .qr-code-print {
    display: none !important;
  }
}
`

// Append the styles to the head of the document
const styleSheet = document.createElement('style')
styleSheet.type = 'text/css'
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
