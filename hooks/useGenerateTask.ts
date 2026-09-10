import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface GenerateTaskResponse {
  title: string;
  description: string;
}

interface GeneratePayload {
  title: string;
  description: string;
}

export const useGenerateTask = () => {
  return useMutation({
    mutationFn: async (payload: GeneratePayload) => {
      const { data } = await axios.post<GenerateTaskResponse>(
        "/api/ai/generate-task",
        payload,
      );
      return data;
    },
  });
};
