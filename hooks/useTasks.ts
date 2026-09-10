import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Match this interface to your Drizzle schema
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  rawInput: string | null;
  isAiGenerated: boolean;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tasks");
      return data;
    },
  });
};
