import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await axios.post("/api/auth/register", credentials);
      return data;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
};
