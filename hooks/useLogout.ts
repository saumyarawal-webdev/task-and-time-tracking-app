import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/auth/logout');
      return data;
    },
    onSuccess: () => {
      queryClient.clear(); // Clears all cached user data
      router.push('/login');
    },
  });
};