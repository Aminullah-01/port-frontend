import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from '@/api/endpoints';
import { adaptCertificate } from '@/lib/type-adapters';
import type { Certificate } from '@/data/portfolio';

const QUERY_KEY = ['certificates'] as const;

export function useCertificates() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await certificatesApi.list({ per_page: 100 });
      return res.map(adaptCertificate);
    },
    staleTime: 30_000,
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => certificatesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => certificatesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => certificatesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
