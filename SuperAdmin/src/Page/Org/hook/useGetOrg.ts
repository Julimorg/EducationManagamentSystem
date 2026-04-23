// useGetOrg.ts
import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { docApi } from "@/API/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { GetOrg } from "@/Interface/TOrg";

type UseOrgOptions = Omit<UseQueryOptions<GetOrg[], unknown>, "queryKey" | "queryFn">;

export const useGetOrg = (
  options?: UseOrgOptions
): UseQueryResult<GetOrg[], unknown> => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.ORG],
    queryFn: () => docApi.GetOrg(),
  });
};
