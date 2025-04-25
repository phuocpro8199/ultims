import { useMutation } from '@tanstack/react-query';
import authApi from '@apis/auth';

export const useRegisterMutation = (...rest) => {
  const register = (params) => {
    return authApi.register(params);
  };
  return useMutation({
    mutationFn: (params) => register(params),
    ...rest,
  });
};
