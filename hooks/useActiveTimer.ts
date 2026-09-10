import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TimeLog {
  id: string;
  userId: string;
  taskId: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
}

export const useActiveTimer = () => {
  return useQuery<TimeLog | null, Error>({
    queryKey: ["activeTimer"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tracker/active");
      return data;
    },
  });
};
