import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CreateTaskData {
  title: string;
  description?: string;
  rawInput?: string;
  isAiGenerated?: boolean;
  status?: "pending" | "in_progress" | "completed";
}

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      const { data } = await axios.post("/api/tasks", taskData);
      return data;
    },
    onSuccess: () => {
      // Instantly refreshes the task list after a successful creation
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
