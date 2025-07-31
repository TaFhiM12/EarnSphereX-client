import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo, isLoading , refetch } = useQuery({
    queryKey: ['userRole', user?.email], 
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data;
    },
    staleTime: 0, 
    refetchOnMount: true, 
  });

  return { userInfo, isLoading , refetch};
};
export default useUserRole;