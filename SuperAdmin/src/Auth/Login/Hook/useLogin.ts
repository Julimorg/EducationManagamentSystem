import { useMutation } from '@tanstack/react-query';

import type { Login, LoginResponseTokenData } from '@/Interface/auth';
import { useAuthStore } from '@/Store/auth';
import { docApi } from '@/API/docApi';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: Login) => docApi.Login(body),

  onSuccess: (response: LoginResponseTokenData) => {
    const accessToken = response.token?.accessToken;
    const refreshToken = response.token?.refreshToken;
    const userName = response.userName;
    const userId = response.user_id;

    if (accessToken && refreshToken && userName && userId) {
      setTokens(accessToken, refreshToken,userName, userId);
      // console.log('lưu token vào store:', accessToken, refreshToken,userName);
    } 
  },

  });
};
 