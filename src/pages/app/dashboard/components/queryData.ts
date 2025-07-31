import { fetchAndPrepareDashboardData } from "@/api/farm/fetchAndPrepareDashboardData";
import { DashboardFilters } from "@/context/dashboard-context";
import { useQuery } from "@tanstack/react-query";
import { useCan } from "@/hooks/useCan";
import { useAuth } from "@/hooks/auth";

export function useDashboardData(filters: DashboardFilters) {
  const { can: admin } = useCan({
    rolesRequired: ["admin_access"]
  });
  console.log('admin', admin)
  // Import useAuth to get user info
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard-data", filters, admin, admin ? user?.config_id : null],
    queryFn: () => {

        return fetchAndPrepareDashboardData(filters, admin, user?.config_id);
  
    },
  });
}