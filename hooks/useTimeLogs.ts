import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "./useTasks";
import { TimeLog } from "./useActiveTimer";

export interface TaskTimeSummary {
  task: Task;
  totalDurationSeconds: number;
  logs: TimeLog[];
}

export const useTimeLogs = () => {
  return useQuery<TaskTimeSummary[], Error>({
    queryKey: ["timeLogs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/time-logs");
      return data;
    },
  });
};
