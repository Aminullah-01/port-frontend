import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '@/api/endpoints';
import { adaptMessage } from '@/lib/type-adapters';
import type { Message } from '@/data/portfolio';

const QUERY_KEY = ['messages'] as const;

export function useMessages() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await contactApi.list({ per_page: 100 });
      return res.map(adaptMessage);
    },
    staleTime: 10_000,
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
