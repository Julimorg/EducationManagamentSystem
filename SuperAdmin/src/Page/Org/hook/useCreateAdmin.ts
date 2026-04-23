import { docApi } from '@/API/docApi';
import type { CreateAdmin, CreateAdminRs } from '@/Interface/TCreateAdmin';
import { useMutation } from '@tanstack/react-query';

export const useCreateAdmin = () => {
  return useMutation<CreateAdminRs, Error, CreateAdmin>({
    mutationFn: docApi.CreateAdmin
  });
};
  