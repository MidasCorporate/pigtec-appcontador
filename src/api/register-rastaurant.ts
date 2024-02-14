import { api } from '@/lib/axios'

export interface RegisterRestaurantInBody {
  restaurantName: string
  email: string
  managerName: string
  phone: string
}

export async function registerRestaurantIn({
  email,
  managerName,
  phone,
  restaurantName,
}: RegisterRestaurantInBody) {
  await api.post('/restaurants', {
    email,
    managerName,
    phone,
    restaurantName,
  })
}
