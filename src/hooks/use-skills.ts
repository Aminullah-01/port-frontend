import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '@/api/endpoints';
import { adaptSkill } from '@/lib/type-adapters';
import type { Skill } from '@/data/portfolio';

const QUERY_KEY = ['skills'] as const;

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await skillsApi.list({ per_page: 100 });
      return res.map(adaptSkill);
    },
    staleTime: 30_000,
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => skillsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => skillsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
