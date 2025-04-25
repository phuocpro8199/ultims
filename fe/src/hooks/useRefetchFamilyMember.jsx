import { useQueryClient } from '@tanstack/react-query';

export const useRefetchFamilyMember = () => {
  const queryClient = useQueryClient();
  const refetchFamilyMember = () => {
    queryClient.invalidateQueries({ queryKey: ['family'] });
    queryClient.invalidateQueries({ queryKey: ['member'] });
  };
  return refetchFamilyMember;
};
