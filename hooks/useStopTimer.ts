import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useStopTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/tracker/stop");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
    },
  });
};
