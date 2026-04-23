import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { docApi } from '@/API/docApi';
import { QueryKeys } from '@/Constant/query-key';
import type { Permission } from '@/Interface/Permission';

type UsePermissionOptions = Omit<
  UseQueryOptions<Permission[], unknown>,
  'queryKey' | 'queryFn'
>;

export const useGetPermission = (options?: UsePermissionOptions) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.PERMISSION],
    queryFn: docApi.getAllPermission,
  });
};