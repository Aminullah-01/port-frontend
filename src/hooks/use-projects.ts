import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/endpoints';
import { adaptProject } from '@/lib/type-adapters';
import type { Project } from '@/data/portfolio';

const QUERY_KEY = ['projects'] as const;

export function useProjects() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await projectsApi.list({ per_page: 100 });
      return res.map(adaptProject);
    },
    staleTime: 30_000,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await projectsApi.get(slug);
      return adaptProject(res);
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => projectsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => projectsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
