interface MetricCard {
  amount: number;
  diffFromLastMonth: number;
}

interface FarmCount {
  farm: string;
  amount: number;
}

interface DailyCount {
  date: string;
  counts: number;
}
