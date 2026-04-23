import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/API/docApi';
import type { DeleteOrgRs } from '@/Interface/TOrg';


export const useDeleteOrg = () => {
  return useMutation<DeleteOrgRs, any, string>({
    mutationFn: (id: string) => docApi.DeleteOrg(id),
  });
};
