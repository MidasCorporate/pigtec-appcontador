import { ListChecksIcon, PiggyBank, ContainerIcon, Shield, Home } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'
import { useCan } from '@/hooks/useCan'

export interface HeaderProps { }

export function Header() {
  const { can: canManageUsers } = useCan({
    rolesRequired: ["admin_access"],
  })

  console.log('canManageUsers', canManageUsers)
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="items-center flex justify-between">
          <PiggyBank className="h-5 w-5" />
          <span className="m-2">
            Pigtec
          </span>
        </div>
        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Inicio
          </NavLink>
          <NavLink to="/scors">
            <ListChecksIcon className="h-4 w-4" />
            Contagens
          </NavLink>
          {canManageUsers && (
            <>
              <NavLink to="/registers">
                <ContainerIcon className="h-4 w-4" />
                Cadastros
              </NavLink>
              <NavLink to="/permissions-rules">
                <Shield className="h-4 w-4" />
                Funções e Permissões
              </NavLink>
            </>
          )}

        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
