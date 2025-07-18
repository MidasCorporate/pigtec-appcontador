import { PiggyBank } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  nickname: string
}

export function CardFarms({ nickname, title }: Props) {
  return (
   <Card className="min-w-[250px] hover:border-emerald-500 transition-all rounded-xl cursor-pointer">

      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
        <PiggyBank className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <>
          <p className="text-xs text-muted-foreground">
            Apelido de acesso:
          </p>
          <span className="text-2xl font-bold tracking-tighter">
            {nickname}
          </span>
          <p className="text-xs text-muted-foreground">
            Contador vinculado:
          </p>
          <span className="text-lg font-bold tracking-tighter">
            Contador pigtec 01
          </span>
        </>
      </CardContent>
    </Card>
  )
}
