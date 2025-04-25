import { useMutation } from '@tanstack/react-query';
import authApi from '../../apis/auth';

export const useLoginMutation = (...rest) => {
  const login = (params) => {
    return authApi.login(params);
  };
  return useMutation({
    mutationFn: (params) => login(params),
    ...rest
  });
};
