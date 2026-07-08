import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/endpoints';
import { adaptProfile } from '@/lib/type-adapters';

const QUERY_KEY = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await profileApi.get();
      return adaptProfile(res);
    },
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => profileApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
