import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Eye, ImageIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { usePageTitle } from '../../hooks/usePageTitle';

const TaskToReview = () => {
  usePageTitle('Tasks To Review', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch pending submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['pendingSubmissions'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pending-submissions?buyerEmail=${user.email}`);
      return res.data;
    }
  });

  // Approve submission mutation
  const { mutate: approveSubmission } = useMutation({
    mutationFn: async ({ submissionId, workerEmail, payableAmount, taskId }) => {
      const res = await axiosSecure.patch(`/approve-submission/${submissionId}`, {
        workerEmail,
        payableAmount,
        taskId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingSubmissions']);
      // Also invalidate any related queries if needed
    }
  });

  // Reject submission mutation
  const { mutate: rejectSubmission } = useMutation({
    mutationFn: async ({ submissionId, taskId }) => {
      const res = await axiosSecure.patch(`/reject-submission/${submissionId}`, {
        taskId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingSubmissions']);
    }
  });

  const handleApprove = (submission) => {
    approveSubmission({
      submissionId: submission._id,
      workerEmail: submission.worker_email,
      payableAmount: submission.payable_amount,
      taskId: submission.task_id
    });
  };

  const handleReject = (submission) => {
    rejectSubmission({
      submissionId: submission._id,
      taskId: submission.task_id
    });
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg text-emerald-500"></span></div>;

  return (
    <div className="container mx-auto px-4 pb-8">
      
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th>Worker</th>
              <th>Task Title</th>
              <th>Payable Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img src={submission.worker_photoURL || 'https://i.ibb.co/xSGyXMv0/tafhim.png'} alt={submission.worker_name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{submission.worker_name}</div>
                      <div className="text-sm text-gray-500">{submission.worker_email}</div>
                    </div>
                  </div>
                </td>
                <td className="font-medium">{submission.task_title}</td>
                <td>${submission.payable_amount}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(submission)}
                      className="btn btn-sm btn-ghost bg-teal-100 text-teal-600 hover:bg-teal-200"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(submission)}
                      className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission)}
                      className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pending submissions to review.</p>
        </div>
      )}

      {/* Modal for viewing submission details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-teal-600 mb-4">Submission Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Task Title:</h4>
                <p>{selectedSubmission?.task_title}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Worker:</h4>
                <p>{selectedSubmission?.worker_name} ({selectedSubmission?.worker_email})</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Submission Date:</h4>
                <p>{new Date(selectedSubmission?.current_date).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">Submission Details:</h4>
                <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded mt-1">
                  {selectedSubmission?.submission_details}
                </p>
              </div>

              {selectedSubmission?.submission_image && (
                <div>
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Submitted Image:
                  </h4>
                  <div className="mt-2">
                    <img 
                      src={selectedSubmission.submission_image} 
                      alt="Submission proof" 
                      className="max-w-full h-auto rounded-md border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-action">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskToReview;