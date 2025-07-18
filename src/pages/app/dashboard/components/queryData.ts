import { fetchAndPrepareDashboardData } from "@/api/farm/fetchAndPrepareDashboardData";
import { DashboardFilters } from "@/context/dashboard-context";
import { useQuery } from "@tanstack/react-query";

export function useDashboardData(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard-data", filters],
    queryFn: () =>  fetchAndPrepareDashboardData(filters),
  })
}