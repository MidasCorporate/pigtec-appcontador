import { format } from 'date-fns'

export function handleFormatDate(date: string) {
  const dataFormadet = format(new Date(date), "dd/MM/yyyy 'ás' pp")
  return dataFormadet
}
