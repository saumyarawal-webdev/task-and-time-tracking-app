import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DailySummary {
  tasksWorkedOn: number;
  totalTimeTracked: number;
  completedTasks: number;
  pendingOrInProgress: number;
}

export const useSummary = () => {
  return useQuery<DailySummary, Error>({
    queryKey: ["summary"],
    queryFn: async () => {
      const { data } = await axios.get("/api/summary");
      return data;
    },
  });
};
