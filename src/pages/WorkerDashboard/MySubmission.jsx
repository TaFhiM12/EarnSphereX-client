import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { usePageTitle } from '../../hooks/usePageTitle';

const MySubmission = () => {

  usePageTitle('My Submissions', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['workerSubmissions', user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/worker-submissions?workerEmail=${user?.email}&page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-success gap-1 text-white">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-error gap-1 text-white">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="badge badge-warning gap-1 text-white">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-teal-100">
        <table className="table w-full">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th>Task Title</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Submission Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissionsData?.submissions?.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="font-medium">{submission.task_title}</td>
                <td>{submission.Buyer_name}</td>
                <td>${submission.payable_amount}</td>
                <td>
                  {new Date(submission.current_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>{getStatusBadge(submission.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {submissionsData?.submissions?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No submissions found</p>
        </div>
      )}

      {/* Pagination */}
      {submissionsData?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="join-item btn btn-sm bg-white border border-teal-200 hover:bg-teal-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: Math.min(5, submissionsData.totalPages) }, (_, i) => {
              let pageNum;
              if (submissionsData.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= submissionsData.totalPages - 2) {
                pageNum = submissionsData.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`join-item btn btn-sm ${page === pageNum ? 'bg-teal-600 text-white' : 'bg-white border border-teal-200 hover:bg-teal-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(p => Math.min(p + 1, submissionsData.totalPages))}
              disabled={page === submissionsData.totalPages}
              className="join-item btn btn-sm bg-white border border-teal-200 hover:bg-teal-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmission;