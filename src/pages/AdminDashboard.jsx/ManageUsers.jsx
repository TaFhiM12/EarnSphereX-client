import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Trash2, User, Mail, Shield, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { usePageTitle } from '../../hooks/usePageTitle';
import Loading from '../../Components/Loading';

const ManageUsers = () => {
  usePageTitle('Manage Users', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // Delete user mutation
  const { mutate: deleteUser } = useMutation({
    mutationFn: (id , email , role) => axiosSecure.delete(`/users/${id}`, { data: { email , role } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        title: 'Deleted!',
        text: 'User has been deleted.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Failed to delete user',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  });

  // Update role mutation
  const { mutate: updateRole } = useMutation({
    mutationFn: ({ id, role }) => axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        title: 'Updated!',
        text: 'User role has been updated.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  });

  const handleDelete = (id, name , email , role) => {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#059669',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id , email , role);
      }
    });
  };

  const handleRoleChange = (id, newRole) => {
    updateRole({ id, role: newRole });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 pb-8"
    >
      
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Coins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <motion.tr 
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img src={user.photoURL || 'https://i.ibb.co/xSGyXMv0/tafhim.png'} alt={user.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="font-mono text-sm">{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="select select-bordered select-sm focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="buyer">Buyer</option>
                    <option value="worker">Worker</option>
                  </select>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    {user.coins || 0}
                  </div>
                </td>
                <td>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(user._id, user.name , user.email , user.role)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUsers;