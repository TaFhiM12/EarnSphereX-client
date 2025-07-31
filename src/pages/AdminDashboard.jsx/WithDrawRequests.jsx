import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { CheckCircle, Clock, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { usePageTitle } from '../../hooks/usePageTitle';

const WithDrawRequests = () => {
  usePageTitle('Withdrawal Requests', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch pending withdrawal requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['withdrawalRequests'],
    queryFn: async () => {
      const res = await axiosSecure.get('/withdrawal-requests');
      return res.data;
    }
  });

  // Approve withdrawal mutation
  const { mutate: approveWithdrawal } = useMutation({
    mutationFn: async ({ id, workerEmail, withdrawalCoin }) => {
      const res = await axiosSecure.patch(`/approve-withdrawal/${id}`, {
        workerEmail,
        withdrawalCoin
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawalRequests']);
      Swal.fire({
        title: 'Success!',
        text: 'Withdrawal approved successfully!',
        icon: 'success',
        confirmButtonColor: '#0d9488', 
        timer: 2000
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to approve withdrawal',
        icon: 'error',
        confirmButtonColor: '#dc2626' 
      });
    }
  });

  const handleApprove = (request) => {
    Swal.fire({
      title: 'Confirm Approval',
      html: `
        <div class="text-left">
          <p>Approve <strong>${request.withdraw_amount}$</strong> withdrawal?</p>
          <div class="mt-2 p-2 bg-gray-50 rounded">
            <p>Worker: <strong>${request.worker_name}</strong></p>
            <p>Method: <strong>${request.payment_system}</strong></p>
            <p>Account: <strong>${request.account_number}</strong></p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669', 
      cancelButtonColor: '#dc2626', 
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      background: '#f8fafc', 
      focusConfirm: false,
      customClass: {
        htmlContainer: 'text-left'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        approveWithdrawal({
          id: request._id,
          workerEmail: request.worker_email,
          withdrawalCoin: request.withdrawal_coin
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
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
              <th>Worker</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Account</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((request) => (
              <motion.tr 
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img src={request.photoURL || 'https://i.ibb.co/xSGyXMv0/tafhim.png'} alt={request.worker_name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{request.worker_name}</div>
                      <div className="text-sm text-gray-500">{request.worker_email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">{request.withdraw_amount}$</span>
                    <span className="text-gray-400 text-xs">({request.withdrawal_coin} coins)</span>
                  </div>
                </td>
                <td className="font-medium">{request.payment_system}</td>
                <td className="font-mono">{request.account_number}</td>
                <td>
                  {new Date(request.withdraw_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  <span className="badge badge-warning gap-1 text-white">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </td>
                <td>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(request)}
                    className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pending withdrawal requests</p>
        </div>
      )}
    </motion.div>
  );
};

export default WithDrawRequests;