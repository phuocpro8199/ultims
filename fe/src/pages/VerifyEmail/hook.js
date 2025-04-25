import { useMutation } from '@tanstack/react-query';
import emaiApi from '../../apis/auth';
export const useVerifyEmail = (...rest) => {
  const verifyEmail = (body) => {
    return emaiApi.verifyEmail(body);
  };
  return useMutation({
    mutationFn: (body) => verifyEmail(body),
    ...rest
  });
};
