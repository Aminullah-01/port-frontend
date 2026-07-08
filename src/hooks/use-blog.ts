import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/api/endpoints';
import { adaptBlog } from '@/lib/type-adapters';
import type { BlogPost } from '@/data/portfolio';

const QUERY_KEY = ['blog'] as const;

export function useBlogPosts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await blogsApi.list({ per_page: 100 });
      return res.map(adaptBlog);
    },
    staleTime: 30_000,
  });
}

export function useBlogPost(id: number) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await blogsApi.get(id);
      return adaptBlog(res);
    },
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => blogsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => blogsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
