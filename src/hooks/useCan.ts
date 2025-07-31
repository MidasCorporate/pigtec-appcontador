import { useMemo } from "react"
import { useAuth } from "./auth"

interface UseCanParams {
  permissions?: string[]
  rolesRequired?: string[]
}

interface UseCanReturn {
  can: boolean
  userPermissions: string[]
  userRoles: string[]
}

/**
 * Hook para verificar permissões e roles do usuário
 */
export function useCan({ permissions = [], rolesRequired = [] }: UseCanParams = {}): UseCanReturn {
  const { user, roles } = useAuth()
  console.log('useCan', roles)
  const result = useMemo(() => {
    if (!user) {
      return {
        can: false,
        userPermissions: [],
        userRoles: [],
      }
    }

    if (!Array.isArray(roles)) {
      return {
        can: false,
        userPermissions: [],
        userRoles: [],
      }
    }

    // Extrai todas as permissões do usuário de todas as suas roles
    const userPermissions = roles.reduce<string[]>((acc, role) => {
      if (role && typeof role === "object" && Array.isArray((role as any).permissions)) {
        return [...acc, ...((role as any).permissions)]
      }
      return acc
    }, [])

    // Extrai todas as roles do usuário como array de identificações (string[])
    const userRoles: string[] = roles
    
    // Remove duplicatas das permissões
    const uniqueUserPermissions = [...new Set(userPermissions)]

    // Se o usuário tem permissão total, libera acesso completo
    if (uniqueUserPermissions.includes("access_full")) {
      return {
        can: true,
        userPermissions: uniqueUserPermissions,
        userRoles,
      }
    }

    // Verifica se todas as permissões necessárias estão presentes
    const hasRequiredPermissions =
      permissions.length === 0 || permissions.every((permission) => uniqueUserPermissions.includes(permission))

    // Verifica se pelo menos uma das roles necessárias está presente
    const hasRequiredRole = rolesRequired.length === 0 || rolesRequired.some((role) => userRoles.includes(role))

    return {
      can: hasRequiredPermissions && hasRequiredRole,
      userPermissions: uniqueUserPermissions,
      userRoles,
    }
  }, [user, roles, permissions, rolesRequired])

  return result
}
