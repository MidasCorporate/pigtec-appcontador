import { Helmet } from 'react-helmet-async'

import { CardDay } from './day-orders-amount-card'
import { CardCalceled } from './month-canceled-orders-amount-card'
import { CardAmount } from './month-orders-amount'
import { CardRevenue } from './month-revenue-card'
import { PopularProductsChart } from './popular-products-chart'
import { RevenueChart } from './revenue-chart'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1>Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <CardRevenue />
          <CardAmount />
          <CardDay />
          <CardCalceled />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <RevenueChart />
          <PopularProductsChart />
        </div>
      </div>
    </>
  )
}
