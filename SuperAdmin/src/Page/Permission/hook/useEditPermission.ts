import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/API/docApi';
import type { EditPermission } from '@/Interface/Permission';


export const useEditPermission = () => {
  return useMutation({
    mutationFn: async ({ permission_id, body }: { permission_id: string; body: EditPermission }) => {
      return await docApi.EditPermission(permission_id, body);
    },
  });
};
