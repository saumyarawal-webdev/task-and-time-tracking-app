import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  isAiGenerated?: boolean;
  rawInput?: string;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateTaskData) => {
      const { data } = await axios.patch(`/api/tasks/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
