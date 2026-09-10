import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useStartTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await axios.post("/api/tracker/start", { taskId });
      return data;
    },
    onSuccess: () => {
      // Invalidate the active timer query so the UI instantly updates
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
    },
  });
};
