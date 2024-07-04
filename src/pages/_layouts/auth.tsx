import { PiggyBank } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import { CarouselHome } from '@/components/Carousel'

// import cap from '../../assets/cap.jpeg'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <span className="font-semibold">Contador de suinos</span>
          <PiggyBank className="h-5 w-5" />
        </div>
        <div className="flex items-center">
          <CarouselHome />
        </div>
        {/* <div>
          <img src={cap} alt="imagem_background" className="rounded-lg" />
        </div> */}

        <footer className="text-sm">
          Painel de gerenciamento &copy; MidasCorp - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
