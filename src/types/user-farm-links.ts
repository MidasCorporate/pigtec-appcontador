export interface UserFarmRole {
  id: string
  farm_id: string
  role_id: string
  created_at: string
  updated_at: string
  farm: {
    id: string
    name: string
    nickname: string
    status: string
    producer_id: string
    config_id: string
    producer?: {
      name: string
    }
  }
  role: {
    id: string
    name: string
    description: string
    identification: string
    roles_of_permissions: Array<{
      id: string
      role_id: string
      permission_id: string
      created_at: string
      updated_at: string
      permission: {
        id: string
        name: string
        description: string
        identification: string
      }
    }>
  }
}