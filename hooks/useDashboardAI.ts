import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DashboardAIResponse {
  insight: string;
}

interface DashboardAIPayload {
  logs: any[];
  summary: any;
  userName: string;
}

export const useDashboardAI = (payload: DashboardAIPayload | null) => {
  return useQuery({
    queryKey: ["dashboardAI", payload?.summary?.totalTimeTracked],
    queryFn: async () => {
      if (!payload) throw new Error("No payload provided");
      const { data } = await axios.post<DashboardAIResponse>(
        "/api/ai/dashboard-summary-openrouter",
        payload,
      );
      return data;
    },
    enabled:
      !!payload &&
      !!payload.summary &&
      !!payload.userName &&
      payload.summary.tasksWorkedOn > 0,
    staleTime: 1000 * 60 * 5,
  });
};
