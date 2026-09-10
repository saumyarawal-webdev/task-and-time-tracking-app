import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth/me");
      return data;
    },
    retry: false, // Don't keep retrying if unauthorized
  });
};
